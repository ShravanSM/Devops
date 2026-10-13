terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

data "aws_availability_zones" "available" {
  state = "available"
}

data "aws_ami" "amazon_linux" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["al2023-ami-2023.*-x86_64"]
  }

  filter {
    name   = "architecture"
    values = ["x86_64"]
  }
}

# VPC
resource "aws_vpc" "main" {
  cidr_block           = "10.20.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name = "${var.project_name}-vpc"
  }
}

# Internet gateway
resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "${var.project_name}-igw"
  }
}

# Public subnet
resource "aws_subnet" "public" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.20.1.0/24"
  availability_zone       = data.aws_availability_zones.available.names[0]
  map_public_ip_on_launch = true

  tags = {
    Name = "${var.project_name}-public-subnet"
  }
}

# Public route table
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }

  tags = {
    Name = "${var.project_name}-public-rt"
  }
}

resource "aws_route_table_association" "public" {
  subnet_id      = aws_subnet.public.id
  route_table_id = aws_route_table.public.id
}

# Express security group
resource "aws_security_group" "express" {
  name   = "${var.project_name}-express-sg"
  vpc_id = aws_vpc.main.id

  ingress {
    description = "Allow public access to Express frontend"
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "SSH access from configured IP"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [var.ssh_cidr]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.project_name}-express-sg"
  }
}

# Flask security group: allow port 5000 only from Express
resource "aws_security_group" "flask" {
  name   = "${var.project_name}-flask-sg"
  vpc_id = aws_vpc.main.id

  ingress {
    description     = "Allow Flask API traffic from Express"
    from_port       = 5000
    to_port         = 5000
    protocol        = "tcp"
    security_groups = [aws_security_group.express.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.project_name}-flask-sg"
  }
}

# Encode application files for EC2 startup scripts
locals {
  flask_app_b64   = base64encode(file("${path.module}/flask_backend/app.py"))
  flask_req_b64   = base64encode(file("${path.module}/flask_backend/requirements.txt"))
  express_app_b64 = base64encode(file("${path.module}/express_frontend/app.js"))
  express_pkg_b64 = base64encode(file("${path.module}/express_frontend/package.json"))
}

# Flask backend EC2
resource "aws_instance" "flask" {
  ami                         = data.aws_ami.amazon_linux.id
  instance_type               = var.instance_type
  subnet_id                   = aws_subnet.public.id
  vpc_security_group_ids      = [aws_security_group.flask.id]
  associate_public_ip_address = true

  user_data = templatefile(
    "${path.module}/flask_user_data.sh.tftpl",
    {
      flask_app_b64 = local.flask_app_b64
      flask_req_b64 = local.flask_req_b64
    }
  )

  user_data_replace_on_change = true

  tags = {
    Name = "${var.project_name}-flask"
  }
}

# Express frontend EC2
resource "aws_instance" "express" {
  ami                         = data.aws_ami.amazon_linux.id
  instance_type               = var.instance_type
  subnet_id                   = aws_subnet.public.id
  vpc_security_group_ids      = [aws_security_group.express.id]
  associate_public_ip_address = true

  user_data = templatefile(
    "${path.module}/express_user_data.sh.tftpl",
    {
      express_app_b64  = local.express_app_b64
      express_pkg_b64  = local.express_pkg_b64
      flask_private_ip = aws_instance.flask.private_ip
    }
  )

  user_data_replace_on_change = true

  depends_on = [
    aws_instance.flask
  ]

  tags = {
    Name = "${var.project_name}-express"
  }
}
