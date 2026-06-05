(function () {
  const STORAGE_KEY = "repoxana-data-v19";

  function cloneDefaultRepos() {
    return (Array.isArray(window.repoLibrary) ? window.repoLibrary : []).map((repo) => ({ ...repo }));
  }

  function normalizeRepo(repo, index) {
    const title = String(repo.title || "").trim();
    const slug = String(repo.slug || title.toLocaleLowerCase("az").replace(/[^a-z0-9]+/g, "-")).replace(/^-+|-+$/g, "");
    const stack = Array.isArray(repo.stack)
      ? repo.stack.map((item) => String(item).trim()).filter(Boolean)
      : String(repo.stack || "").split(",").map((item) => item.trim()).filter(Boolean);
    const tags = Array.isArray(repo.tags)
      ? repo.tags.map((item) => String(item).trim()).filter(Boolean)
      : String(repo.tags || "").split(",").map((item) => item.trim()).filter(Boolean);
    const images = Array.isArray(repo.images)
      ? repo.images.map((item) => String(item).trim()).filter(Boolean)
      : [];

    const normalizedLastUpdated = String(repo.lastUpdated || "").trim();

    return {
      slug: slug || `repo-${index + 1}`,
      title,
      category: String(repo.category || "Digər").trim(),
      owner: String(repo.owner || "").trim(),
      language: String(repo.language || "").trim(),
      license: String(repo.license || "").trim(),
      difficulty: String(repo.difficulty || "").trim(),
      platform: String(repo.platform || "").trim(),
      useCase: String(repo.useCase || "").trim(),
      demoUrl: String(repo.demoUrl || "").trim(),
      docsUrl: String(repo.docsUrl || "").trim(),
      lastUpdated: slug === "nextcloud" && normalizedLastUpdated === "Aktiv inkişaf" ? "" : normalizedLastUpdated,
      tags,
      stack,
      images,
      summary: String(repo.summary || "").trim(),
      description: String(repo.description || "").trim(),
      features: String(repo.features || "").trim(),
      purpose: String(repo.purpose || "").trim(),
      technologies: String(repo.technologies || "").trim(),
      advantages: String(repo.advantages || "").trim(),
      drawbacks: String(repo.drawbacks || "").trim(),
      audience: String(repo.audience || "").trim(),
      notes: String(repo.notes || "").trim(),
      installation: String(repo.installation || "").trim(),
      githubUrl: String(repo.githubUrl || "").trim(),
      status: String(repo.status || "Aktiv").trim(),
      stars: Math.max(0, Number(repo.stars) || 0),
      featured: Number(repo.featured) || index + 1
    };
  }

  function loadRepos() {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return cloneDefaultRepos();
      }

      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        return cloneDefaultRepos();
      }

      return parsed.map(normalizeRepo);
    } catch (error) {
      return cloneDefaultRepos();
    }
  }

  function saveRepos(repos) {
    const normalized = repos.map(normalizeRepo);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized, null, 2));
    return normalized;
  }

  function resetRepos() {
    const defaults = cloneDefaultRepos();
    saveRepos(defaults);
    return defaults;
  }

  window.repoStorage = {
    storageKey: STORAGE_KEY,
    loadRepos,
    saveRepos,
    resetRepos,
    normalizeRepo
  };
})();
