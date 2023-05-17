plugin "aws" {
    enabled = true
    version = "0.21.2"
    source  = "github.com/terraform-linters/tflint-ruleset-aws"
}

plugin "terraform" {
  enabled = true
}

# Disallow the need for main.tf file
rule "terraform_standard_module_structure" {
  enabled = false
}
