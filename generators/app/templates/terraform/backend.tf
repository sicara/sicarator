terraform {
  backend "s3" {
    bucket  = "<%= terraformBackendBucketName %>"
    region  = "<%= AwsRegion %>"
    key     = "state.tfstate"
    encrypt = true
  }
}
