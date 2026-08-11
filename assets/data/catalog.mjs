/**
 * 门店可维护的产品目录。替换本文件的 SKUS，或将 CSV 转为同样的字段即可。
 * 只会推荐 status=available 且 stockStatus=in_stock 的 SKU。
 */
export const flavorLanguage = {
  acidCitrus: ['酸感', '柑橘酸', '橙子汽水般清爽'], acidApple: ['酸感', '苹果酸', '青苹果般脆爽'], acidSoft: ['酸感', '低酸 / 柔和酸', '温热蜂蜜水般不刺'],
  sweetCaramel: ['甜感', '焦糖甜', '焦糖布丁'], sweetHoney: ['甜感', '蜂蜜甜', '蜂蜜般绵密回甘'], sweetCane: ['甜感', '蔗糖甜', '红糖水'], sweetDried: ['甜感', '果干甜', '葡萄干 / 红枣干'],
  bitterCocoa: ['苦感', '可可苦', '黑巧微苦'], bitterClean: ['苦感', '低苦 / 干净尾韵', '几乎无苦、尾韵干净'],
  aromaFloral: ['香气', '花香', '茉莉花茶'], aromaFruit: ['香气', '果香', '成熟水果'], aromaNutty: ['香气', '坚果烘焙香', '烤花生 / 烤芝麻'], aromaTea: ['香气', '茶感（云南特色）', '普洱茶尾韵'],
  bodyFull: ['口感', '醇厚', '豆浆般浓稠'], bodyLight: ['口感', '轻盈', '清茶般轻盈'], bodySmooth: ['口感', '圆润丝滑', '牛奶巧克力般顺滑'],
};

export const processingLibrary = {
  water: { name: '水洗', style: '清晰、明亮', analogy: '像把水果洗净后直接咬一口', story: '水洗把风味收得更干净明亮，适合慢慢辨认高原咖啡的清爽。' },
  natural: { name: '日晒', style: '熟果、可可、饱满', analogy: '像晒过太阳的果干', story: '日晒让熟果与暖甜更集中，适合喜欢可可、果干印象的你。' },
  honey: { name: '蜜处理', style: '焦糖甜、圆润', analogy: '像温热牛奶里融开焦糖', story: '蜜处理把甜润感留在杯里，像一口不抢戏却很安心的日常咖啡。' },
  anaerobic: { name: '厌氧 / 发酵', style: '花果与发酵香气更突出', analogy: '像红酒和花茶交织的香气', story: '厌氧处理让花果层次更立体，留下一点轻盈而有记忆点的香气。' },
};

export const regionLibrary = {
  baoshan: { name: '保山', story: '山地与云雾让咖啡风味常显得清爽、干净。' },
  puer: { name: '普洱', story: '温暖的云南山地，适合探索柔和甜润的日常风味。' },
  dehong: { name: '德宏', story: '边境山地的日照感，常被用来讲述饱满、暖甜的咖啡体验。' },
  lincang: { name: '临沧', story: '云雾山地与茶文化语境，让花香与茶感的联想更容易被理解。' },
};

export const preferenceTags = {
  '果汁感': ['fruit', 'bright', 'light'], '柔和奶甜': ['milk', 'low-acid', 'sweet', 'smooth'],
  '可可坚果': ['cocoa', 'nutty', 'dense'], '花香茶感': ['floral', 'tea', 'light', 'adventure'],
};

export const tagLabels = { fruit: '果香明亮', milk: '奶咖友好', cocoa: '可可醇厚', nutty: '坚果烘焙', floral: '花香轻盈', tea: '茶感余韵', sweet: '焦糖甜润', smooth: '圆润丝滑', light: '轻盈干净', dense: '醇厚扎实', 'low-acid': '低酸柔和' };

export const skus = [
  { skuId: 'DEMO-CKK-001', merchantId: 'chun-cafe', merchantName: '春咖咖·雨林咖啡', name: '云雾果园 · 水洗', status: 'available', stockStatus: 'in_stock', price: 38, currency: 'CNY', region: 'baoshan', processing: 'water', roast: '浅烘焙', brew: '手冲友好', tags: ['fruit', 'low-acid', 'bright', 'light'], flavors: { acid: 'acidCitrus', sweet: 'sweetHoney', bitter: 'bitterClean', aroma: 'aromaFruit', body: 'bodyLight' }, orderUrl: '' },
  { skuId: 'DEMO-CKK-002', merchantId: 'chun-cafe', merchantName: '春咖咖·雨林咖啡', name: '暖阳山谷 · 蜜处理', status: 'available', stockStatus: 'in_stock', price: 36, currency: 'CNY', region: 'puer', processing: 'honey', roast: '中浅烘焙', brew: '拿铁友好', tags: ['milk', 'low-acid', 'sweet', 'smooth'], flavors: { acid: 'acidSoft', sweet: 'sweetCaramel', bitter: 'bitterClean', aroma: 'aromaNutty', body: 'bodySmooth' }, orderUrl: '' },
  { skuId: 'DEMO-CKK-003', merchantId: 'chun-cafe', merchantName: '春咖咖·雨林咖啡', name: '红土地 · 日晒', status: 'available', stockStatus: 'in_stock', price: 35, currency: 'CNY', region: 'dehong', processing: 'natural', roast: '中烘焙', brew: '美式友好', tags: ['cocoa', 'nutty', 'dense', 'low-acid'], flavors: { acid: 'acidSoft', sweet: 'sweetDried', bitter: 'bitterCocoa', aroma: 'aromaNutty', body: 'bodyFull' }, orderUrl: '' },
  { skuId: 'DEMO-CKK-004', merchantId: 'chun-cafe', merchantName: '春咖咖·雨林咖啡', name: '花径晨雾 · 厌氧', status: 'available', stockStatus: 'in_stock', price: 42, currency: 'CNY', region: 'lincang', processing: 'anaerobic', roast: '浅烘焙', brew: '手冲友好', tags: ['floral', 'tea', 'light', 'adventure'], flavors: { acid: 'acidApple', sweet: 'sweetCane', bitter: 'bitterClean', aroma: 'aromaFloral', body: 'bodyLight' }, orderUrl: '' },
];
