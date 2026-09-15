# 暖枢 NUANSHU — 三端物联网暖通运维平台

一个原创的 IoT / HVAC（暖通空调）运维平台演示项目，模拟服务商、业主、硬件设备三个终端如何围绕同一套设备状态协同工作。每个终端都是独立、可直接在浏览器打开的静态 HTML 页面（无需构建、无外部依赖），并额外提供一个作品集展示页汇总全部内容。

## 在线预览

| 页面 | 说明 | 链接 |
|---|---|---|
| 作品集展示页 | 面向面试官 / 简历读者的整体案例介绍，含架构图、设计系统、三端截图 | https://khalilyong221.github.io/nuanshu-hvac-platform/showcase.html |
| 服务商中控台（console.html） | 面向暖通服务商的大屏 SaaS 管理后台：多站点监控、工单、能耗、告警联动 | https://khalilyong221.github.io/nuanshu-hvac-platform/console.html |
| 业主端小程序（app.html） | 面向终端业主的移动端小程序风格界面：设备控制、历史数据、用电量分析 | https://khalilyong221.github.io/nuanshu-hvac-platform/app.html |
| 硬件中控面板（panel.html） | 模拟墙面硬件面板的深色触屏界面：本地控制、传感器数据、用电量分析 | https://khalilyong221.github.io/nuanshu-hvac-platform/panel.html |
| 最初的三端合一原型（index.html） | 项目早期版本，三端整合在一个页面内，作为设计演进的起点保留 | https://khalilyong221.github.io/nuanshu-hvac-platform/index.html |

## 项目结构

```
.
├── console.html    # 服务商中控台（大屏 / PC 端）
├── app.html        # 业主端小程序（移动端）
├── panel.html      # 硬件中控面板（深色触屏风格）
├── showcase.html   # 作品集 / 案例展示页
├── index.html      # 早期三端合一原型
└── images/         # showcase.html 使用的产品截图
    ├── console.png
    ├── app.png
    └── panel.png
```

## 设计系统

三端与展示页共用同一套设计 token（通过 CSS 自定义属性实现明暗双主题）：

- 字体：Oswald（展示型标题）+ IBM Plex Sans（正文）+ IBM Plex Mono（数据 / 代码感元素）
- 语义色：brass（品牌强调色）、frost（冷色辅助）、good / warn / critical（状态色）
- 图表分类色：`--cat1` ~ `--cat5`
- 明暗主题：`:root` 定义浅色，`prefers-color-scheme: dark` 与 `[data-theme="dark"]` 分别覆盖，页面右上角提供手动切换

## 核心功能

- **跨端联动叙事**：三端围绕同一套虚拟住宅的设备状态展开（同一地址、同一天气、同一批传感器读数），模拟真实场景下服务商后台、业主小程序、硬件面板三者数据同步的效果。
- **用电量分析**：新增电表模块，支持"今日 / 近7天 / 近30天"三种周期的用电曲线，叠加峰 / 平 / 谷分时电价信息，并根据当前时间高亮所处电价时段（业主端小程序与硬件面板均实现，数据结构一致）。
- **告警与工单联动**：服务商中控台模拟设备异常告警触发工单流转。
- **响应式布局**：三端页面均适配手机宽度（~400px）及桌面宽度，暗色模式经过独立设计与校验。

## 本地查看

无需安装依赖或启动构建流程，直接用浏览器打开对应的 `.html` 文件即可（部分交互效果建议使用 Chrome / Edge 等现代浏览器）。

## 技术说明

纯原生 HTML / CSS / JavaScript 实现，未使用任何前端框架或打包工具，便于直接阅读源码了解实现细节。每个页面自带完整的设计 token、组件样式与交互逻辑。

---

由 [Claude](https://claude.com) 辅助设计与实现。
