const BACKEND_BASE = "https://linktldrbackend.onrender.com";

async function summarizeByUrl(url) {
  const res = await fetch(`${BACKEND_BASE}/api/v1/summary/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });
  const raw = await res.text();
  console.log("🔍 summarizeByUrl raw:", raw, "status:", res.status);

  if (!res.ok) throw new Error(`Backend summarize error: ${res.status}`);
  const data = JSON.parse(raw);
  return data.summary || raw;
}

async function summarizeByText(text) {
  const res = await fetch(`${BACKEND_BASE}/api/v1/summary/generateText`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  const raw = await res.text();

  if (!res.ok) throw new Error(`Backend summarizeText error: ${res.status}`);
  const data = JSON.parse(raw);
  return data.summary || raw;
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  (async () => {
    try {
      let summary;
      if (message?.type === "SUMMARIZE_URL") {
        summary = await summarizeByUrl(message.url);
      } else if (message?.type === "SUMMARIZE_TEXT") {
        summary = await summarizeByText(message.text);
      }
      sendResponse({ ok: true, summary });
    } catch (err) {
      console.error("❌ summarize error:", err);
      sendResponse({ ok: false, error: err.message });
    }
  })();
  return true;
});
