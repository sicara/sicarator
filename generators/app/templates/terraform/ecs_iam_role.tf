data "aws_iam_policy_document" "assume_ec2_role" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      identifiers = ["ec2.amazonaws.com"]
      type        = "Service"
    }
  }
}

resource "aws_iam_role" "ec2_for_ecs_role" {
  assume_role_policy = data.aws_iam_policy_document.assume_ec2_role.json
  name               = "${terraform.workspace}EC2ForECSRole"
  tags               = var.additional_tags
}

resource "aws_iam_instance_profile" "ec2_for_ecs_profile" {
  name = "${terraform.workspace}EC2ForECSProfile"
  role = aws_iam_role.ec2_for_ecs_role.name
  tags = var.additional_tags

}

resource "aws_iam_role_policy_attachment" "attach_container_permissions_to_ec2_for_ecs_role" {
  role       = aws_iam_role.ec2_for_ecs_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonEC2ContainerServiceforEC2Role"
}
