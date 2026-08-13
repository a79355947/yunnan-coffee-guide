# 一杯见云｜云南咖啡风味向导

一个无需构建的静态 H5，帮助云南咖啡门店把产区、处理法、烘焙度与风味术语翻译成顾客听得懂的语言，并从门店**当前可售**的 SKU 中给出可解释的推荐。

它不是替代咖啡师的聊天机器人，而是一个可由门店维护的点单前风味入口：顾客表达偏好，系统解释推荐依据，门店获得可复盘的体验反馈。

## 它解决什么问题

第一次接触云南咖啡的顾客，往往面对“水洗、日晒、厌氧、浅烘焙、柑橘酸质”等术语和大量产品名，难以判断哪一杯适合自己；店员则需要重复解释风味与菜单。

一杯见云将这一步改为：

1. 顾客选择或描述偏好，例如“像新鲜水果”“不要太酸”“我平时喝拿铁”。
2. 系统将偏好对应到酸感、甜感、苦感、香气与口感五个风味维度。
3. 系统仅从 `available` 且 `in_stock` 的门店 SKU 中匹配推荐，并解释“为什么是这杯”。
4. 顾客生成专属风味卡，可继续下单、加购或提交品饮后的准确度反馈。

## 为什么门店可以复用

门店不需要重写页面或接入专有点单系统。只要替换产品目录中的 JSON/CSV SKU 数据，即可保留现有产品架构并生成新的推荐结果。

- **低依赖**：纯 HTML、CSS 与 ES Module，无构建步骤、无运行时包管理依赖。
- **可解释**：推荐同时呈现产品、处理法、五维风味与生活化类比。
- **库存安全**：无可售库存时不会随机推荐或展示失效商品。
- **可扩展**：可选接入 Netlify 与飞书多维表，记录匿名的风味描述准确度反馈。

## 核心模块

| 模块 | 作用 |
| --- | --- |
| `assets/data/catalog.mjs` | 产区、处理法、五维风味语言与演示 SKU 数据。 |
| `assets/app.mjs` | 偏好提取、SKU 匹配、风味卡、下单/加购与核验交互。 |
| `examples/` | 可直接复制的门店 SKU JSON 与 CSV 模板。 |
| `netlify/functions/feishu-events.mjs` | 可选的匿名准确度反馈写入飞书多维表。 |
| `scripts/validate-config.mjs` | 校验演示产品和模板配置是否符合数据结构。 |

## 本地运行

不需要安装依赖。请使用静态服务器打开项目根目录，避免浏览器直接用 `file://` 加载 ES Module：

```bash
npx serve .
# 或
python3 -m http.server 8000
```

配置校验使用 Node 18+：

```bash
node scripts/validate-config.mjs
node --check assets/app.mjs
node --check netlify/functions/feishu-events.mjs
```

## 门店 SKU 接入

运行时数据在 [assets/data/catalog.mjs](assets/data/catalog.mjs)。参考模板：

- [JSON 模板](examples/store-skus.template.json)：适合开发者或配置管理。
- [CSV 模板](examples/store-skus.template.csv)：适合由运营人员以表格维护；导入时将 `tags` 的 `|` 分隔值转为数组，并把 `acid` 至 `body` 组成 `flavors` 对象。

关键字段：

| 字段 | 说明 |
| --- | --- |
| `skuId` | 门店内唯一 SKU 标识，必填。 |
| `merchantId` / `merchantName` | 门店标识与显示名称，必填。 |
| `status` / `stockStatus` | 仅 `available` 和 `in_stock` 的产品可被推荐。 |
| `region` / `processing` | 关联产区和处理法知识库条目。 |
| `tags` / `flavors` | 偏好匹配标签与五维风味键。 |
| `orderUrl` | 可选下单链接；生产环境应限制为门店允许的 HTTPS 域名。 |

没有可售 SKU 时，应用会明确提示顾客稍后再试或询问店员，而不会给出失效推荐。

## 可选：飞书反馈接入

`netlify.toml` 已配置静态发布目录和 `netlify/functions/feishu-events.mjs`。部署到 Netlify 后，函数路径为 `/api/feishu-events`。

在 Netlify Environment variables 中设置以下值，并重新部署：

- `FEISHU_APP_ID`
- `FEISHU_APP_SECRET`
- `FEISHU_BITABLE_APP_TOKEN`
- `FEISHU_BITABLE_TABLE_ID`

字段与授权步骤见 [飞书多维表接入说明.md](飞书多维表接入说明.md)。不要提交真实 App Secret、表 token、表 ID、`.env` 或 `.netlify/`。

## 维护与安全边界

- 当前项目不是自主 Agent、插件、CLI 或代码执行服务。
- 用户反馈仅用于风味描述准确度记录；接入真实门店前应补充速率限制、生产域名 CORS 白名单与 URL 白名单。
- 第三方提交涉及 SKU、Netlify 函数或部署配置时，应进行人工审查。

## 自动校验

GitHub Actions 会在推送到 `main` 和向 `main` 发起 PR 时，自动执行 SKU 配置校验与 JavaScript 语法检查。工作流定义见 [`.github/workflows/validate.yml`](.github/workflows/validate.yml)。

## 路线图

- [ ] 将门店 SKU 配置迁移为 JSON Schema 可校验的数据格式。
- [ ] 增加 URL 白名单、速率限制与生产环境 CORS 配置。
- [ ] 增加 GitHub Actions 配置校验。
- [ ] 增加真实门店菜单接入与匿名体验反馈案例。

## 许可证

[MIT](LICENSE)
