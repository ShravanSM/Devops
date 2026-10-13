# Terraform Assignment 8 — Flask + Express on AWS

This is a starter project for the three configurations in the assignment:
1. Both applications on one EC2 instance.
2. Flask and Express on separate EC2 instances.
3. Docker containers on ECR/ECS Fargate behind an Application Load Balancer.

**Important:** This package contains demo Flask and Express applications, not your original application code. Replace the demo apps with your own code when ready. Review every Terraform plan before applying it.

## Prerequisites
- Terraform installed and available in PowerShell
- AWS CLI configured (`aws configure`) for your practice account
- Docker Desktop running for Part 3
- AWS region defaults to `ap-south-1`

Check credentials:
```powershell
aws sts get-caller-identity
```

## Folder guide
- `part1-single-ec2/` — one EC2 instance; installs both demo applications with user data.
- `part2-separate-ec2/` — two EC2 instances in a dedicated VPC.
- `part3-docker-ecs/` — ECR, VPC, ECS/Fargate and ALB Terraform configuration.
- `docs/` — screenshot checklist and submission notes.

## Part 1 — Single EC2
From PowerShell:
```powershell
cd "$HOME\OneDrive\Desktop\Terraform_Shravan\part1-single-ec2"
terraform init
terraform fmt
terraform validate
terraform plan
terraform apply
```
Type `yes` only after reviewing the plan. Note the public IP from outputs.
- Flask: `http://PUBLIC_IP:5000`
- Express: `http://PUBLIC_IP:3000`

The user-data script installs packages on first boot. Startup may take several minutes. If an app does not respond immediately, wait a little and inspect EC2 system logs before changing configuration.

Cleanup after screenshots/testing:
```powershell
terraform destroy
```

## Part 2 — Separate EC2
```powershell
cd "$HOME\OneDrive\Desktop\Terraform_Shravan\part2-separate-ec2"
terraform init
terraform fmt
terraform validate
terraform plan
terraform apply
```
Flask and Express each have their own public IP. Outputs show both IPs. The Flask security group allows port 5000 from the internet for assignment testing; the Express instance can reach Flask on port 5000. Restrict public access further for real deployments.

Cleanup:
```powershell
terraform destroy
```

## Part 3 — ECR + ECS Fargate + ALB (two-stage workflow)
This part needs images in ECR before ECS services can start. The configuration uses an `enable_services` variable so infrastructure/repositories can be created first.

### Stage A: create repositories and base infrastructure
```powershell
cd "$HOME\OneDrive\Desktop\Terraform_Shravan\part3-docker-ecs"
terraform init
terraform fmt
terraform validate
terraform plan -var="enable_services=false"
terraform apply -var="enable_services=false"
```
Record ECR repository URLs from outputs.

### Build and push the images
Run these commands in PowerShell from `part3-docker-ecs` (replace `<AWS_ACCOUNT_ID>` with your account ID):
```powershell
$AccountId = (aws sts get-caller-identity --query Account --output text)
$Region = "ap-south-1"
$FlaskRepo = "$AccountId.dkr.ecr.$Region.amazonaws.com/terraform-assignment-8-flask"
$ExpressRepo = "$AccountId.dkr.ecr.$Region.amazonaws.com/terraform-assignment-8-express"

aws ecr get-login-password --region $Region | docker login --username AWS --password-stdin "$AccountId.dkr.ecr.$Region.amazonaws.com"

docker build -t $FlaskRepo:latest .\flask_backend
docker push $FlaskRepo:latest
docker build -t $ExpressRepo:latest .\express_frontend
docker push $ExpressRepo:latest
```

### Stage B: create ECS services and ALB targets
```powershell
terraform apply -var="enable_services=true"
```
When successful, use the `alb_url` output. The ALB routes `/api/*` to Flask and other paths to Express. The demo Express app uses `/api/health` to demonstrate backend reachability; in a real frontend, configure API calls to `/api`.

**Note:** ECS services may take several minutes to become healthy. If they do not, check ECS service events, task stopped reasons, and CloudWatch logs.

Cleanup Part 3:
```powershell
terraform destroy -var="enable_services=true"
```
If Terraform says the configuration differs because the variable value changed, rerun destroy with the same variable values used for the latest apply. Confirm the ALB, ECS services, ECR repositories, and VPC resources are removed. ECR repositories are configured to allow deletion with images.

## Terraform state
The starter uses local state to keep the initial exercise simple. The assignment mentions an S3 backend; configure an S3 backend only after creating a uniquely named bucket and planning state migration. Do not configure a backend pointing to a bucket that does not exist. Do not commit state files or credentials.

## Security and cost
These resources can incur charges, especially EC2, NAT gateways (not used here), public IPv4 addresses, and the Application Load Balancer. Apply only when ready to test, capture evidence, then destroy resources. Never commit AWS credentials. The assignment asks for a GitHub repository link; GitHub steps are intentionally excluded as requested, so that deliverable remains for you to handle separately if required.
