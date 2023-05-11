terraform {
  backend "s3" {
    bucket  = var.backend_bucket_name
    region  = "eu-west-3"
    key     = "state.tfstate"
    encrypt = true
  }
}
