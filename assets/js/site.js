// /assets/js/site.js

// =========================
// Helper: Toast thông báo
// =========================
(function () {
  let toastEl = null;
  let toastTimeout = null;

  function ensureToastElement() {
    if (toastEl) return toastEl;
    toastEl = document.createElement("div");
    toastEl.id = "siteToast";
    toastEl.className = "site-toast"; // style trong CSS
    document.body.appendChild(toastEl);
    return toastEl;
  }

  window.showToast = function (message) {
    const el = ensureToastElement();
    el.textContent = message;

    el.classList.add("show");
    if (toastTimeout) clearTimeout(toastTimeout);

    toastTimeout = setTimeout(() => {
      el.classList.remove("show");
    }, 2500);
  };
})();

// =========================
// Theme (Dark / Light)
// =========================
(function () {
  const body = document.body;
  const toggleBtn = document.getElementById("themeToggle");
  const THEME_KEY = "theme";

  // Ghi chú (VI): mặc định dark nếu chưa có theme trong localStorage
  function applyTheme(theme) {
    if (theme === "light") {
      body.classList.remove("dark");
      body.classList.add("light");
    } else {
      body.classList.remove("light");
      body.classList.add("dark");
      theme = "dark";
    }
    localStorage.setItem(THEME_KEY, theme);
  }

  function initTheme() {
    let stored = localStorage.getItem(THEME_KEY);
    if (!stored) stored = "dark";
    applyTheme(stored);
  }

  function initToggle() {
    if (!toggleBtn) return;
    toggleBtn.addEventListener("click", function () {
      const current = localStorage.getItem(THEME_KEY) || "dark";
      const next = current === "dark" ? "light" : "dark";
      applyTheme(next);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initTheme();
    initToggle();
  });
})();

// =========================
// Search autocomplete
// =========================
(function () {
  const MAX_RESULTS = 10;

  function normalize(str) {
    return (str || "").toLowerCase();
  }

  function renderSearchResults(resultsContainer, games) {
    resultsContainer.innerHTML = "";
    if (!games || games.length === 0) {
      resultsContainer.classList.remove("show");
      return;
    }
    const frag = document.createDocumentFragment();

    games.forEach((g) => {
      const a = document.createElement("a");
      a.href = `/${g.slug}.html`;
      a.className = "search-result-item";
      a.textContent = g.title;

      if (Array.isArray(g.categories) && g.categories.length > 0) {
        const span = document.createElement("span");
        span.className = "search-result-category";
        span.textContent = ` [${g.categories[0]}]`;
        a.appendChild(span);
      }

      frag.appendChild(a);
    });

    resultsContainer.appendChild(frag);
    resultsContainer.classList.add("show");
  }

  function initSearch() {
    const input = document.getElementById("searchInput");
    const results = document.getElementById("searchResults");
    const wrapper = document.getElementById("searchWrapper");

    if (!input || !results || !wrapper || typeof GAMES === "undefined") return;

    input.addEventListener("input", function () {
      const q = normalize(input.value);
      if (!q) {
        // Ghi chú (VI): Nếu muốn hiển thị gợi ý mặc định, có thể đưa getHotGames ở đây.
        results.innerHTML = "";
        results.classList.remove("show");
        return;
      }

      const matched = GAMES.filter((g) =>
        normalize(g.title).includes(q)
      ).slice(0, MAX_RESULTS);

      renderSearchResults(results, matched);
    });

    // Click ngoài search để đóng dropdown
    document.addEventListener("click", function (e) {
      if (!wrapper.contains(e.target)) {
        results.classList.remove("show");
      }
    });
  }

  document.addEventListener("DOMContentLoaded", initSearch);
})();

// =========================
// Hot games sidebar
// =========================
(function () {
  function createHotItem(game) {
    const a = document.createElement("a");
    a.href = `/${game.slug}.html`;
    a.className = "hot-item";

    const thumbWrap = document.createElement("div");
    thumbWrap.className = "hot-thumb-wrapper";

    const img = document.createElement("img");
    img.src = game.thumbnail;
    img.loading = "lazy";
    img.alt = `${game.title} thumbnail`;
    img.className = "hot-thumb";

    thumbWrap.appendChild(img);

    const info = document.createElement("div");
    info.className = "hot-info";

    const titleEl = document.createElement("div");
    titleEl.className = "hot-title";
    titleEl.textContent = game.title;

    const meta = document.createElement("div");
    meta.className = "hot-meta";
    meta.textContent = Array.isArray(game.categories)
      ? game.categories.join(", ")
      : "";

    info.appendChild(titleEl);
    info.appendChild(meta);

    a.appendChild(thumbWrap);
    a.appendChild(info);

    return a;
  }

  function renderHotGames() {
    const container = document.getElementById("hotGames");
    if (!container || typeof getHotGames !== "function") return;

    const games = getHotGames(8);
    container.innerHTML = "";
    const frag = document.createDocumentFragment();
    games.forEach((g) => {
      frag.appendChild(createHotItem(g));
    });
    container.appendChild(frag);
  }

  document.addEventListener("DOMContentLoaded", renderHotGames);
})();

// =========================
// Block Clicker / New games (home + game)
// =========================
(function () {
  function createGridCard(game) {
    const a = document.createElement("a");
    a.href = `/${game.slug}.html`;
    a.className = "game-card";

    const thumb = document.createElement("div");
    thumb.className = "game-card-thumb";

    const img = document.createElement("img");
    img.src = game.thumbnail;
    img.loading = "lazy";
    img.alt = `${game.title} thumbnail`;

    thumb.appendChild(img);

    const body = document.createElement("div");
    body.className = "game-card-body";

    const titleEl = document.createElement("h3");
    titleEl.className = "game-card-title";
    titleEl.textContent = game.title;

    const meta = document.createElement("div");
    meta.className = "game-card-meta";
    meta.textContent = Array.isArray(game.categories)
      ? game.categories.join(", ")
      : "";

    body.appendChild(titleEl);
    body.appendChild(meta);

    a.appendChild(thumb);
    a.appendChild(body);

    return a;
  }

  function renderGrid(containerId, games) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = "";
    const frag = document.createDocumentFragment();
    games.forEach((g) => {
      frag.appendChild(createGridCard(g));
    });
    container.appendChild(frag);
  }

  function initBlocks() {
    if (typeof GAMES === "undefined") return;

    const body = document.body;
    const pageType = body.dataset.pageType || "";

    // Home: clickerGrid + newGamesGrid
    if (pageType === "home") {
      if (typeof getClickerGames === "function") {
        const clickers = getClickerGames(12);
        renderGrid("clickerGrid", clickers);
      }
      if (typeof getNewGames === "function") {
        const newest = getNewGames(12);
        renderGrid("newGamesGrid", newest);
      }
      return;
    }

    // Trang game: block #clickerGrid = clicker games (12)
    const slug = body.dataset.slug;
    if (slug && typeof getClickerGames === "function") {
      if (document.getElementById("clickerGrid")) {
        const clickers = getClickerGames(12);
        renderGrid("clickerGrid", clickers);
      }
    }
  }

  document.addEventListener("DOMContentLoaded", initBlocks);
})();

// =========================
// Category pages (clicker / idle / io / hot)
// =========================
(function () {
  function createGridCard(game) {
    const a = document.createElement("a");
    a.href = `/${game.slug}.html`;
    a.className = "game-card";

    const thumb = document.createElement("div");
    thumb.className = "game-card-thumb";

    const img = document.createElement("img");
    img.src = game.thumbnail;
    img.loading = "lazy";
    img.alt = `${game.title} thumbnail`;

    thumb.appendChild(img);

    const body = document.createElement("div");
    body.className = "game-card-body";

    const titleEl = document.createElement("h3");
    titleEl.className = "game-card-title";
    titleEl.textContent = game.title;

    const meta = document.createElement("div");
    meta.className = "game-card-meta";
    meta.textContent = Array.isArray(game.categories)
      ? game.categories.join(", ")
      : "";

    body.appendChild(titleEl);
    body.appendChild(meta);

    a.appendChild(thumb);
    a.appendChild(body);

    return a;
  }

  function renderCategoryGrid(items) {
    const container = document.getElementById("categoryGrid");
    if (!container) return;
    container.innerHTML = "";

    if (!items || items.length === 0) {
      const p = document.createElement("p");
      p.textContent = "No games found in this category.";
      container.appendChild(p);
      return;
    }

    const frag = document.createDocumentFragment();
    items.forEach((g) => frag.appendChild(createGridCard(g)));
    container.appendChild(frag);
  }

  function renderPagination(cat, meta) {
    const pagEl = document.getElementById("pagination");
    if (!pagEl) return;
    pagEl.innerHTML = "";

    const totalPages = meta.totalPages || 1;
    const currentPage = meta.currentPage || 1;
    if (totalPages <= 1) return;

    const ul = document.createElement("div");
    ul.className = "pagination-inner";

    function createPageLink(label, page, disabled, active) {
      const a = document.createElement("a");
      a.href = `/` + cat + `.games?page=` + page;
      a.textContent = label;
      a.className = "pagination-link";
      if (disabled) a.classList.add("is-disabled");
      if (active) a.classList.add("is-active");
      return a;
    }

    // Prev
    if (currentPage > 1) {
      ul.appendChild(createPageLink("Prev", currentPage - 1, false, false));
    }

    for (let p = 1; p <= totalPages; p++) {
      ul.appendChild(createPageLink(String(p), p, false, p === currentPage));
    }

    // Next
    if (currentPage < totalPages) {
      ul.appendChild(createPageLink("Next", currentPage + 1, false, false));
    }

    pagEl.appendChild(ul);
  }

  function initCategory() {
    const body = document.body;
    const pageType = body.dataset.pageType;
    if (pageType !== "category") return;

    if (typeof getGamesByCategory !== "function") return;

    const cat = body.dataset.category;
    if (!cat) return;

    const params = new URLSearchParams(window.location.search);
    const page = parseInt(params.get("page") || "1", 10) || 1;
    const perPage = 20;

    const result = getGamesByCategory(cat, page, perPage);
    if (!result) return;

    renderCategoryGrid(result.items || []);
    renderPagination(cat, result);
  }

  document.addEventListener("DOMContentLoaded", initCategory);
})();

// =========================
// Breadcrumb
// =========================
(function () {
  function initBreadcrumb() {
    const el = document.getElementById("breadcrumb");
    if (!el) return;

    const body = document.body;
    const pageType = body.dataset.pageType || "";
    const slug = body.dataset.slug;
    const primaryCategory = body.dataset.primaryCategory;
    const baseUrl = "https://cookieclicker-2-game.github.io";

    el.innerHTML = "";

    function createCrumb(label, href, isCurrent) {
      const span = document.createElement(isCurrent ? "span" : "a");
      span.className = "breadcrumb-item";
      if (!isCurrent && href) {
        span.href = href;
      }
      span.textContent = label;
      return span;
    }

    // Home
    const homeLink = createCrumb("Home", "/", false);
    el.appendChild(homeLink);

    // Trang chủ: chỉ Home
    if (pageType === "home") {
      return;
    }

    // Category pages
    if (pageType === "category") {
      const cat = body.dataset.category;
      let label = "";
      if (cat === "clicker") label = "Clicker Games";
      else if (cat === "idle") label = "Idle Games";
      else if (cat === "io") label = "IO Games";
      else if (cat === "hot") label = "Hot Games";

      if (label) {
        const sep = document.createElement("span");
        sep.className = "breadcrumb-separator";
        sep.textContent = ">";
        el.appendChild(sep);

        const catSpan = createCrumb(label, null, true);
        el.appendChild(catSpan);
      }
      return;
    }

    // Trang game chi tiết
    if (slug) {
      // Category chính
      let cat = primaryCategory || "";
      let catLabel = "";
      let catHref = "";

      if (cat === "clicker") {
        catLabel = "Clicker Games";
        catHref = "/clicker.games";
      } else if (cat === "idle") {
        catLabel = "Idle Games";
        catHref = "/idle.games";
      } else if (cat === "io") {
        catLabel = "IO Games";
        catHref = "/io.games";
      } else if (cat === "hot") {
        catLabel = "Hot Games";
        catHref = "/hot.games";
      }

      if (catLabel && catHref) {
        const sep1 = document.createElement("span");
        sep1.className = "breadcrumb-separator";
        sep1.textContent = ">";
        el.appendChild(sep1);

        const catLink = createCrumb(catLabel, catHref, false);
        el.appendChild(catLink);
      }

      // Tên game
      if (typeof getGameBySlug === "function") {
        const game = getGameBySlug(slug);
        if (game) {
          const sep2 = document.createElement("span");
          sep2.className = "breadcrumb-separator";
          sep2.textContent = ">";
          el.appendChild(sep2);

          const current = createCrumb(game.title, null, true);
          el.appendChild(current);
        }
      }
    }
  }

  document.addEventListener("DOMContentLoaded", initBreadcrumb);
})();

// =========================
// Nút Chia sẻ, Phóng to, Bình luận
// =========================
(function () {
  function handleShare() {
    const url = window.location.href;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(url)
        .then(() => {
          showToast("Đã copy link trò chơi!");
        })
        .catch(() => {
          showToast("Không copy được link, hãy copy thủ công.");
        });
    } else {
      // Fallback đơn giản
      window.prompt("Copy link trò chơi:", url);
    }
  }

  function handleFullscreen() {
    const iframe = document.querySelector(".game-frame");
    if (!iframe) {
      showToast("Không tìm thấy khung game để phóng to.");
      return;
    }

    const doc = document;
    const isFullscreen =
      doc.fullscreenElement ||
      doc.webkitFullscreenElement ||
      doc.mozFullScreenElement ||
      doc.msFullscreenElement;

    if (!isFullscreen) {
      if (iframe.requestFullscreen) {
        iframe.requestFullscreen();
      } else if (iframe.webkitRequestFullscreen) {
        iframe.webkitRequestFullscreen();
      } else if (iframe.mozRequestFullScreen) {
        iframe.mozRequestFullScreen();
      } else if (iframe.msRequestFullscreen) {
        iframe.msRequestFullscreen();
      } else {
        showToast("Trình duyệt không hỗ trợ fullscreen.");
      }
    } else {
      if (doc.exitFullscreen) {
        doc.exitFullscreen();
      } else if (doc.webkitExitFullscreen) {
        doc.webkitExitFullscreen();
      } else if (doc.mozCancelFullScreen) {
        doc.mozCancelFullScreen();
      } else if (doc.msExitFullscreen) {
        doc.msExitFullscreen();
      }
    }
  }

  function handleCommentScroll() {
    const comment = document.getElementById("comment-section");
    if (comment) {
      comment.scrollIntoView({ behavior: "smooth" });
      return;
    }
    const desc = document.querySelector(".game-description");
    if (desc) {
      desc.scrollIntoView({ behavior: "smooth" });
      return;
    }
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  }

  function initGameButtons() {
    const shareBtn = document.getElementById("btnShare");
    const fsBtn = document.getElementById("btnFullscreen");
    const commentBtn = document.getElementById("btnComment");

    if (shareBtn) {
      shareBtn.addEventListener("click", handleShare);
    }
    if (fsBtn) {
      fsBtn.addEventListener("click", handleFullscreen);
    }
    if (commentBtn) {
      commentBtn.addEventListener("click", handleCommentScroll);
    }
  }

  document.addEventListener("DOMContentLoaded", initGameButtons);
})();

// =========================
// Recently played (localStorage)
// =========================
(function () {
  const STORAGE_KEY = "recently_played";
  const MAX_ITEMS = 20;

  function addCurrentGameToHistory() {
    const body = document.body;
    const slug = body.dataset.slug;
    if (!slug || typeof getGameBySlug !== "function") return;

    const game = getGameBySlug(slug);
    if (!game) return;

    let list = [];
    try {
      list = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch (e) {
      list = [];
    }

    // Xóa nếu trùng slug
    list = list.filter((item) => item.slug !== slug);

    list.unshift({
      slug: slug,
      ts: Date.now()
    });

    if (list.length > MAX_ITEMS) {
      list = list.slice(0, MAX_ITEMS);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }

  function renderRecentlyPlayed() {
    const section = document.getElementById("recentlyPlayedSection");
    const container = document.getElementById("recentlyPlayed");
    if (!section || !container || typeof getGameBySlug !== "function") return;

    let list = [];
    try {
      list = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch (e) {
      list = [];
    }

    if (list.length === 0) {
      section.style.display = "none";
      return;
    }

    section.style.display = "";
    container.innerHTML = "";
    const frag = document.createDocumentFragment();

    list.slice(0, 8).forEach((item) => {
      const game = getGameBySlug(item.slug);
      if (!game) return;

      const a = document.createElement("a");
      a.href = `/${game.slug}.html`;
      a.className = "hot-item"; // tái dùng style hot-list

      const thumbWrap = document.createElement("div");
      thumbWrap.className = "hot-thumb-wrapper";

      const img = document.createElement("img");
      img.src = game.thumbnail;
      img.loading = "lazy";
      img.alt = `${game.title} thumbnail`;
      img.className = "hot-thumb";

      thumbWrap.appendChild(img);

      const info = document.createElement("div");
      info.className = "hot-info";

      const titleEl = document.createElement("div");
      titleEl.className = "hot-title";
      titleEl.textContent = game.title;

      const meta = document.createElement("div");
      meta.className = "hot-meta";
      meta.textContent = Array.isArray(game.categories)
        ? game.categories.join(", ")
        : "";

      info.appendChild(titleEl);
      info.appendChild(meta);

      a.appendChild(thumbWrap);
      a.appendChild(info);

      frag.appendChild(a);
    });

    container.appendChild(frag);
  }

  document.addEventListener("DOMContentLoaded", function () {
    // Thêm vào history nếu là trang game chi tiết
    if (document.body.dataset.slug) {
      addCurrentGameToHistory();
    }
    // Render block "Tiếp tục chơi" trên trang chủ (nếu có)
    if (document.body.dataset.pageType === "home") {
      renderRecentlyPlayed();
    }
  });
})();
