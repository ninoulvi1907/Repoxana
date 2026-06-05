const repoDetailPageElement = document.getElementById("repoDetailPage");
const repoPageTitleElement = document.getElementById("repoPageTitle");

const repoPageRepos = window.repoStorage
  ? window.repoStorage.loadRepos()
  : Array.isArray(window.repoLibrary)
    ? window.repoLibrary
    : [];

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderTextBlock(title, value) {
  const text = String(value || "").trim();
  if (!text) {
    return "";
  }

  return `
    <section class="detail-card">
      <h3>${title}</h3>
      <div class="description description-rich">${escapeHtml(text).replace(/\n/g, "<br>")}</div>
    </section>
  `;
}

function renderRepoDetailPage(repo) {
  if (!repo) {
    repoPageTitleElement.textContent = "Repo tapılmadı";
    repoDetailPageElement.innerHTML = `
      <div class="empty-detail">
        <span class="badge">Repo tapılmadı</span>
        <h2>Bu repo mövcud deyil</h2>
        <p class="description">Linki yoxlayın və ya ana səhifəyə qayıdın.</p>
      </div>
    `;
    return;
  }

  repoPageTitleElement.textContent = repo.title;

  const stackMarkup = (repo.stack || []).map((item) => `<span class="chip">${item}</span>`).join("");
  const tagMarkup = (repo.tags || []).map((item) => `<span class="chip chip-tag">${item}</span>`).join("");
  const imageMarkup = (repo.images || []).length
    ? `
    <section class="image-gallery">
      <img class="hero-image" src="${repo.images[0]}" alt="${repo.title} əsas şəkil">
      ${(repo.images || []).slice(1).map((src, index) => `<img src="${src}" alt="${repo.title} şəkil ${index + 2}">`).join("")}
    </section>`
    : "";
  const metaFacts = [
    repo.owner ? `<div class="fact"><span>Müəllif</span><strong>${repo.owner}</strong></div>` : "",
    repo.language ? `<div class="fact"><span>Dil</span><strong>${repo.language}</strong></div>` : "",
    repo.license ? `<div class="fact"><span>Lisenziya</span><strong>${repo.license}</strong></div>` : "",
    repo.difficulty ? `<div class="fact"><span>Çətinlik</span><strong>${repo.difficulty}</strong></div>` : "",
    repo.platform ? `<div class="fact"><span>Platforma</span><strong>${repo.platform}</strong></div>` : "",
    repo.useCase ? `<div class="fact"><span>İstifadə sahəsi</span><strong>${repo.useCase}</strong></div>` : ""
  ].filter(Boolean).join("");

  repoDetailPageElement.innerHTML = `
    <div class="viewer-top">
      <div>
        <span class="badge">Repo səhifəsi</span>
        <h2>${repo.title}</h2>
      </div>
      <div class="viewer-actions">
        <a class="ghost-button" href="./index.html">Ana səhifə</a>
        <a class="primary-link" href="${repo.githubUrl}" target="_blank" rel="noreferrer">GitHub-da aç</a>
      </div>
    </div>

    <div class="meta">
      <span class="chip">${repo.category}</span>
      <span class="chip">${repo.status}</span>
      <span class="chip chip-star">★ ${repo.stars || 0}</span>
      ${stackMarkup}
    </div>

    ${tagMarkup ? `<div class="meta meta-tags">${tagMarkup}</div>` : ""}
    ${imageMarkup}
    ${metaFacts ? `<section class="facts-grid">${metaFacts}</section>` : ""}

    <section class="detail-card">
      <h3>Qısa baxış</h3>
      <p class="description">${repo.summary || ""}</p>
      <p class="description description-spaced">${repo.description || ""}</p>
    </section>
    ${renderTextBlock("Əsas imkanlar", repo.features)}
    ${renderTextBlock("Nə üçün istifadə olunur?", repo.purpose)}
    ${renderTextBlock("Texnologiyalar", repo.technologies)}
    ${renderTextBlock("Üstünlükləri", repo.advantages)}
    ${renderTextBlock("Çatışmazlıqları", repo.drawbacks)}
    ${renderTextBlock("Kimlər üçün uyğundur?", repo.audience)}
    ${renderTextBlock("Qeyd və tövsiyə", repo.notes)}
    ${renderTextBlock("Quraşdırma / başlanğıc addımları", repo.installation)}
  `;
}

const repoSlug = new URLSearchParams(window.location.search).get("slug") || "";
const repo = repoPageRepos.find((item) => item.slug === repoSlug);
renderRepoDetailPage(repo);
