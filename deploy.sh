ENV=$1
docker-compose -f ./docker-compose-$ENV.yml up -d --build
