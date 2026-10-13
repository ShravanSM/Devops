variable "aws_region" {
  type    = string
  default = "ap-south-1"
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
  description = "Your public IP in CIDR form, e.g. 203.0.113.10/32"
  type        = string
  default     = "0.0.0.0/0"
}
