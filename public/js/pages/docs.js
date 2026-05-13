// V0.2-W3-02a - Paperclip Docs Viewer Foundation.
// Implemented by: Codex Dev.
async function showDocsPage() {
  S.mode = "docs";
  S.currentBoardId = null;
  S.currentGroupId = null;
  $("board-title").textContent = "Docs";
  $("board-subtitle").textContent = "Paperclip mock artifacts";
  $("add-list-btn").classList.add("hidden");

  const content = $("board-content");
  content.innerHTML = '<div class="loading-box"><span class="spinner"></span> Loading Paperclip docs...</div>';

  try {
    const payload = await api.get("/api/integrations/paperclip/mock/docs");
    renderDocsPage(payload);
  } catch (e) {
    content.innerHTML = `<div class="empty-state"><div class="empty-icon">${icon("alert")}</div><h3>Failed to load Docs</h3><p>${esc(e.message)}</p></div>`;
  }
}

function renderDocsPage(payload) {
  const documents = Array.isArray(payload.documents) ? payload.documents : [];
  const selected = selectDocsArtifact(documents);
  const content = $("board-content");

  const page = document.createElement("div");
  page.className = "docs-page";
  page.innerHTML = `
    <section class="docs-command-panel">
      <div>
        <div class="docs-kicker">${icon("layout")} Paperclip docs</div>
        <h1 class="docs-title">Agent Documents</h1>
        <p class="docs-subtitle">Local mock artifacts normalized through the Paperclip docs contract. Live Paperclip remains blocked.</p>
      </div>
      <div class="docs-source-card">
        <span>Mode</span>
        <strong>${esc(payload.mode || "mock")}</strong>
        <small>${esc(payload.source?.workspaceId || "local fixture")}</small>
      </div>
    </section>
    <section class="docs-grid">
      <div class="docs-list" id="docs-list"></div>
      <article class="docs-viewer" id="docs-viewer"></article>
    </section>
  `;

  content.innerHTML = "";
  content.appendChild(page);

  const list = $("docs-list");
  if (!documents.length) {
    list.innerHTML = '<div class="docs-empty">No mock document artifacts available.</div>';
    $("docs-viewer").innerHTML = '<div class="docs-empty">Select a document to preview it.</div>';
    return;
  }

  documents.forEach(doc => {
    const item = document.createElement("button");
    item.type = "button";
    item.className = `docs-list-item${doc.artifactId === selected.artifactId ? " active" : ""}`;
    item.onclick = () => {
      S.docsSelectedArtifactId = doc.artifactId;
      renderDocsPage(payload);
    };
    item.innerHTML = `
      <span class="docs-item-title">${esc(doc.title)}</span>
      <span class="docs-item-meta">${esc(doc.artifactType)} - ${esc(doc.agent?.agentName || "Paperclip agent")}</span>
      <span class="docs-item-tags">${(doc.tags || []).slice(0, 3).map(tag => `<em>${esc(tag)}</em>`).join("")}</span>
    `;
    list.appendChild(item);
  });

  renderDocsViewer(selected, payload.source);
}

function selectDocsArtifact(documents) {
  if (!documents.length) return null;
  const selected = documents.find(doc => doc.artifactId === S.docsSelectedArtifactId);
  return selected || documents[0];
}

function renderDocsViewer(doc, source) {
  const viewer = $("docs-viewer");
  if (!viewer || !doc) return;
  const generated = doc.generatedAt ? formatThaiDateTime(doc.generatedAt) : "No timestamp";
  viewer.innerHTML = `
    <div class="docs-viewer-header">
      <div>
        <div class="docs-doc-meta">
          <span class="chip chip-source">${esc(doc.status || "ready")}</span>
          <span>${esc(generated)}</span>
        </div>
        <h2>${esc(doc.title)}</h2>
        <p>${esc(doc.summary || "")}</p>
      </div>
    </div>
    <div class="docs-attribution">
      <div><span>Agent</span><strong>${esc(doc.agent?.agentName || "")}</strong></div>
      <div><span>Run</span><strong>${esc(doc.agent?.runId || "")}</strong></div>
      <div><span>Thread</span><strong>${esc(source?.threadId || "")}</strong></div>
    </div>
    <div class="docs-content">${renderDocsMarkdown(doc.content?.text || "")}</div>
    ${renderDocsEvidence(doc.sourceEvidence || [])}
  `;
}

function renderDocsMarkdown(text) {
  if (!text) return '<div class="docs-empty">Document content is empty.</div>';
  return text.split(/\n{2,}/).map(block => {
    const trimmed = block.trim();
    if (trimmed.startsWith("# ")) return `<h3>${esc(trimmed.slice(2))}</h3>`;
    if (trimmed.startsWith("## ")) return `<h4>${esc(trimmed.slice(3))}</h4>`;
    if (/^[-*] /.test(trimmed)) {
      const items = trimmed.split(/\n/).map(line => line.replace(/^[-*] /, "").trim()).filter(Boolean);
      return `<ul>${items.map(item => `<li>${esc(item)}</li>`).join("")}</ul>`;
    }
    if (/^\d+\. /.test(trimmed)) {
      const items = trimmed.split(/\n/).map(line => line.replace(/^\d+\. /, "").trim()).filter(Boolean);
      return `<ol>${items.map(item => `<li>${esc(item)}</li>`).join("")}</ol>`;
    }
    return `<p>${esc(trimmed)}</p>`;
  }).join("");
}

function renderDocsEvidence(evidence) {
  if (!evidence.length) return "";
  return `
    <div class="docs-evidence">
      <h3>Evidence</h3>
      ${evidence.map(item => `
        <div class="docs-evidence-row">
          <span>${esc(item.type || "source")}</span>
          <p>${esc(item.text || "")}</p>
        </div>
      `).join("")}
    </div>
  `;
}
