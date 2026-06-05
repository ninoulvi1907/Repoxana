const ADMIN_EMAIL = "azeulvifarajli@gmail.com";
const ADMIN_PASSWORD = "Nino1907-";
const ADMIN_AUTH_KEY = "repoxana-admin-auth-v1";

const loginSection = document.getElementById("loginSection");
const adminApp = document.getElementById("adminApp");
const loginForm = document.getElementById("loginForm");
const loginEmailInput = document.getElementById("loginEmailInput");
const loginPasswordInput = document.getElementById("loginPasswordInput");
const loginStatus = document.getElementById("loginStatus");
const logoutButton = document.getElementById("logoutButton");

const adminRepoListElement = document.getElementById("adminRepoList");
const adminStatusElement = document.getElementById("adminStatus");
const repoForm = document.getElementById("repoForm");
const clearFormButton = document.getElementById("clearFormButton");
const clearImagesButton = document.getElementById("clearImagesButton");
const deleteButton = document.getElementById("deleteButton");
const exportButton = document.getElementById("exportButton");
const importInput = document.getElementById("importInput");
const imagesInput = document.getElementById("imagesInput");
const imagePreviewList = document.getElementById("imagePreviewList");

const repoSlugInput = document.getElementById("repoSlug");
const titleInput = document.getElementById("titleInput");
const githubUrlInput = document.getElementById("githubUrlInput");
const categoryInput = document.getElementById("categoryInput");
const starsInput = document.getElementById("starsInput");
const ownerInput = document.getElementById("ownerInput");
const languageInput = document.getElementById("languageInput");
const licenseInput = document.getElementById("licenseInput");
const difficultyInput = document.getElementById("difficultyInput");
const platformInput = document.getElementById("platformInput");
const useCaseInput = document.getElementById("useCaseInput");
const demoUrlInput = document.getElementById("demoUrlInput");
const docsUrlInput = document.getElementById("docsUrlInput");
const stackInput = document.getElementById("stackInput");
const descriptionInput = document.getElementById("descriptionInput");
const featuresInput = document.getElementById("featuresInput");
const purposeInput = document.getElementById("purposeInput");
const technologiesInput = document.getElementById("technologiesInput");
const advantagesInput = document.getElementById("advantagesInput");
const drawbacksInput = document.getElementById("drawbacksInput");
const audienceInput = document.getElementById("audienceInput");
const notesInput = document.getElementById("notesInput");
const installationInput = document.getElementById("installationInput");

let adminRepos = window.repoStorage.loadRepos();
let activeSlug = "";
let uploadedImages = [];

function isAuthenticated() {
  return window.sessionStorage.getItem(ADMIN_AUTH_KEY) === "ok";
}

function showAdmin() {
  loginSection.classList.add("hidden");
  adminApp.classList.remove("hidden");
}

function showLogin() {
  adminApp.classList.add("hidden");
  loginSection.classList.remove("hidden");
}

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const email = loginEmailInput.value.trim().toLowerCase();
  const password = loginPasswordInput.value;

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    window.sessionStorage.setItem(ADMIN_AUTH_KEY, "ok");
    loginStatus.textContent = "Giriş uğurludur.";
    showAdmin();
    return;
  }

  loginStatus.textContent = "Email və ya kod yanlışdır.";
});

logoutButton.addEventListener("click", () => {
  window.sessionStorage.removeItem(ADMIN_AUTH_KEY);
  loginPasswordInput.value = "";
  loginStatus.textContent = "Yalnız admin girişi üçün nəzərdə tutulub.";
  showLogin();
});

function slugify(value) {
  return String(value || "")
    .toLocaleLowerCase("az")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function setStatus(message) {
  adminStatusElement.textContent = message;
}

function buildSummaryFromDescription(value) {
  const text = String(value || "").trim().replace(/\s+/g, " ");
  if (!text) {
    return "";
  }

  return text.length > 140 ? `${text.slice(0, 137).trim()}...` : text;
}

function persistRepos() {
  adminRepos = window.repoStorage.saveRepos(adminRepos);
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function renderImagePreviews() {
  imagePreviewList.innerHTML = "";

  if (uploadedImages.length === 0) {
    imagePreviewList.innerHTML = `<p class="image-hint">Hələ şəkil əlavə edilməyib.</p>`;
    return;
  }

  uploadedImages.forEach((src, index) => {
    const item = document.createElement("div");
    item.className = "image-preview-card";
    item.innerHTML = `
      <img src="${src}" alt="Repo şəkli ${index + 1}">
      <button class="image-remove-button" type="button" data-index="${index}">Sil</button>
    `;
    imagePreviewList.appendChild(item);
  });

  imagePreviewList.querySelectorAll(".image-remove-button").forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.index);
      uploadedImages.splice(index, 1);
      renderImagePreviews();
    });
  });
}

function clearForm() {
  activeSlug = "";
  uploadedImages = [];
  repoSlugInput.value = "";
  titleInput.value = "";
  githubUrlInput.value = "";
  categoryInput.value = "";
  starsInput.value = "";
  ownerInput.value = "";
  languageInput.value = "";
  licenseInput.value = "";
  difficultyInput.value = "";
  platformInput.value = "";
  useCaseInput.value = "";
  demoUrlInput.value = "";
  docsUrlInput.value = "";
  stackInput.value = "";
  descriptionInput.value = "";
  featuresInput.value = "";
  purposeInput.value = "";
  technologiesInput.value = "";
  advantagesInput.value = "";
  drawbacksInput.value = "";
  audienceInput.value = "";
  notesInput.value = "";
  installationInput.value = "";
  imagesInput.value = "";
  renderImagePreviews();
  deleteButton.disabled = true;
}

function fillForm(repo) {
  activeSlug = repo.slug;
  uploadedImages = [...(repo.images || [])];
  repoSlugInput.value = repo.slug;
  titleInput.value = repo.title;
  githubUrlInput.value = repo.githubUrl;
  categoryInput.value = repo.category;
  starsInput.value = repo.stars || 0;
  ownerInput.value = repo.owner || "";
  languageInput.value = repo.language || "";
  licenseInput.value = repo.license || "";
  difficultyInput.value = repo.difficulty || "";
  platformInput.value = repo.platform || "";
  useCaseInput.value = repo.useCase || "";
  demoUrlInput.value = repo.demoUrl || "";
  docsUrlInput.value = repo.docsUrl || "";
  stackInput.value = (repo.stack || []).join(", ");
  descriptionInput.value = repo.description;
  featuresInput.value = repo.features || "";
  purposeInput.value = repo.purpose || "";
  technologiesInput.value = repo.technologies || "";
  advantagesInput.value = repo.advantages || "";
  drawbacksInput.value = repo.drawbacks || "";
  audienceInput.value = repo.audience || "";
  notesInput.value = repo.notes;
  installationInput.value = repo.installation || "";
  imagesInput.value = "";
  renderImagePreviews();
  deleteButton.disabled = false;
}

function renderAdminRepoList() {
  adminRepoListElement.innerHTML = "";

  if (adminRepos.length === 0) {
    adminRepoListElement.innerHTML = `
      <div class="empty-state">
        <h3>Repo yoxdur</h3>
        <p>Soldakı formadan ilk repo-nu əlavə edin.</p>
      </div>
    `;
    return;
  }

  const sortedRepos = [...adminRepos].sort((a, b) => a.featured - b.featured);

  for (const repo of sortedRepos) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `item ${repo.slug === activeSlug ? "active" : ""}`;
    button.innerHTML = `
      <h3 class="item-title">${repo.title}</h3>
      <div class="item-meta">
        <span class="chip">${repo.category}</span>
        <span class="chip chip-star">★ ${repo.stars || 0}</span>
        <span class="chip">${(repo.images || []).length} şəkil</span>
      </div>
      <p class="item-desc">${repo.summary || buildSummaryFromDescription(repo.description) || "Açıqlama əlavə edilməyib."}</p>
    `;
    button.addEventListener("click", () => {
      fillForm(repo);
      renderAdminRepoList();
      setStatus(`"${repo.title}" redaktə üçün açıldı.`);
    });
    adminRepoListElement.appendChild(button);
  }
}

function buildRepoFromForm() {
  const existing = adminRepos.find((repo) => repo.slug === repoSlugInput.value);
  const nextFeatured = existing ? existing.featured : adminRepos.length + 1;

  return window.repoStorage.normalizeRepo(
    {
      slug: repoSlugInput.value || slugify(titleInput.value),
      title: titleInput.value,
      category: categoryInput.value,
      owner: ownerInput.value,
      language: languageInput.value,
      license: licenseInput.value,
      difficulty: difficultyInput.value,
      platform: platformInput.value,
      useCase: useCaseInput.value,
      demoUrl: demoUrlInput.value,
      docsUrl: docsUrlInput.value,
      lastUpdated: existing?.lastUpdated || "",
      tags: existing?.tags || [],
      stack: stackInput.value,
      images: uploadedImages,
      stars: Number(starsInput.value) || 0,
      summary: buildSummaryFromDescription(descriptionInput.value),
      description: descriptionInput.value,
      features: featuresInput.value,
      purpose: purposeInput.value,
      technologies: technologiesInput.value,
      advantages: advantagesInput.value,
      drawbacks: drawbacksInput.value,
      audience: audienceInput.value,
      notes: notesInput.value,
      installation: installationInput.value,
      githubUrl: githubUrlInput.value,
      status: existing?.status || "Aktiv",
      featured: existing?.featured || nextFeatured
    },
    nextFeatured - 1
  );
}

repoForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (uploadedImages.length === 0) {
    setStatus("Repo üçün ən azı 1 şəkil əlavə edin.");
    return;
  }

  const repo = buildRepoFromForm();
  const index = adminRepos.findIndex((item) => item.slug === repo.slug || item.slug === repoSlugInput.value);

  if (index >= 0) {
    adminRepos[index] = { ...adminRepos[index], ...repo };
    setStatus(`"${repo.title}" yeniləndi.`);
  } else {
    adminRepos.push(repo);
    setStatus(`"${repo.title}" əlavə olundu.`);
  }

  persistRepos();
  fillForm(repo);
  renderAdminRepoList();
});

imagesInput.addEventListener("change", async (event) => {
  const files = Array.from(event.target.files || []);
  if (files.length === 0) {
    return;
  }

  const imageData = await Promise.all(files.map(readFileAsDataUrl));
  uploadedImages = [...uploadedImages, ...imageData].slice(0, 8);
  renderImagePreviews();
  imagesInput.value = "";
  setStatus("Şəkillər əlavə olundu.");
});

clearFormButton.addEventListener("click", () => {
  clearForm();
  renderAdminRepoList();
  setStatus("Yeni repo əlavə etmək üçün forma təmizləndi.");
});

clearImagesButton.addEventListener("click", () => {
  uploadedImages = [];
  imagesInput.value = "";
  renderImagePreviews();
  setStatus("Şəkillər təmizləndi.");
});

deleteButton.addEventListener("click", () => {
  if (!repoSlugInput.value) {
    return;
  }

  const repo = adminRepos.find((item) => item.slug === repoSlugInput.value);
  adminRepos = adminRepos.filter((item) => item.slug !== repoSlugInput.value);
  adminRepos = adminRepos.map((item, index) => ({ ...item, featured: index + 1 }));
  persistRepos();
  clearForm();
  renderAdminRepoList();
  setStatus(repo ? `"${repo.title}" silindi.` : "Repo silindi.");
});

exportButton.addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(adminRepos, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "repo-kitabxana-export.json";
  link.click();
  URL.revokeObjectURL(url);
  setStatus("Repo siyahısı JSON kimi export edildi.");
});

importInput.addEventListener("change", async (event) => {
  const file = event.target.files?.[0];
  if (!file) {
    return;
  }

  try {
    const text = await file.text();
    const parsed = JSON.parse(text);

    if (!Array.isArray(parsed)) {
      throw new Error("Yanlış format");
    }

    adminRepos = parsed.map((repo, index) => window.repoStorage.normalizeRepo(repo, index));
    persistRepos();
    clearForm();
    renderAdminRepoList();
    setStatus("JSON import uğurla tamamlandı.");
  } catch (error) {
    setStatus("Import alınmadı. JSON formatını yoxlayın.");
  } finally {
    importInput.value = "";
  }
});

clearForm();
renderImagePreviews();
renderAdminRepoList();

if (isAuthenticated()) {
  showAdmin();
} else {
  showLogin();
}
