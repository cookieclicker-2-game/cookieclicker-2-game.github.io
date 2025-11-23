// site.js - logic chung cho toàn bộ site Cookie Clicker 2
// Ghi chú: GAMES & helper (getHotGames, getClickerGames, ...) sẽ khai báo trong games-data.js sau.

// Bọc toàn bộ trong IIFE để tránh rò rỉ biến global
(function () {
  // ===============================
  // Helper: đọc & set theme
  // ===============================
  const THEME_KEY = "theme";

  function applyTheme(theme) {
    const body = document.body;
    body.classList.remove("dark", "light");
    body.classList.add(theme);
  }

  function initTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    const theme = saved === "light" || saved === "dark" ? saved : "dark";
    applyTheme(theme);

    const toggle = document.getElementById("themeToggle");
    if (toggle) {
      const iconSpan = toggle.querySelector(".icon");
      function updateLabel(t) {
        if (!iconSpan) return;
        iconSpan.textContent = t === "dark" ? "🌙" : "☀️";
      }
      updateLabel(theme);

      toggle.addEventListener("click", function () {
        const current = document.body.classList.contains("light") ? "light" : "dark";
        const next = current === "dark" ? "light" : "dark";
        applyTheme(next);
        localStorage.setItem(THEME_KEY, next);
        updateLabel(next);
      });
    }
  }

  // ===============================
  // Helper: toast thông báo
  // ===============================
  function getToastEl() {
    let toast = document.querySelector(".site-toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.className = "site-toast";
      document.body.appendChild(toast);
    }
    return toast;
  }

  function showToast(message) {
    const toast = getToastEl();
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(function () {
      toast.classList.remove("show");
    }, 2500);
  }

  // Expose nhẹ cho các file khác nếu cần
  window.showToast = showToast;

  // ===============================
  // Header search (autocomplete)
  // ===============================
  function initSearch() {
    const input = document.getElementById("searchInput");
    const results = document.getElementById("searchResults");
    const wrapper = document.getElementById("searchWrapper");
    const games = Array.isArray(window.GAMES) ? window.GAMES : [];

    if (!input || !results || !wrapper) return;

    function clearResults() {
      results.innerHTML = "";
      results.classList.remove("visible");
    }

    function renderResults(list) {
      if (!list.length) {
        clearResults();
        return;
      }
      results.innerHTML = "";
      list.forEach(function (game) {
        const a = document.createElement("a");
        a.href = "/" + game.slug + ".html"; // Ghi chú dev: file .html, sau có thể rewrite slug sạch
        a.className = "search-result-item";

        const thumb = document.createElement("img");
        thumb.className = "search-result-thumb";
        thumb.loading = "lazy";
        thumb.src = game.thumbnail || "/assets/thumbs/cookie-clicker-2.png";
        thumb.alt = game.title + " thumbnail";

        const textWrap = document.createElement("div");
        textWrap.className = "search-result-text";

        const titleEl = document.createElement("div");
        titleEl.className = "search-result-title";
        titleEl.textContent = game.title;

        const metaEl = document.createElement("div");
        metaEl.className = "search-result-meta";
        metaEl.textContent = (game.categories || []).join(" · ");

        textWrap.appendChild(titleEl);
        textWrap.appendChild(metaEl);

        a.appendChild(thumb);
        a.appendChild(textWrap);

        results.appendChild(a);
      });
      results.classList.add("visible");
    }

    input.addEventListener("input", function () {
      const q = input.value.trim().toLowerCase();
      if (!q || !games.length) {
        clearResults();
        return;
      }
      const filtered = games.filter(function (g) {
        return g.title.toLowerCase().includes(q);
      }).slice(0, 10);
      renderResults(filtered);
    });

    // Ẩn dropdown khi click ngoài
    document.addEventListener("click", function (e) {
      if (!wrapper.contains(e.target)) {
        clearResults();
      }
    });
  }

  // ===============================
  // Breadcrumb
  // ===============================
  function initBreadcrumb() {
    const breadcrumbEl = document.getElementById("breadcrumb");
    if (!breadcrumbEl) return;

    const slug = document.body.dataset.slug || "";
    const primaryCat = document.body.dataset.primaryCategory || "";
    const games = Array.isArray(window.GAMES) ? window.GAMES : [];

    // Map category → tên & URL
    const catMap = {
      clicker: { name: "Clicker Games", url: "/clicker.games" },
      idle: { name: "Idle Games", url: "/idle.games" },
      io: { name: "IO Games", url: "/io.games" },
      hot: { name: "Hot Games", url: "/hot.games" }
    };

    // Trang home: breadcrumb đơn giản
    if (!slug || slug === "home") {
      breadcrumbEl.innerHTML = "<span>Home</span>";
      return;
    }

    // Tìm game trong GAMES, nếu chưa có thì lấy H1
    let gameTitle = "";
    if (games.length) {
      const found = games.find(function (g) { return g.slug === slug; });
      if (found) gameTitle = found.title;
    }
    if (!gameTitle) {
      const h1 = document.querySelector(".game-title, h1");
      gameTitle = h1 ? h1.textContent.trim() : slug;
    }

    const parts = [];

    // Home
    parts.push('<a href="/">Home</a>');

    // Category nếu có
    if (primaryCat && catMap[primaryCat]) {
      const c = catMap[primaryCat];
      parts.push('&gt; <a href="' + c.url + '">' + c.name + "</a>");
    }

    // Game
    parts.push("&gt; <span>" + gameTitle + "</span>");

    breadcrumbEl.innerHTML = parts.join(" ");
  }

  // ===============================
  // Hot games sidebar & clicker grid
  // (sử dụng helper trong games-data.js nếu có)
  // ===============================
  function initHotGames() {
    const container = document.getElementById("hotGames");
    if (!container) return;
    if (typeof window.getHotGames !== "function") {
      // Chưa khai báo games-data.js, để placeholder
      container.innerHTML = "<p style='font-size:13px; opacity:0.9;'>Hot games will appear here soon.</p>";
      return;
    }
    const list = window.getHotGames(8);
    if (!list.length) {
      container.innerHTML = "<p style='font-size:13px; opacity:0.9;'>No hot games yet.</p>";
      return;
    }

    container.innerHTML = "";
    list.forEach(function (g) {
      const a = document.createElement("a");
      a.href = "/" + g.slug + ".html";
      a.className = "hot-item";

      const img = document.createElement("img");
      img.className = "hot-thumb";
      img.loading = "lazy";
      img.src = g.thumbnail || "/assets/thumbs/cookie-clicker-2.png";
      img.alt = g.title + " thumbnail";

      const textWrap = document.createElement("div");
      textWrap.className = "hot-text";

      const nameEl = document.createElement("div");
      nameEl.className = "hot-name";
      nameEl.textContent = g.title;

      const metaEl = document.createElement("div");
      metaEl.className = "hot-meta";
      metaEl.textContent = (g.categories || []).join(" · ");

      textWrap.appendChild(nameEl);
      textWrap.appendChild(metaEl);

      a.appendChild(img);
      a.appendChild(textWrap);
      container.appendChild(a);
    });
  }

  function initClickerGrid() {
    const grid = document.getElementById("clickerGrid");
    if (!grid) return;
    if (typeof window.getClickerGames !== "function") {
      grid.innerHTML = "<p style='font-size:13px; opacity:0.9;'>Clicker games will be loaded soon.</p>";
      return;
    }

    const list = window.getClickerGames(12);
    if (!list.length) {
      grid.innerHTML = "<p style='font-size:13px; opacity:0.9;'>No clicker games yet.</p>";
      return;
    }

    grid.innerHTML = "";
    list.forEach(function (g) {
      const a = document.createElement("a");
      a.href = "/" + g.slug + ".html";
      a.className = "game-card";

      const img = document.createElement("img");
      img.className = "game-card-thumb";
      img.loading = "lazy";
      img.src = g.thumbnail || "/assets/thumbs/cookie-clicker-2.png";
      img.alt = g.title + " thumbnail";

      const body = document.createElement("div");
      body.className = "game-card-body";

      const titleEl = document.createElement("div");
      titleEl.className = "game-card-title";
      titleEl.textContent = g.title;

      const metaEl = document.createElement("div");
      metaEl.className = "game-card-meta";
      metaEl.textContent = (g.categories || []).join(" · ");

      body.appendChild(titleEl);
      body.appendChild(metaEl);

      a.appendChild(img);
      a.appendChild(body);
      grid.appendChild(a);
    });
  }

  // ===============================
  // Button: share & fullscreen & comment
  // ===============================
  function initGameButtons() {
    const shareBtn = document.getElementById("btnShare");
    if (shareBtn) {
      shareBtn.addEventListener("click", function () {
        const url = window.location.href;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(url).then(function () {
            showToast("Đã copy link trò chơi!");
          }).catch(function () {
            showToast("Không thể copy link, hãy copy thủ công.");
          });
        } else {
          showToast("Trình duyệt không hỗ trợ copy tự động.");
        }
      });
    }

    const fullBtn = document.getElementById("btnFullscreen");
    if (fullBtn) {
      fullBtn.addEventListener("click", function () {
        const frame = document.querySelector(".game-frame");
        if (!frame) {
          showToast("Không tìm thấy khung game để phóng to.");
          return;
        }
        const doc = document;
        const isFull = doc.fullscreenElement || doc.webkitFullscreenElement;

        if (!isFull) {
          const el = frame;
          if (el.requestFullscreen) el.requestFullscreen();
          else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
          else {
            showToast("Trình duyệt không hỗ trợ fullscreen.");
          }
        } else {
          if (doc.exitFullscreen) doc.exitFullscreen();
          else if (doc.webkitExitFullscreen) doc.webkitExitFullscreen();
        }
      });
    }

    const commentBtn = document.getElementById("btnComment");
    if (commentBtn) {
      commentBtn.addEventListener("click", function () {
        // Ghi chú dev: sau này nếu có khu vực comment, thêm id="comment-section" rồi scroll đến đó.
        const commentSection = document.getElementById("comment-section");
        if (commentSection) {
          commentSection.scrollIntoView({ behavior: "smooth", block: "start" });
        } else {
          showToast("Comment section will be added soon.");
        }
      });
    }
  }

  // ===============================
  // Footer năm hiện tại
  // ===============================
  function initFooterYear() {
    const spans = document.querySelectorAll("span[data-year]");
    const year = String(new Date().getFullYear());
    spans.forEach(function (el) {
      el.textContent = year;
    });
  }

  // ===============================
  // Ready
  // ===============================
  document.addEventListener("DOMContentLoaded", function () {
    initTheme();
    initFooterYear();
    initSearch();
    initBreadcrumb();
    initHotGames();
    initClickerGrid();
    initGameButtons();
  });
})();
