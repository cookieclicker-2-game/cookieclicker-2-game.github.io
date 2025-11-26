// /assets/js/site.js

// =========================
// Helper: Toast notification
// =========================
(function () {
  let toastEl = null;
  let toastTimeout = null;

  function ensureToastElement() {
    if (toastEl) return toastEl;
    toastEl = document.createElement("div");
    toastEl.id = "siteToast";
    toastEl.className = "site-toast";
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

  function renderSearchResults(resultsContainer, games, query) {
    resultsContainer.innerHTML = "";

    const q = (query || "").trim();
    if (!q) {
      resultsContainer.classList.remove("show");
      return;
    }

    if (!games || games.length === 0) {
      const empty = document.createElement("div");
      empty.className = "search-result-empty";
      empty.textContent = "No result for: " + q;
      resultsContainer.appendChild(empty);
      resultsContainer.classList.add("show");
      return;
    }

    const frag = document.createDocumentFragment();

    games.forEach((g) => {
      const a = document.createElement("a");
      a.href = `/${g.slug}.html`;
      a.className = "search-result-item";

      const thumb = document.createElement("img");
      thumb.className = "search-result-thumb";
      thumb.src = g.thumbnail;
      thumb.alt = g.title;

      const textWrap = document.createElement("div");
      textWrap.className = "search-result-text";

      const titleEl = document.createElement("div");
      titleEl.className = "search-result-title";
      titleEl.textContent = g.title;

      const metaEl = document.createElement("div");
      metaEl.className = "search-result-meta";
      if (Array.isArray(g.categories) && g.categories.length > 0) {
        metaEl.textContent = g.categories.join(", ");
      } else {
        metaEl.textContent = "";
      }

      textWrap.appendChild(titleEl);
      textWrap.appendChild(metaEl);

      a.appendChild(thumb);
      a.appendChild(textWrap);

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
      const q = input.value || "";
      const trimmed = q.trim();

      if (!trimmed) {
        results.innerHTML = "";
        results.classList.remove("show");
        return;
      }

      const matched = GAMES.filter((g) =>
        normalize(g.title).includes(normalize(trimmed))
      ).slice(0, MAX_RESULTS);

      renderSearchResults(results, matched, trimmed);
    });

    // Click outside → close dropdown
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

    // 10 hot games → rotator will show 6 at a time
    const games = getHotGames(10);
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
// Grid below main game
// Home: 10 games (5 clicker, 3 idle, 2 io)
// Game page: 12 latest clicker games
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

    body.appendChild(titleEl);

    a.appendChild(thumb);
    a.appendChild(body);

    return a;
  }

  function renderGrid(containerId, games) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = "";
    const frag = document.createDocumentFragment();
    games.forEach((g) => frag.appendChild(createGridCard(g)));
    container.appendChild(frag);
  }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function pickRandom(list, count, usedSlugs) {
    const available = list.filter((g) => !usedSlugs.has(g.slug));
    if (available.length === 0) return [];
    const shuffled = shuffle(available);
    const picked = shuffled.slice(0, Math.min(count, shuffled.length));
    picked.forEach((g) => usedSlugs.add(g.slug));
    return picked;
  }

  function initBlocks() {
    if (typeof GAMES === "undefined") return;

    const body = document.body;
    const pageType = body.dataset.pageType || "";

    if (pageType === "home") {
      // Build 10 games: 5 clicker, 3 idle, 2 io
      const clickers = GAMES.filter(
        (g) => Array.isArray(g.categories) && g.categories.includes("clicker")
      );
      const idles = GAMES.filter(
        (g) => Array.isArray(g.categories) && g.categories.includes("idle")
      );
      const ios = GAMES.filter(
        (g) => Array.isArray(g.categories) && g.categories.includes("io")
      );

      const used = new Set();
      const result = [];

      result.push(...pickRandom(clickers, 5, used));
      result.push(...pickRandom(idles, 3, used));
      result.push(...pickRandom(ios, 2, used));

      const finalList = shuffle(result).slice(0, 10);
      renderGrid("clickerGrid", finalList);
      return;
    }

    // Game detail page: 12 latest clicker games
    if (pageType === "game" && typeof getClickerGames === "function") {
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
      a.href = "/" + cat + `.games?page=` + page;
      a.textContent = label;
      a.className = "pagination-link";
      if (disabled) a.classList.add("is-disabled");
      if (active) a.classList.add("is-active");
      return a;
    }

    if (currentPage > 1) {
      ul.appendChild(createPageLink("Prev", currentPage - 1, false, false));
    }

    for (let p = 1; p <= totalPages; p++) {
      ul.appendChild(createPageLink(String(p), p, false, p === currentPage));
    }

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

    // Game detail page
    if (slug) {
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
// Share / Fullscreen / Comment buttons
// =========================
(function () {
  function handleShare() {
    const url = window.location.href;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(url)
        .then(() => {
          showToast("Game link copied!");
        })
        .catch(() => {
          showToast("Failed to copy link. Please copy manually.");
        });
    } else {
      window.prompt("Copy game link:", url);
    }
  }

  function handleFullscreen() {
    const doc = document;
    const target =
      document.querySelector(".game-frame-wrapper") ||
      document.querySelector(".game-frame");

    if (!target) {
      showToast("Game frame not found.");
      return;
    }

    const isFullscreen =
      doc.fullscreenElement ||
      doc.webkitFullscreenElement ||
      doc.mozFullScreenElement ||
      doc.msFullscreenElement;

    if (!isFullscreen) {
      if (target.requestFullscreen) {
        target.requestFullscreen();
      } else if (target.webkitRequestFullscreen) {
        target.webkitRequestFullscreen();
      } else if (target.mozRequestFullScreen) {
        target.mozRequestFullScreen();
      } else if (target.msRequestFullscreen) {
        target.msRequestFullscreen();
      } else {
        showToast("Your browser does not support fullscreen.");
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
    const commentBox = document.getElementById("comments");
    if (commentBox) {
      commentBox.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    const desc = document.querySelector(".game-description");
    if (desc) {
      desc.scrollIntoView({ behavior: "smooth", block: "start" });
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

    // Show max 3 recently played games
    list.slice(0, 3).forEach((item) => {
      const game = getGameBySlug(item.slug);
      if (!game) return;

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

      frag.appendChild(a);
    });

    container.appendChild(frag);
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (document.body.dataset.slug) {
      addCurrentGameToHistory();
    }
    if (document.body.dataset.pageType === "home") {
      renderRecentlyPlayed();
    }
  });
})();

// =========================
// Hot Games Rotator – show 6 of 10
// =========================
(function () {
  const VISIBLE_COUNT = 6;

  function initHotGamesRotator() {
    const container = document.getElementById("hotGames");
    if (!container) return;

    const items = Array.from(container.querySelectorAll(".hot-item"));
    const total = items.length;
    if (total === 0) return;

    if (total <= VISIBLE_COUNT) {
      items.forEach((el) => el.classList.remove("is-hidden"));
      return;
    }

    let index = 0;

    function updateVisible() {
      items.forEach((el, i) => {
        const offset = (i - index + total) % total;
        const visible = offset < VISIBLE_COUNT;
        el.classList.toggle("is-hidden", !visible);
      });
    }

    updateVisible();

    setInterval(() => {
      index = (index + 1) % total;
      updateVisible();
    }, 4000);
  }

  document.addEventListener("DOMContentLoaded", initHotGamesRotator);
})();

// =========================
// Footer year
// =========================
(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var yearSpan = document.querySelector("[data-year]");
    if (yearSpan) {
      yearSpan.textContent = new Date().getFullYear();
    }
  });
})();

// =======================
// COMMENTS – Supabase backend (pending / approved)
// =======================
(function () {
  const commentsSection = document.querySelector(".comments-section");
  if (!commentsSection) return; // page without comments

  const gameId = commentsSection.getAttribute("data-game-id") || "default";

  const commentsListEl = document.getElementById("comments-list");
  const commentCountEl = document.getElementById("comment-count");
  const sortSelectEl = document.getElementById("comment-sort");

  const commentFormEl = document.getElementById("comment-form");
  const commentTextEl = document.getElementById("comment-text");
  const commentNameEl = document.getElementById("comment-name");
  const commentEmailEl = document.getElementById("comment-email");
  const commentTermsEl = document.getElementById("comment-terms");
  const errorEl = document.getElementById("comment-error");

  // --- Supabase config (public anon key) ---
  const SUPABASE_URL = "https://qrepgtwngjdzmbnopsdr.supabase.co";
  const SUPABASE_ANON_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyZXBndHduZ2pkem1ibm9wc2RyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQwNzM0ODMsImV4cCI6MjA3OTY0OTQ4M30.TvX9J2aBQWAyAK225q2czsZN5fXz8Edj57XF7h3kIwA";

  function setError(msg) {
    if (!errorEl) return;
    errorEl.textContent = msg || "";
  }

  // In–memory state for sorting
  let commentsState = [];

  function createCommentCard(c) {
    const card = document.createElement("article");
    card.className = "comment-card";

    const avatar = document.createElement("div");
    avatar.className = "comment-avatar";
    avatar.textContent = c.name ? c.name.trim()[0].toUpperCase() : "?";

    const content = document.createElement("div");
    content.className = "comment-content";

    const meta = document.createElement("div");
    meta.className = "comment-meta";
    meta.innerHTML = `
      <span class="comment-name">${c.name || "Guest"}</span>
      <span class="comment-time">${c.createdAt}</span>
    `;

    const text = document.createElement("p");
    text.className = "comment-text";
    text.textContent = c.text;

    content.appendChild(meta);
    content.appendChild(text);
    card.appendChild(avatar);
    card.appendChild(content);

    return card;
  }

  function renderComments() {
    commentsListEl.innerHTML = "";

    if (!commentsState.length) {
      commentsListEl.innerHTML =
        '<div style="opacity:0.75;font-size:14px;">No comments yet.</div>';
      commentCountEl.textContent = "(0)";
      return;
    }

    commentsState.forEach((c) => {
      commentsListEl.appendChild(createCommentCard(c));
    });
    commentCountEl.textContent = `(${commentsState.length})`;
  }

  function sortComments(mode) {
    commentsState.sort((a, b) =>
      mode === "oldest" ? a.createdAtMs - b.createdAtMs : b.createdAtMs - a.createdAtMs
    );
  }

  async function loadApprovedComments() {
    if (!commentsListEl || !commentCountEl) return;

    commentsListEl.innerHTML =
      '<div style="opacity:0.8;font-size:14px;">Loading comments...</div>';

    try {
      const url =
        SUPABASE_URL +
        `/rest/v1/comments?select=*` +
        `&game_id=eq.${encodeURIComponent(gameId)}` +
        `&status=eq.approved` +
        `&order=created_at.desc`;

      const res = await fetch(url, {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: "Bearer " + SUPABASE_ANON_KEY
        }
      });

      if (!res.ok) {
        throw new Error("Failed to fetch comments");
      }

      const data = await res.json();

      commentsState = (data || []).map((row) => {
        const ms = row.created_at ? new Date(row.created_at).getTime() : Date.now();
        return {
          id: row.id,
          name: row.name || "Guest",
          text: row.text || "",
          createdAt: row.created_at
            ? new Date(row.created_at).toLocaleString()
            : "",
          createdAtMs: ms
        };
      });

      sortComments("newest");
      renderComments();
    } catch (err) {
      console.error(err);
      commentsListEl.innerHTML =
        '<div style="color:#fecaca;font-size:14px;">Failed to load comments.</div>';
      commentCountEl.textContent = "(0)";
    }
  }

  function initSortSelect() {
    if (!sortSelectEl) return;
    sortSelectEl.addEventListener("change", function () {
      sortComments(sortSelectEl.value || "newest");
      renderComments();
    });
  }

  function initSubmit() {
    if (!commentFormEl) return;

    commentFormEl.addEventListener("submit", async function (e) {
      e.preventDefault();
      setError("");

      const text = (commentTextEl.value || "").trim();
      const name = (commentNameEl.value || "").trim() || "Anonymous";
      const email = (commentEmailEl.value || "").trim();

      if (!text) {
        setError("Please enter your comment.");
        commentTextEl.focus();
        return;
      }

      if (!commentTermsEl.checked) {
        setError("Please agree to the terms and conditions before submitting.");
        commentTermsEl.focus();
        return;
      }

      const payload = {
        game_id: gameId,
        name,
        email,
        text,
        status: "pending"
      };

      try {
        const url = SUPABASE_URL + "/rest/v1/comments";
        const res = await fetch(url, {
          method: "POST",
          headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: "Bearer " + SUPABASE_ANON_KEY,
            "Content-Type": "application/json",
            Prefer: "return=minimal"
          },
          body: JSON.stringify(payload)
        });

        if (!res.ok) {
          throw new Error("Failed to insert comment");
        }

        commentTextEl.value = "";
        showToast("Thanks! Your comment is waiting for approval.");
      } catch (err) {
        console.error(err);
        setError("Failed to submit comment. Please try again later.");
      }
    });
  }

  loadApprovedComments();
  initSortSelect();
  initSubmit();
})();
// =====================
// Description collapse
// =====================
document.addEventListener("DOMContentLoaded", function () {
  const desc = document.querySelector(".game-description");
  const toggleBtn = document.getElementById("descToggle");
  if (!desc || !toggleBtn) return;

  toggleBtn.addEventListener("click", () => {
    desc.classList.toggle("expanded");

    if (desc.classList.contains("expanded")) {
      toggleBtn.textContent = "Show less ▲";
    } else {
      toggleBtn.textContent = "Show more ▼";
      window.scrollTo({ top: desc.offsetTop - 80, behavior: "smooth" });
    }
  });
});
