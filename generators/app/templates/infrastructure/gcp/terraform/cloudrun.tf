# This will just create a default Cloud Run service but it will not update and manage your revisions as Terraform is
# not meant to do this. This can be made with `gcloud` CLI (see Makefile command `deploy-api...`).

resource "google_cloud_run_v2_service" "this" {
  name     = "${terraform.workspace}-${var.api_name}-service"
  ingress  = "INGRESS_TRAFFIC_ALL"
  location = var.gcp_region


  template {
    # This is a demo image that wil be deployed as a placeholder for provisioning the service.
    # Cloud Run indeed needs an image to create a service. Your next image deployment will replace it.
    containers {
      image = "us-docker.pkg.dev/cloudrun/container/hello"
    }
  }

  # We must ignore the changes happening to your revisions which will occur every time you will deploy an image.
  # If not, Terraform will keep tracking and planning update.
  lifecycle {
    ignore_changes = [template[0], client, client_version]
  }
}
