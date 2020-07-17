#!/bin/bash

export DOCKER_COMPOSE_VERSION=1.26.2
export ORM_CONNECTION=postgres
export ORM_HOST=db
export ORM_USERNAME=postgres
export ORM_PASSWORD=postgres
export ORM_DATABASE=movierental
export ORM_TEST_DATABASE=movierental_test
export ORM_PORT=5432
export ORM_SYNCHRONIZE=false
export ORM_ENTITIES=dist/**/entities/*.js
export ORM_MIGRATIONS_TABLE_NAME=migration
export ORM_MIGRATIONS=dist/database/migrations/*.js
export ORM_MIGRATIONS_DIR=migrations
export ORM_MIGRATIONS_RUN=false

sudo rm /usr/local/bin/docker-compose
curl -L https://github.com/docker/compose/releases/download/${DOCKER_COMPOSE_VERSION}/docker-compose-`uname -s`-`uname -m` > docker-compose
chmod +x docker-compose
sudo mv docker-compose /usr/local/bin