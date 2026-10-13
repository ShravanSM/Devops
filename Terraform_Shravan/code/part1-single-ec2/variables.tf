variable "aws_region" {
  description = "AWS region for this assignment"
  type        = string
  default     = "ap-south-1"
}

variable "project_name" {
  type    = string
  default = "terraform-assignment-8"
}

variable "instance_type" {
  type    = string
  default = "t3.micro"
}

variable "ssh_cidr" {
  description = "Your public IPv4 address in CIDR form, e.g. 203.0.113.10/32. Set to 0.0.0.0/0 only temporarily if you understand the risk."
  type        = string
  default     = "0.0.0.0/0"
}
