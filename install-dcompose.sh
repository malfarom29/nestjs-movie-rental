#!/bin/bash

export DOCKER_COMPOSE_VERSION=1.26.2

sudo rm /usr/local/bin/docker-compose
curl -L https://github.com/docker/compose/releases/download/${DOCKER_COMPOSE_VERSION}/docker-compose-`uname -s`-`uname -m` > docker-compose
chmod +x docker-compose
sudo mv docker-compose /usr/local/bin

curl -o- -L https://yarnpkg.com/install.sh | bash -s -- --version 1.22.4
export PATH="$HOME/.yarn/bin:$PATH"