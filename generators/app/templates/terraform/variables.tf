variable "additional_tags" {
  description = "Additional resource tags"
  type        = map(string)
  default = {
    Terraform = "True"
  }
}

variable "aws_region" {
  description = "Region in which the resources are deployed"
  type        = string
  default     = "eu-west-3"
}

variable "backend_bucket_name" {
  description = "Name of the backend bucket"
  type        = string
  default     = "<%= terraformBackendBucketName %>"
}

variable "api_name" {
  description = "Name appended to resources specific to the infrastructure of the api"
  type        = string
  default     = "api"
}

variable "ec2_instance_type" {
  description = "Name of the aws EC2 instance to use in the api"
  type        = string
  default     = "t2.medium"
}

variable "ec2_memory_reserved" {
  description = "The amount of memory (in MiB) to reserve for the api container inside the EC2. Warning: you must select a value below the RAM capacity of the chosen instance"
  type        = number
  default     = 3500
}
