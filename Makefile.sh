#! /bin/sh
docker build -t fpm-iot-middleware .

docker tag fpm-iot-middleware yfsoftcom/fpm-iot-middleware:latest

docker push yfsoftcom/fpm-iot-middleware:latest