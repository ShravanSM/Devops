variable "aws_region" {
  type    = string
  default = "ap-south-1"
}
variable "project_name" {
  type    = string
  default = "terraform-assignment-8"
}
variable "enable_services" {
  description = "Set false for initial infrastructure/ECR creation, then push images and set true to create ECS services."
  type        = bool
  default     = true
}
