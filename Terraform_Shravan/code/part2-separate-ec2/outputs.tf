output "flask_public_ip" { value = aws_instance.flask.public_ip }
output "flask_url" { value = "http://${aws_instance.flask.public_ip}:5000" }
output "express_public_ip" { value = aws_instance.express.public_ip }
output "express_url" { value = "http://${aws_instance.express.public_ip}:3000" }
output "vpc_id" { value = aws_vpc.main.id }
