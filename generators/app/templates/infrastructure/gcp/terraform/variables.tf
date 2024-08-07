variable "additional_tags" {
  description = "Additional resource tags"
  type        = map(string)
  default = {
    "terraform" = "true"
  }
}

variable "gcp_region" {
  description = "Region in which the resources are provisioned"
  type        = string
  default     = "<%= gcpRegion %>"
}

variable "gcp_project_id" {
  description = "GCP project ID in which resources will be created"
  type        = string
  default     = "<%= gcpProjectId %>"
}

variable "api_name" {
  description = "Name appended to resources specific to the infrastructure of the api"
  type        = string
  default     = "api"
}
