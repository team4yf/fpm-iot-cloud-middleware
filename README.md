# FPM-IOT-CLOUD-MIDDLEWARE

The middleware for fpm-iot-cloud.

Support the tcp/nb network protocol for devices connect the cloud.

Transform the data from `tcp`/`nb` to the `fpm-iot-cloud-mqtt` server.


## Data Define

Data Flow From `Device` <=> `Server`

the data should be a Buffer array with `hex` .

It must be `25b` < length < `64kb`
Such as:
```javascript
// The hex data
/*
--------------------------------------------------------------------------------------------------------------
|    UserID    |  ProjectID  |          NBID           |      SN      | FN | EXTRA |      DATA...    |  CRC  |
--------------------------------------------------------------------------------------------------------------
| ---- 4B ---- | ---- 4B --- | --------  8B ---------- | ---- 4B ---- | 1B | - 2B -| ----- ?B ------ | - 2B  |
--------------------------------------------------------------------------------------------------------------
                                                       |  ----------------   Origin DATA   ----------------  |
--------------------------------------------------------------------------------------------------------------

*/
```
## Device Events
- TCP online
- TCP offline
- NB online

## Query
- isTcpOnline?


