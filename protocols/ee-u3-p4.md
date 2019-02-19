# Protocol 00-u3-p4

基本数据格式参考 [Common-ee.md](./Common-ee.md).

## Topics

- `$d2s/u3/p4/tcp`

  业务端订阅该主题，可接收到该项目下所有的 tcp 网络数据。


## Functions

约定 < 0x10 的指令均为 设备向平台推送的数据, > 0x0f 的指令，均为平台向设备发送的指令

- 0x01 上传设备状态
  > 通常由设备主动反馈
  - Data [ JSON ]:
  - Ex:
    ```
    ff fe fd fc | 01 | 00 01 | 01 | JSON
    ```

  数据示例：
    {
      "sn_id":”abcdefgh”,
      "opcode": 1001,
      "device_type": 20,
      "min_wind_dir": 0
      "avg_wind_dir": 0,
      "max_wind_dir": 0,
      "min_wind_speed": 0,
      "avg_wind_speed": 0,
      "max_wind_speed": 2,
      "temp": 253,
      "humidity": 597,
      "pressure": 10087,
      "rainfall": 0,
      "radiation": 0,
      "u-rays": 0,
      "noise": 562
      "pm2.5": 0,
      "pm10": 0
    }
    说明：
    "min_wind_dir" 最小风向, 无符号整数
    "avg_wind_dir" 平均风向, 无符号整数
    "max_wind_dir" 平均风向, 无符号整数
    "min_wind_speed" 最小风速，无符号整数,扩大 10 倍
    "avg_wind_speed" 平均风速，无符号整数,扩大 10 倍
    "max_wind_speed" 最大风速，无符号整数,扩大 10 倍
    "temp" 大气温度，无符号整数,扩大 10 倍
    "humidity" 大气湿度，无符号整数,扩大 10 倍
    "pressure" 大气气压，无符号整数,扩大 10 倍
    "rainfall" 雨量，无符号整数,扩大 10 倍
    "radiation" 总辐射，无符号整数,扩大 10 倍
    "u-rays" 紫外线强度，无符号整数
    "noise" 噪声，无符号整数,扩大 10 倍
    "pm2.5" PM2.5，无符号整数,扩大 10 倍
    "pm10" PM10，无符号整数,扩大 10 倍
    注：每分钟上报一次

## Fake data

定义的数据包头
```
ee 000003 00000004 ffffffff 01 0001 {json}
```