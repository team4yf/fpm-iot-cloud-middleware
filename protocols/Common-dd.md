# Protocol DD

以 dd 开头的协议标准。用于适应 yiyuan NBIOT 应用开发的项目中。

## Data Packet Define

平台使用的数据接口限制了使用 16 进制的数据传输，因此无法使用之前的方式来交互数据。
定义了一个结构体`Payload`来封装数据包头和数据体; 默认最多使用 `40B` 的数据长度；根据其 `LENGTH` 字段来协商数据长度，避免数据超出长度。

### Payload Define

消息体包含了业务数据的详细内容，定义其名称： `Payload` .

Fields

  - VID [1B]

    The Protocol ID. Defined `0xdd` = `221`.
  - UID [3B]

    The User ID.
  - PID [4B]

    The Project ID.

  - SID [4B]

    The Device's SN Code.
  - FN [1B]

    The Function Code.
  - EXTRA [2B]

    The Extra Code.

  - LENGTH [1B]

    The length of the data body.
  - DATA_1 [4B]

    The part1 of the data.

  - DATA_`?` [4B]

    The part`?` of the data. The `?` means `1-10`, Totally, the data max length is `40B`

  
  
### Cmd Define

控制命令的消息结构体, 定义其名称：`Cmd` 。

Fiedls:

  - FN [1B]

    The Function Code.
  - EXTRA [2B]

    The Extra Code.
  - LENGTH [1B]

    The length of the data body.
  - DATA_1 [4B]

    The part1 of the data.

  - DATA_`?` [4B]

    The part`?` of the data. The `?` means `1-10`, Totally, the data max length is `40B`


## make the url has been subscribe

`http://a.yunplus.io:9992/webhook/tianyi/notify/datachange`