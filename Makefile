all: build push clean

build:
	docker build -t yfsoftcom/fpm-iot-middleware:latest .
push:
	docker push yfsoftcom/fpm-iot-middleware:latest
clean:
	rm -rf app.log