# 一杯见云

一个无需构建的静态 H5：把云南咖啡的产区、处理法与风味词翻译为日常语言，并按门店在售 SKU 给出可解释的推荐。核验评分可选写入飞书多维表。

## 本地运行

不需要安装依赖。请用静态服务器打开项目根目录，避免浏览器直接以 `file://` 加载 ES module：

```bash
npx serve .
# 或：python3 -m http.server 8000
```

打开终端显示的地址。配置校验使用 Node 18+：

```bash
node scripts/validate-config.mjs
```

## 门店 SKU 接入

运行时数据在 [assets/data/catalog.mjs](assets/data/catalog.mjs)。门店可直接替换其中的 `skus` 数组；参考模板：

- [JSON 模板](examples/store-skus.template.json)：可直接复制为 JS 对象。
- [CSV 模板](examples/store-skus.template.csv)：适合由表格维护；导入时把 `tags` 的 `|` 分隔值转为数组，并将 `acid` 至 `body` 组成 `flavors` 对象。

字段说明：

| 字段 | 说明 |
| --- | --- |
| `skuId` | 门店内唯一 SKU 标识，必填。 |
| `merchantId` / `merchantName` | 门店标识与显示名称，必填。 |
| `name` | 面向顾客的产品名，必填。 |
| `status` | `available` 才可被推荐。 |
| `stockStatus` | `in_stock` 才可被推荐；`sold_out` 会自动排除。 |
| `price` / `currency` | 展示价格与货币；示例使用 `CNY`。 |
| `region` | 必须是 `catalog.mjs` 中 `regionLibrary` 的键。 |
| `processing` | 必须是 `processingLibrary` 的键。 |
| `roast` / `brew` | 烘焙度与建议饮用方式。 |
| `tags` | 偏好匹配标签数组，例如 `fruit`、`milk`、`cocoa`、`low-acid`。 |
| `flavors` | 五个风味维度：`acid`、`sweet`、`bitter`、`aroma`、`body`，值必须引用 `flavorLanguage` 中的键。 |
| `orderUrl` | 可选下单链接；为空时页面提示顾客向门店出示风味卡。 |

当没有 `available` 且 `in_stock` 的 SKU 时，应用不会随机推荐或显示失效商品，而会提示顾客稍后再试或询问店员。

## Netlify 与飞书反馈

`netlify.toml` 已将静态根目录作为发布目录，并注册 `netlify/functions/feishu-events.mjs`。部署 Netlify 后，函数路径为 `/api/feishu-events`。

复制 `.env.example` 中的变量名，在 Netlify 项目的 Environment variables 填入真实值后重新部署：

- `FEISHU_APP_ID`
- `FEISHU_APP_SECRET`
- `FEISHU_BITABLE_APP_TOKEN`
- `FEISHU_BITABLE_TABLE_ID`

飞书表字段和授权步骤见 [飞书多维表接入说明.md](飞书多维表接入说明.md)。真实 App Secret、表 token、表 ID、`.env` 与 `.netlify/` 均不应提交。

## 许可证

[MIT](LICENSE)
