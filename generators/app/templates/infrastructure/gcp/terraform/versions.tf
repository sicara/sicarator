terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~>4.70"
    }
  }

  required_version = ">= 1.3.0"
}
