# API infrastructure

Terraform code for the infrastructure of the API of <%= projectName %>

## Setup
- [Install terraform](https://developer.hashicorp.com/terraform/tutorials/aws-get-started/install-cli)
- [Install TFlint](https://github.com/terraform-linters/tflint)
- [Install terraform-docs](https://github.com/terraform-docs/terraform-docs)

- Init the project locally:
```bash
terraform init
```

- Install TFlint pluggins:
```bash
tflint --init
```

- Install pre-commit git hooks (running before commit and push commands). PS: you may need to
install the [pluggin](https://pre-commit.com/) first

```bash
pre-commit install
```

- If you are the first one to initialize the project, you need to create the development 
workspace (you may delete this section afterwards):
```bash
terraform workspace new dev
```

- Select the development workspace to start iterating.
```bash
terraform workspace select dev
```

## Terraform Usage
[Basic terraform commands](https://developer.hashicorp.com/terraform/cli/commands)

### Process to add/delete a resource

Select the environment you want to deploy on:
```bash
terraform workspace select <env_name>
```

Then check the module adding/deletion plan
```bash
terraform plan
```

If the plan suits what you were expecting, deploy in the development environnement by running:

```bash
terraform apply
```

## Pricing of the api architecture
- API gateway: free for the first 1M requests per month, then ~$1 per million requests. [Link](https://aws.amazon.com/fr/api-gateway/pricing/)
- Application Load Balancer: ~16$ per month. [Link](https://aws.amazon.com/fr/elasticloadbalancing/pricing/)
- EC2: Depends on the chosen instance. [Link](https://aws.amazon.com/fr/ec2/pricing/on-demand/)
- ECR: <1$ per month. [Link](https://aws.amazon.com/fr/ecr/pricing/)
- S3: <1$ per month. [Link](https://aws.amazon.com/fr/s3/pricing/)
- ECS, VPC, ESG: Free (no overhead charge)

# Documentation Generated by terraform-docs
<!-- BEGIN_TF_DOCS -->
## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_terraform"></a> [terraform](#requirement\_terraform) | >= 1.3.0 |
| <a name="requirement_aws"></a> [aws](#requirement\_aws) | ~> 4.56 |

## Providers

| Name | Version |
|------|---------|
| <a name="provider_aws"></a> [aws](#provider\_aws) | 4.56.0 |

## Modules

| Name | Source | Version |
|------|--------|---------|
| <a name="module_api_gateway"></a> [api\_gateway](#module\_api\_gateway) | terraform-aws-modules/apigateway-v2/aws | 2.2.2 |
| <a name="module_vpc"></a> [vpc](#module\_vpc) | git::https://github.com/padok-team/terraform-aws-network.git | v0.1.1 |

## Resources

| Name | Type |
|------|------|
| [aws_appautoscaling_policy.model_api_cpu_tracking](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/appautoscaling_policy) | resource |
| [aws_appautoscaling_policy.model_api_memory_tracking](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/appautoscaling_policy) | resource |
| [aws_appautoscaling_target.this](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/appautoscaling_target) | resource |
| [aws_autoscaling_group.this](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/autoscaling_group) | resource |
| [aws_cloudwatch_log_group.this](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudwatch_log_group) | resource |
| [aws_ecr_lifecycle_policy.this](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/ecr_lifecycle_policy) | resource |
| [aws_ecr_repository.this](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/ecr_repository) | resource |
| [aws_ecs_capacity_provider.this](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/ecs_capacity_provider) | resource |
| [aws_ecs_cluster.this](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/ecs_cluster) | resource |
| [aws_ecs_cluster_capacity_providers.this](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/ecs_cluster_capacity_providers) | resource |
| [aws_ecs_service.this](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/ecs_service) | resource |
| [aws_ecs_task_definition.this](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/ecs_task_definition) | resource |
| [aws_iam_instance_profile.ec2_for_ecs_profile](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_instance_profile) | resource |
| [aws_iam_role.ec2_for_ecs_role](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role) | resource |
| [aws_iam_role_policy_attachment.attach_container_permissions_to_ec2_for_ecs_role](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy_attachment) | resource |
| [aws_launch_configuration.this](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/launch_configuration) | resource |
| [aws_lb.this](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lb) | resource |
| [aws_lb_listener.this](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lb_listener) | resource |
| [aws_lb_target_group.this](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lb_target_group) | resource |
| [aws_security_group.http_communication_inside_vpc](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group) | resource |
| [aws_security_group.outbounds_https_communication_on_all_cidr_blocks](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group) | resource |
| [aws_security_group_rule.http_egress](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group_rule) | resource |
| [aws_security_group_rule.http_ingress](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group_rule) | resource |
| [aws_security_group_rule.https_egress_on_all_cidr_blocks](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group_rule) | resource |
| [aws_ami.ecs_optimized_ami](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/ami) | data source |
| [aws_iam_policy_document.assume_ec2_role](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_additional_tags"></a> [additional\_tags](#input\_additional\_tags) | Additional resource tags | `map(string)` | <pre>{<br>  "Terraform": "True"<br>}</pre> | no |
| <a name="input_api_name"></a> [api\_name](#input\_api\_name) | Name appended to resources specific to the infrastructure of the api | `string` | `"api"` | no |
| <a name="input_aws_region"></a> [aws\_region](#input\_aws\_region) | Region in which the resources are deployed | `string` | `"<%= AwsRegion %>"` | no |
| <a name="input_ec2_instance_type"></a> [ec2\_instance\_type](#input\_ec2\_instance\_type) | Name of the aws EC2 instance to use in the api | `string` | `"t2.medium"` | no |
| <a name="input_ec2_memory_reserved"></a> [ec2\_memory\_reserved](#input\_ec2\_memory\_reserved) | The amount of memory (in MiB) to reserve for the api container inside the EC2. Warning: you must select a value below the RAM capacity of the chosen instance | `number` | `3500` | no |

## Outputs

No outputs.
<!-- END_TF_DOCS -->
<!-- DO NOT MANUALLY ADD DOCUMENTATION BEYOND THIS HOOK -->