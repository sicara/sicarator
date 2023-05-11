module "api_gateway" {
  source                 = "terraform-aws-modules/apigateway-v2/aws"
  version                = "2.2.2"
  name                   = "${terraform.workspace}_${var.api_name}_application_gateway"
  protocol_type          = "HTTP"
  create_api_domain_name = false

  # TODO: CORS are currently too permissive. They should be restricted according to the application's usage
  cors_configuration = {
    allow_headers = ["content-type", "x-amz-date", "authorization", "x-api-key", "x-amz-security-token", "x-amz-user-agent"]
    allow_methods = ["OPTIONS", "GET", "POST"]
    allow_origins = ["*"]
  }

  integrations = {
    "ANY /{proxy+}" = {
      connection_type    = "VPC_LINK"
      vpc_link           = "http_communication_inside_vpc_link"
      integration_uri    = aws_lb_listener.this.arn
      integration_type   = "HTTP_PROXY"
      integration_method = "ANY"
    }
  }

  tags = var.additional_tags

  vpc_links = {
    http_communication_inside_vpc_link = {
      name               = local.vpc_name
      security_group_ids = [aws_security_group.http_communication_inside_vpc.id]
      subnet_ids         = module.vpc.public_subnets_ids
    }
  }
}
