output "service_url" {
  description = "URL of the service in Cloud Run"
  value       = google_cloud_run_v2_service.this.uri
}

output "docker_registry_url" {
  description = "Base URL of the Doker registry"
  value       = "${var.gcp_region}-docker.pkg.dev/${var.gcp_project_id}/${google_artifact_registry_repository.this.repository_id}"
}
