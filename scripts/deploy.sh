#!/bin/bash

if [ -z "$1" ]; then
  echo "Usage: $0 <environment>"
  echo "Example: $0 dev"
  exit 1
fi

ENV=$1
COMPOSE_FILE="./docker-compose-$ENV.yml"

if [ ! -f "$COMPOSE_FILE" ]; then
  echo "Error: $COMPOSE_FILE does not exist."
  exit 1
fi

RUNNING_CONTAINERS=$(docker-compose -f "$COMPOSE_FILE" ps -q)

if [ -n "$RUNNING_CONTAINERS" ]; then
  echo "Docker containers for $ENV are already running. Stopping them..."
  docker-compose -f "$COMPOSE_FILE" down
fi

echo "Starting Docker containers for $ENV..."
docker-compose -f "$COMPOSE_FILE" up -d --build

echo "Done!"
