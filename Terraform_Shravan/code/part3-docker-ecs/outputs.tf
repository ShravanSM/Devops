output "flask_ecr_repository_url" { value = aws_ecr_repository.flask.repository_url }
output "express_ecr_repository_url" { value = aws_ecr_repository.express.repository_url }
output "alb_url" { value = "http://${aws_lb.app.dns_name}" }
output "ecs_cluster_name" { value = aws_ecs_cluster.main.name }
