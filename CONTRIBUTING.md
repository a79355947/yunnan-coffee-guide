# 贡献指南

感谢你帮助改进一杯见云。项目欢迎文档、风味语言、SKU 模板、可访问性、测试和代码改进。

## 开始前

1. 请先查看现有 Issue；较大的功能建议先创建 Issue 说明使用场景和预期行为。
2. 不要提交真实门店订单、顾客反馈、飞书 token、App Secret、`.env` 或 `.netlify/` 内容。
3. 涉及真实门店 SKU 时，请使用脱敏或明确获授权的公开数据。

## 本地检查

提交 Pull Request 前请运行：

```bash
node scripts/validate-config.mjs
node --check assets/app.mjs
node --check netlify/functions/feishu-events.mjs
```

## SKU 数据贡献

- `skuId` 必须稳定且唯一。
- 只将可推荐产品标记为 `status: "available"` 和 `stockStatus: "in_stock"`。
- `region`、`processing` 和五维 `flavors` 必须引用已有知识库键，或在同一 PR 中补充对应的可解释条目。
- `orderUrl` 必须是与门店相关的 HTTPS 链接；不要加入跟踪参数、短链接或不透明跳转。

## Pull Request 说明

请说明：改动解决了什么问题、如何验证、是否影响 SKU 匹配或飞书反馈接口。涉及界面变更时，请附截图或录屏。

维护者会重点审查数据准确性、用户可理解性、可售库存行为、外部链接和部署安全边界。
