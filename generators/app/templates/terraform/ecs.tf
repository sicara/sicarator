resource "aws_ecs_cluster" "this" {
  name = local.ecs_cluster_name
}

resource "aws_ecs_task_definition" "this" {
  family                   = "${terraform.workspace}_${var.api_name}_task_def"
  requires_compatibilities = ["EC2"]
  container_definitions = jsonencode([
    {
      name   = "${terraform.workspace}_${var.api_name}_container"
      image  = aws_ecr_repository.this.repository_url
      memory = var.ec2_memory_reserved
      portMappings = [
        {
          containerPort = 80
          hostPort      = 80
          protocol      = "tcp"
        }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-region = var.aws_region
          awslogs-group  = aws_cloudwatch_log_group.this.name
        }
        taskRoleArn = aws_iam_role.ecs_task_role.arn

  } }])
}

resource "aws_ecs_service" "this" {
  name            = "${terraform.workspace}_${var.api_name}_service"
  cluster         = aws_ecs_cluster.this.id
  task_definition = aws_ecs_task_definition.this.arn
  desired_count   = 1

  load_balancer {
    target_group_arn = aws_lb_target_group.this.arn
    container_name   = "${terraform.workspace}_${var.api_name}_container"
    container_port   = 80
  }

  capacity_provider_strategy {
    base              = 1
    capacity_provider = aws_ecs_capacity_provider.this.name
    weight            = 100
  }

  deployment_maximum_percent = 200

  depends_on = [aws_lb_listener.this]

  tags = var.additional_tags
}

resource "aws_ecs_capacity_provider" "this" {
  name = "${terraform.workspace}_${var.api_name}_capacity_provider"
  auto_scaling_group_provider {
    auto_scaling_group_arn = aws_autoscaling_group.this.arn
    managed_scaling {
      status = "ENABLED"
    }
  }
}

resource "aws_ecs_cluster_capacity_providers" "this" {
  cluster_name = aws_ecs_cluster.this.name

  capacity_providers = [aws_ecs_capacity_provider.this.name]

  default_capacity_provider_strategy {
    base              = 1
    weight            = 100
    capacity_provider = aws_ecs_capacity_provider.this.name
  }
}
