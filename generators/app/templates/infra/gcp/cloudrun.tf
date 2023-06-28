# This will just create a default Cloud Run service but 
# it will not update and mangae your revisions as Terraform is not meant to do this, that's a CD job.

resource "google_cloud_run_v2_service" "this" {
  name     = "${var.api_name}-service-${terraform.workspace}"
  ingress  = "INGRESS_TRAFFIC_ALL"
  location = var.gcp_region


  template {
    containers {
      image = "us-docker.pkg.dev/cloudrun/container/hello"

      env {
        name  = "ENV"
        value = "dev"
      }
    }
  }

  lifecycle {
    ignore_changes = [template[0].containers[0].image, client, client_verison]
  }
}
