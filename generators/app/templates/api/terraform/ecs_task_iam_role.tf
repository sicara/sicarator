data "aws_iam_policy_document" "assume_ecs_task_role" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      identifiers = ["ecs-tasks.amazonaws.com"]
      type        = "Service"
    }
  }
}

data "aws_iam_policy_document" "ecs_task_policy" {
  statement {
    actions = [
      "s3:GetObject",
      "s3:ListBucket",
      "s3:PutObject"

    ]

    resources = [
      "arn:aws:s3:::m33-documentation-seeker-requests-history/*",
      "arn:aws:s3:::m33-documentation-seeker-requests-history"
    ]
  }
}

resource "aws_iam_role" "ecs_task_role" {
  assume_role_policy = data.aws_iam_policy_document.assume_ecs_task_role.json
  name               = "${terraform.workspace}ECSTaskRole"
  tags               = var.additional_tags
}

resource "aws_iam_role_policy_attachment" "attach_container_permissions_to_ecs_task_role" {
  role       = aws_iam_role.ec2_for_ecs_role.name
  policy_arn = aws_iam_policy.ecs_task_policy.arn
}

resource "aws_iam_policy" "ecs_task_policy" {
  name   = "${terraform.workspace}_${var.api_name}_ecs_task_policy"
  tags   = var.additional_tags
  policy = data.aws_iam_policy_document.ecs_task_policy.json

}
