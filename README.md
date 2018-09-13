# FPM-IOT-CLOUD-MIDDLEWARE

The middleware for fpm-iot-cloud.

Support the tcp/nb network protocol for devices connect the cloud.

Transform the data from `tcp`/`nb` to the `fpm-iot-cloud-mqtt` server.


## Data Define

the data should be a Buffer array with `hex` . Such as: `00 00 00 01 00 00 00 02 ff fe fd fc 01 03 05` ;

the [1-4] is the UserId, the [5-8] is the ProjectId, the [9-12] is the SerialId, the [13-*] is the origin data

