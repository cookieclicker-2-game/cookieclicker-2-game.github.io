// assets/js/site.js
// Logic JS chung cho toàn site.

function showToast(message) {
  let toast = document.getElementById("siteToast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "siteToast";
    toast.className = "site-toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

// THEME
function applyTheme(theme) {
  const body = document.body;
  if (theme === "light") {
    body.classList.add("light");
    body.classList.remove("dark");
  } else {
    body.classList.add("dark");
    body.classList.remove("light");
  }
}

function initThemeToggle() {
  const saved = localStorage.getItem("theme") || "dark";
  applyTheme(saved);
  const toggle = document.getElementById("themeToggle");
  if (!toggle) return;
  toggle.textContent = saved === "light" ? "☀️" : "🌙";
  toggle.addEventListener("click", () => {
    const current = document.body.classList.contains("light") ? "light" : "dark";
    const next = current === "light" ? "dark" : "light";
    localStorage.setItem("theme", next);
    applyTheme(next);
    toggle.textContent = next === "light" ? "☀️" : "🌙";
  });
}

// SEARCH
function initSearch() {
  const input = document.getElementById("searchInput");
  const resultsBox = document.getElementById("searchResults");
  if (!input || !resultsBox) return;

  function clearResults() {
    resultsBox.innerHTML = "";
    resultsBox.classList.remove("open");
  }

  input.addEventListener("input", () => {
    const keyword = input.value.trim();
    if (!keyword) {
      clearResults();
      return;
    }
    const results = searchGamesByTitle(keyword, 10);
    if (!results.length) {
      clearResults();
      return;
    }
    resultsBox.innerHTML = results
      .map(
        (g) => `
        <a class="search-result-item" href="/${g.slug}/">
          <img src="${g.thumbnail}" alt="Thumbnail ${g.title}" loading="lazy">
          <span>${g.title}</span>
        </a>
      `
      )
      .join("");
    resultsBox.classList.add("open");
  });

  document.addEventListener("click", (e) => {
    if (!resultsBox.contains(e.target) && e.target !== input) {
      clearResults();
    }
  });
}

// HOT GAMES
function renderHotGames() {
  const container = document.getElementById("hotGames");
  if (!container) return;
  const hotGames = getHotGames(8);
  if (!hotGames.length) {
    container.innerHTML = "<p>Chưa có game hot nào.</p>";
    return;
  }
  container.innerHTML = hotGames
    .map(
      (g) => `
      <a class="hot-game-item" href="/${g.slug}/">
        <img src="${g.thumbnail}" alt="Game hot ${g.title}" loading="lazy">
        <div class="hot-game-info">
          <div class="hot-game-title">${g.title}</div>
          <div class="hot-game-meta">Game hot</div>
        </div>
      </a>
    `
    )
    .join("");
}

// CLICKER GRID
function renderClickerGrid() {
  const container = document.getElementById("clickerGrid");
  if (!container) return;
  const games = getClickerGames(12);
  if (!games.length) {
    container.innerHTML = "<p>Chưa có game clicker nào.</p>";
    return;
  }
  container.innerHTML = games
    .map(
      (g) => `
      <a class="game-card" href="/${g.slug}/">
        <div class="game-thumb">
          <img src="${g.thumbnail}" alt="Game ${g.title}" loading="lazy">
        </div>
        <div class="game-card-body">
          <div class="game-card-title">${g.title}</div>
          <div class="game-card-tag">Clicker game</div>
        </div>
      </a>
    `
    )
    .join("");
}

// BREADCRUMB
function initBreadcrumb() {
  const el = document.getElementById("breadcrumb");
  if (!el) return;
  const slug = document.body.dataset.slug;
  const primaryCat = document.body.dataset.primaryCategory;
  const gameTitle = document.body.dataset.gameTitle;
  if (!slug || !primaryCat || !gameTitle) return;

  let catName = "";
  let catLink = "#";

  switch (primaryCat) {
    case "clicker":
      catName = "Clicker Games";
      catLink = "/clicker.games";
      break;
    case "idle":
      catName = "Idle Games";
      catLink = "/idle.games";
      break;
    case "io":
      catName = "I/O Games";
      catLink = "/io.games";
      break;
    default:
      catName = "Games";
      catLink = "/hot.games";
  }

  el.innerHTML = `
    <a href="/">Home</a>
    <span class="sep">›</span>
    <a href="${catLink}">${catName}</a>
    <span class="sep">›</span>
    <span>${gameTitle}</span>
  `;
}

// SHARE
function initShareButton() {
  const btn = document.getElementById("btnShare");
  if (!btn) return;
  btn.addEventListener("click", async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: document.title, url });
      } else if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
        showToast("Đã copy link trò chơi!");
      } else {
        const temp = document.createElement("input");
        temp.value = url;
        document.body.appendChild(temp);
        temp.select();
        document.execCommand("copy");
        document.body.removeChild(temp);
        showToast("Đã copy link trò chơi!");
      }
    } catch (err) {
      console.error(err);
      showToast("Có lỗi khi chia sẻ. Vui lòng thử lại.");
    }
  });
}

// FULLSCREEN
function initFullscreenButton() {
  const btn = document.getElementById("btnFullscreen");
  if (!btn) return;
  const iframe = document.querySelector(".game-frame");
  if (!iframe) return;

  function openFullscreen() {
    const el = iframe;
    if (el.requestFullscreen) return el.requestFullscreen();
    if (el.webkitRequestFullscreen) return el.webkitRequestFullscreen();
    if (el.msRequestFullscreen) return el.msRequestFullscreen();
    showToast("Trình duyệt không hỗ trợ fullscreen.");
  }

  function exitFullscreen() {
    if (document.exitFullscreen) return document.exitFullscreen();
    if (document.webkitExitFullscreen) return document.webkitExitFullscreen();
    if (document.msExitFullscreen) return document.msExitFullscreen();
  }

  btn.addEventListener("click", () => {
    const isFull =
      document.fullscreenElement === iframe ||
      document.webkitFullscreenElement === iframe ||
      document.msFullscreenElement === iframe;
    if (isFull) {
      exitFullscreen();
    } else {
      openFullscreen();
    }
  });
}

// RECENTLY PLAYED (chỉ lưu tạm)
function saveRecentlyPlayed() {
  const slug = document.body.dataset.slug;
  const gameTitle = document.body.dataset.gameTitle;
  if (!slug || !gameTitle) return;
  const key = "recently_played";
  let list = [];
  try {
    const raw = localStorage.getItem(key);
    if (raw) list = JSON.parse(raw);
  } catch (e) {
    list = [];
  }
  list = list.filter((item) => item.slug !== slug);
  list.unshift({ slug, title: gameTitle, ts: Date.now() });
  if (list.length > 20) list = list.slice(0, 20);
  localStorage.setItem(key, JSON.stringify(list));
}

// CATEGORY PAGE (sau dùng cho clicker.games...)
function initCategoryPage(cat) {
  const grid = document.getElementById("categoryGrid");
  const pager = document.getElementById("categoryPager");
  if (!grid || !pager) return;

  const params = new URLSearchParams(window.location.search);
  const page = parseInt(params.get("page") || "1", 10);
  const perPage = 20;
  const { items, totalPages, currentPage } = getGamesByCategory(
    cat,
    page,
    perPage
  );

  if (!items.length) {
    grid.innerHTML = "<p>Chưa có game nào trong danh mục này.</p>";
  } else {
    grid.innerHTML = items
      .map(
        (g) => `
        <a class="game-card" href="/${g.slug}/">
          <div class="game-thumb">
            <img src="${g.thumbnail}" alt="Game ${g.title}" loading="lazy">
          </div>
          <div class="game-card-body">
            <div class="game-card-title">${g.title}</div>
          </div>
        </a>
      `
      )
      .join("");
  }

  if (totalPages <= 1) {
    pager.innerHTML = "";
    return;
  }

  let html = "";
  if (currentPage > 1) {
    html += `<a href="?page=${currentPage - 1}" class="page-link">« Trước</a>`;
  }
  for (let i = 1; i <= totalPages; i++) {
    html += `<a href="?page=${i}" class="page-link ${
      i === currentPage ? "active" : ""
    }">${i}</a>`;
  }
  if (currentPage < totalPages) {
    html += `<a href="?page=${currentPage + 1}" class="page-link">Tiếp »</a>`;
  }
  pager.innerHTML = html;
}

// INIT
document.addEventListener("DOMContentLoaded", () => {
  initThemeToggle();
  initSearch();
  renderHotGames();
  renderClickerGrid();
  initBreadcrumb();
  initShareButton();
  initFullscreenButton();
  saveRecentlyPlayed();
});
