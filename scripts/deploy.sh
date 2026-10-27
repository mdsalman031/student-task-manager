#!/usr/bin/env sh
set -eu

: "${DEPLOY_HOST:?Set DEPLOY_HOST to the SSH host, for example user@example.com}"
: "${IMAGE:?Set IMAGE to a versioned container image}"
CONTAINER_NAME="${CONTAINER_NAME:-student-task-manager}"
HOST_PORT="${HOST_PORT:-8080}"

ssh "$DEPLOY_HOST" "
  docker pull '$IMAGE' &&
  (docker stop '$CONTAINER_NAME' 2>/dev/null || true) &&
  (docker rm '$CONTAINER_NAME' 2>/dev/null || true) &&
  docker run -d --name '$CONTAINER_NAME' --restart unless-stopped -p '$HOST_PORT:8080' '$IMAGE'
"
