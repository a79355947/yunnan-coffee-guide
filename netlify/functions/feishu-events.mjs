const json = (body, status = 200, origin = "") => new Response(JSON.stringify(body), {
  status,
  headers: {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": origin || "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Vary": "Origin",
  },
});

const text = (value, max = 500) => String(value || "").slice(0, max);

async function getTenantToken(appId, appSecret) {
  const response = await fetch("https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ app_id: appId, app_secret: appSecret }),
  });
  const data = await response.json();
  if (!response.ok || data.code) throw new Error("无法获取飞书租户令牌");
  return data.tenant_access_token;
}

async function hasSubmittedScore({ appToken, tableId, token, sessionId }) {
  const url = new URL(`https://open.feishu.cn/open-apis/bitable/v1/apps/${appToken}/tables/${tableId}/records`);
  url.searchParams.set("page_size", "1");
  url.searchParams.set("filter", `CurrentValue.[会话ID] = "${sessionId.replace(/[^a-zA-Z0-9-]/g, "")}"`);
  const response = await fetch(url, { headers: { "Authorization": `Bearer ${token}` } });
  const data = await response.json();
  if (!response.ok || data.code) throw new Error("无法检查重复提交");
  return (data.data?.items || []).length > 0;
}

export default async (req) => {
  const origin = req.headers.get("origin") || "";
  if (req.method === "OPTIONS") return json({ ok: true }, 204, origin);
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405, origin);

  const appId = Netlify.env.get("FEISHU_APP_ID");
  const appSecret = Netlify.env.get("FEISHU_APP_SECRET");
  const appToken = Netlify.env.get("FEISHU_BITABLE_APP_TOKEN");
  const tableId = Netlify.env.get("FEISHU_BITABLE_TABLE_ID");
  if (!appId || !appSecret || !appToken || !tableId) {
    return json({ configured: false, message: "Feishu Bitable is not configured" }, 503, origin);
  }

  try {
    const event = await req.json();
    if (!event || event.type !== "verification_submitted") return json({ ignored: true }, 202, origin);

    const score = Number(event.score);
    const sessionId = text(event.sessionId, 120).replace(/[^a-zA-Z0-9-]/g, "");
    if (!sessionId || !Number.isFinite(score) || score < 1 || score > 5) {
      return json({ error: "Invalid verification" }, 400, origin);
    }

    const token = await getTenantToken(appId, appSecret);
    if (await hasSubmittedScore({ appToken, tableId, token, sessionId })) {
      return json({ ok: true, duplicate: true }, 200, origin);
    }

    const fields = {
      "记录时间": text(event.time || new Date().toISOString(), 80),
      "事件类型": "风味描述准确度",
      "产品名称": text(event.productName, 120),
      "准确度评分": score,
      "用户反馈": text(event.feedback, 1000),
      "会话ID": sessionId,
    };

    const response = await fetch(`https://open.feishu.cn/open-apis/bitable/v1/apps/${appToken}/tables/${tableId}/records`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fields }),
    });
    const data = await response.json();
    if (!response.ok || data.code) throw new Error("飞书多维表写入失败");
    return json({ ok: true }, 201, origin);
  } catch (error) {
    console.error("feishu-events", error);
    return json({ error: "Event sync failed" }, 502, origin);
  }
};

export const config = { path: "/api/feishu-events" };
