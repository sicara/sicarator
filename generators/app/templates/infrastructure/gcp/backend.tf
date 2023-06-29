terraform {
  backend "gcs" {
    bucket = "<%= terraformBackendBucketName %>"
    prefix = "terraform/state"
  }
}
