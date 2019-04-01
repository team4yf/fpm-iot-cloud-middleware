# Protocol DD

以 dd 开头的协议标准。用于适应 yiyuan NBIOT 应用开发的项目中。

## Data Packet Define

平台使用的数据接口限制了使用 16 进制的数据传输，因此无法使用之前的方式来交互数据。

定义了一个结构体来封装数据包头，数据上下文使用 `JsonObject` 的格式直接交互。

### Header Define

包头占用一个 Service, 定义其名称： `Header` 。

Fields

  - VID [1B]

    The Protocol ID. Defined `0xdd` = `221`.
  - UID [3B]

    The User ID.
  - PID [4B]

    The Project ID.

  - SN [4B]

    The Device's SN Code.
  - FN [1B]

    The Function Code.
  - EXTRA [2B]

    The Extra Code.

### Payload Define

消息体包含了业务数据的详细内容，定义其名称： `Payload` .

Fields

  - LENGTH [1B]

    The length of the data body.
  - DATA_1 [4B]

    The part1 of the data.

  - DATA_`?` [4B]

    The part`?` of the data. The `?` means `1-10`, Totally, the data max length is `40B`

  
  


## make the url has been subscribe

`http://a.yunplus.io:9992/webhook/tianyi/notify/datachange`