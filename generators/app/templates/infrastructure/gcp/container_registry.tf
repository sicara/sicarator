resource "google_artifact_registry_repository" "this" {
  repository_id = "${terraform.workspace}_${var.api_name}_docker_registry"
  description   = "Docker registry for ${var.api_name}"
  format        = "DOCKER"

  labels = var.additional_tags
}
