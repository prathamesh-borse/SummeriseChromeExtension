(function () {
  const BUTTON_CLASS = "lisum-btn";
  const PANEL_CLASS = "lisum-panel";

  // Observe feed updates and attach buttons dynamically
  const observer = new MutationObserver(() => tryAttachButtons());
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
  document.addEventListener("DOMContentLoaded", tryAttachButtons);

  async function tryAttachButtons() {
    const posts = document.querySelectorAll(
      'div.feed-shared-update-v2, div[data-urn^="urn:li:activity:"], div[data-urn^="urn:li:ugcPost:"]'
    );

    posts.forEach((post) => {
      if (post.querySelector(`.${BUTTON_CLASS}`)) return; // skip if button exists

      const permalink = findPermalink(post);
      const button = document.createElement("button");
      button.textContent = "Summarize";
      button.className = BUTTON_CLASS;

      // 🔹 MAIN CLICK HANDLER
      button.addEventListener("click", async (e) => {
        e.preventDefault();

        // 1️⃣ Expand post text if collapsed
        const expandButton = post.querySelector(
          "button.feed-shared-inline-show-more-text__see-more-less-toggle"
        );
        if (expandButton) {
          console.log("🔍 Expanding collapsed LinkedIn post…");
          expandButton.click();
          // Wait briefly for LinkedIn to render the expanded text
          await new Promise((r) => setTimeout(r, 700));
        }

        // 2️⃣ Show loading panel
        showPanel(post, { state: "loading" });

        try {
          let summary;
          if (permalink) {
            const resp = await chrome.runtime.sendMessage({
              type: "SUMMARIZE_URL",
              url: permalink,
            });
            if (!resp?.ok) throw new Error(resp?.error || "Unknown error");
            summary = resp.summary;
          } else {
            const text = extractPostText(post);
            if (!text || text.length < 20) {
              throw new Error("No readable text found in post.");
            }
            const resp = await chrome.runtime.sendMessage({
              type: "SUMMARIZE_TEXT",
              text,
            });
            if (!resp?.ok) throw new Error(resp?.error || "Unknown error");
            summary = resp.summary;
          }

          showPanel(post, { state: "success", summary });
        } catch (err) {
          showPanel(post, { state: "error", error: String(err) });
        }
      });

      // Append the Summarize button
      const actionBar =
        post.querySelector("[data-test-reactions-container]") ||
        post.querySelector(
          "div.social-actions, div.feed-shared-social-action-bar"
        ) ||
        post;
      actionBar.appendChild(button);
    });
  }

  // Extract permalink
  function findPermalink(postRoot) {
    const a =
      postRoot.querySelector('a[href*="/feed/update/"]') ||
      postRoot.querySelector('a[href*="/posts/"]');
    return a?.href || null;
  }

  // Extract visible post text
  function extractPostText(postRoot) {
    const candidates = postRoot.querySelectorAll(
      'div.update-components-text, div.feed-shared-update-v2__description, span.break-words, div[dir="ltr"]'
    );
    const parts = [];
    candidates.forEach((c) => {
      const t = c.innerText?.trim();
      if (t) parts.push(t);
    });
    return parts.join(" ").slice(0, 8000);
  }

  // Render result panel
  function showPanel(postRoot, { state, summary, error }) {
    let panel = postRoot.querySelector(`.${PANEL_CLASS}`);
    if (!panel) {
      panel = document.createElement("div");
      panel.className = PANEL_CLASS;

      // Place above post content so always visible
      const anchor =
        postRoot.querySelector("div.feed-shared-update-v2__description") ||
        postRoot.querySelector("div.update-components-text") ||
        postRoot.firstChild;
      if (anchor) anchor.parentNode.insertBefore(panel, anchor);
      else postRoot.prepend(panel);
    }

    if (state === "loading") {
      panel.innerHTML = `<div class="lisum-row"><span class="lisum-spinner"></span> Analyzing...</div>`;
    } else if (state === "success") {
      panel.innerHTML = `
        <div class="lisum-success">✅ Summary Ready</div>
        <div class="lisum-summary">${escapeHtml(summary || "")}</div>
        <div class="lisum-actions">
          <button class="lisum-secondary" id="lisum-copy">Copy</button>
        </div>`;
      panel.querySelector("#lisum-copy")?.addEventListener("click", () => {
        navigator.clipboard.writeText(summary || "");
      });
    } else if (state === "error") {
      panel.innerHTML = `<div class="lisum-error">⚠️ ${escapeHtml(
        error || "Something went wrong"
      )}</div>`;
    }
  }

  function escapeHtml(str) {
    return str
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }
})();
