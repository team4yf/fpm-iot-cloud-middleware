# Protocol ee

以 ee 开头的协议标准。用于适应 纯 tcp 应用开发的项目中。

## Data Packet Define

```javascript
// The hex data
/*
--------------------------------------------------------------------------------------
| - VID  | - UID |  ProjectID  |      SN      | FN | EXTRA |      DATA...    |  CRC  |
--------------------------------------------------------------------------------------
| - 1B - | - 3B  | ---- 4B --- | ---- 4B ---- | 1B | - 2B -| ----- ?B ------ | - 2B  |
--------------------------------------------------------------------------------------
                               |  ----------------   Origin DATA   ----------------  |
--------------------------------------------------------------------------------------

*/
```

Fields

- VID

  The Protocol ID. Defined `ee`.
- UID

  The User ID.
- ProjectID

  The Project ID.
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