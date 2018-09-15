# FPM-IOT-CLOUD-MIDDLEWARE

The middleware for fpm-iot-cloud.

Support the tcp/nb network protocol for devices connect the cloud.

Transform the data from `tcp`/`nb` to the `fpm-iot-cloud-mqtt` server.


## Data Define

Data Flow From `Device` <=> `Server`

the data should be a Buffer array with `hex` .
Such as:
```javascript
// The hex data
/*

---------------------------------------------------------------------------------------------------------------
|             |             |                         |             |      |       |                  |       |
| 00 00 00 01 | 00 00 00 02 | 00 00 00 00 00 00 00 00 | ff fe fd fc |  01  | 03 05 | 01 02 03 04 .... | a1 b2 |
|             |             |                         |             |      |       |                  |       |
\ --- 4B --- / \ --- 4B -- / \ -------  8B --------- / \ --- 4B -- / \ 1B / \  2B / \ ----- ?B ----- / \ 2B  /
|             |             |                         |             |      |       |                  |       |
---------------------------------------------------------------------------------------------------------------
|             |             |                         |             |      |       |                  |       |
|   UserID    |  ProjectID  |          NBID           |      SN     |  FN  | EXTRA |        DATA      |  CRC  |
|             |             |                         |             |      |       |                  |       |
---------------------------------------------------------------------------------------------------------------
                                                      |                                                       |
                                                      \  -----------------   Origin DATA   -----------------  /
---------------------------------------------------------------------------------------------------------------

*/
```
## Device Events
- TCP online
- TCP offline
- NB online

## Query
- isTcpOnline?


