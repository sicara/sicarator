terraform {
  backend "gcs" {
    # bucket = "<%= terraformBackendBucketName %>"
    bucket = "terraform-kube-dbt-demo"
    prefix = "terraform/state"
  }

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~>4.70"
    }
  }

  required_version = ">= 1.3.0"
}

provider "google" {
  project = "kube-dbt-demo"
  region  = "europe-west1"
}
