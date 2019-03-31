# Protocol DD

以 dd 开头的协议标准。用于适应 yiyuan NBIOT 应用开发的项目中。

## Data Packet Define

```javascript
// The hex data
/*
----------------------------------------------------------------------------------------------------------------
| - VID  | - UID |  ProjectID  |        DeviceID         |      SN      | FN | EXTRA |      DATA...    |  CRC  |
--------------------------------------------------------------------------------------------------------------
| - 1B - | - 3B  | ---- 4B --- | --------  36B --------- | ---- 4B ---- | 1B | - 2B -| ----- ?B ------ | - 2B  |
--------------------------------------------------------------------------------------------------------------
                                                         |  ----------------   Origin DATA   ----------------  |
----------------------------------------------------------------------------------------------------------------

*/
```

Fields

- VID

  The Protocol ID. Defined `0xdd`.
- UID

  The User ID.
- ProjectID

  The Project ID.
- NBID

  The Device's NBID.
- SN

  The Device's SN Code.
- FN

  The Function Code.
- EXTRA

  The Extra Code.
- DATA

  The Main Data.
- CRC

  The CRC16 Compare Code.
