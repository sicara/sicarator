terraform {
  backend "s3" {
    bucket  = "<%= terraformBackendBucketName %>"
    region  = "<%= terraformAwsRegion %>"
    key     = "state.tfstate"
    encrypt = true
  }
}
