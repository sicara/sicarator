resource "google_artifact_registry_repository" "this" {
  repository_id = "docker-registry-${var.api_name}-${terraform.workspace}"
  description   = "Docker registry for ${var.api_name}"
  format        = "DOCKER"

  labels = var.additional_tags
}
