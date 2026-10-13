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

resource "aws_security_group" "app_sg" {
  name        = "${var.project_name}-single-ec2-sg"
  description = "Assignment demo access to Flask and Express"

  ingress {
    description = "SSH - restrict this CIDR to your own IP before real use"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [var.ssh_cidr]
  }

  ingress {
    description = "Flask demo"
    from_port   = 5000
    to_port     = 5000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Express demo"
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = { Name = "${var.project_name}-single-ec2-sg" }
}

locals {
  flask_app_b64   = base64encode(file("${path.module}/flask_backend/app.py"))
  flask_req_b64   = base64encode(file("${path.module}/flask_backend/requirements.txt"))
  express_app_b64 = base64encode(file("${path.module}/express_frontend/app.js"))
  express_pkg_b64 = base64encode(file("${path.module}/express_frontend/package.json"))
}

resource "aws_instance" "app" {
  ami                         = data.aws_ami.amazon_linux.id
  instance_type               = var.instance_type
  vpc_security_group_ids      = [aws_security_group.app_sg.id]
  user_data_replace_on_change = true

  user_data = templatefile("${path.module}/user_data.sh.tftpl", {
    flask_app_b64   = local.flask_app_b64
    flask_req_b64   = local.flask_req_b64
    express_app_b64 = local.express_app_b64
    express_pkg_b64 = local.express_pkg_b64
  })

  tags = { Name = "${var.project_name}-single-ec2" }
}
