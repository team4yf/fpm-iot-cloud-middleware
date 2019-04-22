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
----------------------------------------------------------------------------------------------------------------
| - VID  | - UID |  ProjectID  |          NBID           |      SN      | FN | EXTRA |      DATA...    |  CRC  |
--------------------------------------------------------------------------------------------------------------
| - 1B - | - 3B  | ---- 4B --- | --------  8B ---------- | ---- 4B ---- | 1B | - 2B -| ----- ?B ------ | - 2B  |
--------------------------------------------------------------------------------------------------------------
                                                         |  ----------------   Origin DATA   ----------------  |
----------------------------------------------------------------------------------------------------------------

*/

### make ssl cert

```bash
$ openssl genrsa -out privatekey.pem 1024
$ openssl req -new -key privatekey.pem -out certrequest.csr 
$ openssl x509 -req -in certrequest.csr -signkey privatekey.pem -days 5480 -out certificate.pem
```

```bash
subject=C = CN, ST = JiangSu, L = YZ, O = yunplus.io, CN = *.yunplus.io, emailAddress = support@yunplus.io
```

- CN
- JiangSu
- YZ
- yunplus.io
- *.yunplus.io
- support@yunplus.io
