terraform {
  backend "s3" {
    bucket  = "<%= terraformBackendBucketName %>"
    region  = "<%= awsRegion %>"
    key     = "state.tfstate"
    encrypt = true
  }
}
