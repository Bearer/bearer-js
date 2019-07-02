workflow "Test Toolkit" {
  on       = "push"

  resolves = [
    "Test"
  ]
}

action "Install" {
  uses = "docker://node:10"
  runs = "yarn"
  args = "install --frozen-lockfile"
}

action "Test" {
  uses  = "docker://node:10"
  # postinstall is runing bootstrap
  needs = "Install"
  runs  = "yarn"

  args  = [
    "test"
  ]

  env   = {
    DEBUG = "bearer:*"
  }
}
