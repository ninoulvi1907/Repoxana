const repoListElement = document.getElementById("repoList");
const repoDetailElement = document.getElementById("repoDetail");
const featuredSectionElement = document.getElementById("featuredSection");
const introSectionsElement = document.getElementById("introSections");
const resultsSectionElement = document.getElementById("resultsSection");
const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const categorySelect = document.getElementById("categorySelect");
const sortSelect = document.getElementById("sortSelect");
const statusTextElement = document.getElementById("statusText");
const homeButtonElement = document.getElementById("homeButton");

const repos = window.repoStorage
  ? window.repoStorage.loadRepos()
  : Array.isArray(window.repoLibrary)
    ? window.repoLibrary
    : [];

const state = {
  query: "",
  category: "all",
  sort: "featured",
  hasSearched: false
};

function normalizeSearchText(value) {
  return String(value || "")
    .toLocaleLowerCase("az")
    .replace(/ə/g, "e")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ü/g, "u")
    .replace(/ğ/g, "g")
    .replace(/ş/g, "s")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function setupCategoryOptions() {
  const categories = [...new Set(repos.map((repo) => repo.category))].sort((a, b) => a.localeCompare(b, "az"));

  for (const category of categories) {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categorySelect.appendChild(option);
  }
}

function getFeaturedRepo() {
  return [...repos].sort((a, b) => a.featured - b.featured)[0] || null;
}

function getFilteredRepos() {
  const normalizedQuery = normalizeSearchText(state.query);

  const filtered = repos.filter((repo) => {
    const matchesCategory = state.category === "all" || repo.category === state.category;
    const haystack = [
      repo.title,
      repo.category,
      repo.summary,
      repo.description,
      repo.owner,
      repo.language,
      repo.license,
      repo.difficulty,
      repo.platform,
      repo.useCase,
      ...(repo.tags || []),
      ...(repo.stack || []),
      String(repo.stars || 0)
    ].join(" ");

    return matchesCategory && (normalizedQuery === "" || normalizeSearchText(haystack).includes(normalizedQuery));
  });

  const sorted = [...filtered];

  if (state.sort === "title-asc") {
    sorted.sort((a, b) => a.title.localeCompare(b.title, "az"));
  } else if (state.sort === "title-desc") {
    sorted.sort((a, b) => b.title.localeCompare(a.title, "az"));
  } else if (state.sort === "stars-desc") {
    sorted.sort((a, b) => (b.stars || 0) - (a.stars || 0) || a.title.localeCompare(b.title, "az"));
  } else {
    sorted.sort((a, b) => a.featured - b.featured);
  }

  return sorted;
}

function renderFeaturedRepo(repo) {
  if (!repo) {
    repoDetailElement.innerHTML = "";
    return;
  }

  const stackMarkup = (repo.stack || []).slice(0, 4).map((item) => `<span class="chip">${item}</span>`).join("");

  repoDetailElement.innerHTML = `
    <div class="viewer-top">
      <div>
        <span class="badge">Günün seçilmiş reposu</span>
        <h2>${repo.title}</h2>
      </div>
      <div class="viewer-actions">
        <a class="ghost-button" href="./repo.html?slug=${encodeURIComponent(repo.slug)}">Repo səhifəsi</a>
        <a class="primary-link" href="${repo.githubUrl}" target="_blank" rel="noreferrer">GitHub-da aç</a>
      </div>
    </div>

    <div class="meta">
      <span class="chip">${repo.category}</span>
      <span class="chip chip-star">★ ${repo.stars || 0}</span>
      ${stackMarkup}
    </div>

    <section class="detail-card">
      <h3>Qısa baxış</h3>
      <p class="description">${repo.summary || ""}</p>
      <p class="description description-spaced">${repo.description || ""}</p>
    </section>
  `;
}

function renderRepoList(items) {
  repoListElement.innerHTML = "";

  if (items.length === 0) {
    repoListElement.innerHTML = `
      <div class="empty-state">
        <h3>Nəticə tapılmadı</h3>
        <p>Axtarış sözünü və ya filterləri dəyişin.</p>
      </div>
    `;
    return;
  }

  for (const repo of items) {
    const link = document.createElement("a");
    link.className = "repo-row";
    link.href = `./repo.html?slug=${encodeURIComponent(repo.slug)}`;
    link.innerHTML = `
      <div class="repo-row-main">
        <h3 class="repo-row-title">${repo.title}</h3>
        <div class="item-meta">
          <span class="chip">${repo.category}</span>
          <span class="chip chip-star">★ ${repo.stars || 0}</span>
        </div>
      </div>
      <p class="repo-row-desc">${repo.summary || "Açıqlama əlavə edilməyib."}</p>
    `;
    repoListElement.appendChild(link);
  }
}

function updateStatus(items) {
  if (!state.hasSearched) {
    statusTextElement.textContent = "Günün seçilmiş reposu aşağıdadır.";
    return;
  }

  statusTextElement.textContent = items.length === 0 ? "Repo tapılmadı." : `${items.length} repo tapıldı`;
}

function updateResultsView() {
  if (!state.hasSearched) {
    introSectionsElement.classList.remove("hidden");
    featuredSectionElement.classList.remove("hidden");
    resultsSectionElement.classList.add("hidden");
    homeButtonElement.classList.add("hidden");
    repoListElement.innerHTML = "";
    updateStatus([]);
    return;
  }

  const items = getFilteredRepos();
  introSectionsElement.classList.add("hidden");
  featuredSectionElement.classList.add("hidden");
  resultsSectionElement.classList.remove("hidden");
  homeButtonElement.classList.remove("hidden");
  renderRepoList(items);
  updateStatus(items);
}

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  state.query = searchInput.value;
  state.hasSearched = true;
  updateResultsView();
});

categorySelect.addEventListener("change", (event) => {
  state.category = event.target.value;
  updateResultsView();
});

sortSelect.addEventListener("change", (event) => {
  state.sort = event.target.value;
  updateResultsView();
});

homeButtonElement.addEventListener("click", () => {
  state.hasSearched = false;
  state.query = "";
  searchInput.value = "";
  updateResultsView();
  window.scrollTo({ top: 0, behavior: "smooth" });
});

setupCategoryOptions();
renderFeaturedRepo(getFeaturedRepo());
updateResultsView();
