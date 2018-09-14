# FPM-IOT-CLOUD-MIDDLEWARE

The middleware for fpm-iot-cloud.

Support the tcp/nb network protocol for devices connect the cloud.

Transform the data from `tcp`/`nb` to the `fpm-iot-cloud-mqtt` server.


## Data Define

Data Flow From `Device` <=> `Server`

the data should be a Buffer array with `hex` .
Such as: `00 00 00 01 | 00 00 00 02 | 00 00 00 00 ff fe fd fc 00 00 00 00 ff fe fd fc | 01 03 05 ....` .

the [1-4] is the UserId, the [5-8] is the ProjectId, the [9-16] is the NB Id, the [17-20] is the SerialId, the [17-*] is the origin data .

This NB code is string as `hex` with length = 15




