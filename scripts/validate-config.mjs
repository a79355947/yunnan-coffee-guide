import { readFile } from 'node:fs/promises';
import { flavorLanguage, processingLibrary, regionLibrary, skus } from '../assets/data/catalog.mjs';

const required = ['skuId', 'merchantId', 'merchantName', 'name', 'status', 'stockStatus', 'price', 'currency', 'region', 'processing', 'roast', 'brew', 'tags', 'flavors'];
const errors = [];
function validateSku(sku, label) {
  required.forEach((field) => { if (sku[field] === undefined || sku[field] === '') errors.push(`${label}: 缺少 ${field}`); });
  if (!Array.isArray(sku.tags)) errors.push(`${label}: tags 必须为数组`);
  if (!Number.isFinite(Number(sku.price)) || Number(sku.price) < 0) errors.push(`${label}: price 必须为非负数字`);
  if (!regionLibrary[sku.region]) errors.push(`${label}: 未知 region “${sku.region}”`);
  if (!processingLibrary[sku.processing]) errors.push(`${label}: 未知 processing “${sku.processing}”`);
  ['acid', 'sweet', 'bitter', 'aroma', 'body'].forEach((field) => { if (!flavorLanguage[sku.flavors?.[field]]) errors.push(`${label}: flavors.${field} 必须引用 catalog 中已有风味词`); });
}

skus.forEach((sku, index) => validateSku(sku, `catalog.skus[${index}]`));
const ids = skus.map((sku) => sku.skuId);
if (new Set(ids).size !== ids.length) errors.push('catalog.skus: skuId 不能重复');
const template = JSON.parse(await readFile(new URL('../examples/store-skus.template.json', import.meta.url), 'utf8'));
if (!Array.isArray(template)) errors.push('JSON 模板必须是 SKU 数组'); else template.forEach((sku, index) => validateSku(sku, `template[${index}]`));
const csv = await readFile(new URL('../examples/store-skus.template.csv', import.meta.url), 'utf8');
const csvHeaders = csv.trim().split(/\r?\n/, 1)[0].split(',');
['skuId', 'merchantId', 'name', 'status', 'stockStatus', 'price', 'region', 'processing', 'tags', 'acid', 'sweet', 'bitter', 'aroma', 'body'].forEach((field) => { if (!csvHeaders.includes(field)) errors.push(`CSV 模板缺少 ${field} 列`); });
if (errors.length) { console.error(`配置校验失败：\n- ${errors.join('\n- ')}`); process.exitCode = 1; } else console.log(`配置校验通过：${skus.length} 个目录 SKU，${template.length} 个 JSON 模板 SKU。`);
