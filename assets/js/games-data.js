// games-data.js
// Ghi chú (VN): Đây là "single source of truth" cho toàn bộ danh sách game.
// - GAMES: chứa toàn bộ game
// - Helper: getGameBySlug, getHotGames, getClickerGames, getNewGames, getGamesByCategory
// Lưu ý: createdAt dùng để sort (game mới → cũ), có thể chỉnh sau.

const GAMES = [
  // =========================
  // CLICKER GAMES
  // =========================
  {
    id: "cookie-clicker-2",
    title: "Cookie Clicker 2",
    slug: "cookie-clicker-2",
    thumbnail: "/assets/thumbs/cookie-clicker-2.png",
    embedUrl: "/embed/cookie-clicker-2/index.html",
    categories: ["clicker", "idle"],
    isHot: false,
    createdAt: "2025-11-01"
  },
  {
    id: "titans-clicker",
    title: "Titans Clicker",
    slug: "titans-clicker",
    thumbnail: "/assets/thumbs/titans-clicker.png",
    embedUrl: "/embed/titans-clicker/index.html",
    categories: ["clicker"],
    isHot: false,
    createdAt: "2025-10-30"
  },
  {
    id: "duck-duck-clicker",
    title: "Duck Duck Clicker",
    slug: "duck-duck-clicker",
    thumbnail: "/assets/thumbs/duck-duck-clicker.png",
    embedUrl: "/embed/duck-duck-clicker/index.html",
    categories: ["clicker"],
    isHot: false,
    createdAt: "2025-10-29"
  },
  {
    id: "sprunki-clicker-master",
    title: "Sprunki Clicker Master",
    slug: "sprunki-clicker-master",
    thumbnail: "/assets/thumbs/sprunki-clicker-master.png",
    embedUrl: "/embed/sprunki-clicker-master/index.html",
    categories: ["clicker"],
    isHot: false,
    createdAt: "2025-10-28"
  },
  {
    id: "bloodmoney",
    title: "BloodMoney",
    slug: "bloodmoney",
    thumbnail: "/assets/thumbs/bloodmoney.png",
    embedUrl: "/embed/bloodmoney/index.html",
    categories: ["clicker"],
    isHot: false,
    createdAt: "2025-10-27"
  },
  {
    id: "dino-world-clicker",
    title: "Dino World: Clicker",
    slug: "dino-world-clicker",
    thumbnail: "/assets/thumbs/dino-world-clicker.png",
    embedUrl: "/embed/dino-world-clicker/index.html",
    categories: ["clicker"],
    isHot: false,
    createdAt: "2025-10-26"
  },
  {
    id: "paws-antistress-clicker",
    title: "Paws Antistress: Clicker",
    slug: "paws-antistress-clicker",
    thumbnail: "/assets/thumbs/paws-antistress-clicker.png",
    embedUrl: "/embed/paws-antistress-clicker/index.html",
    categories: ["clicker"],
    isHot: false,
    createdAt: "2025-10-25"
  },
  {
    id: "cookie-clicker",
    title: "Cookie Clicker",
    slug: "cookie-clicker",
    thumbnail: "/assets/thumbs/cookie-clicker.png",
    embedUrl: "/embed/cookie-clicker/index.html",
    categories: ["clicker", "idle"],
    isHot: false,
    createdAt: "2025-10-24"
  },
  {
    id: "the-new-steal-brainrot-super-clicker",
    title: "The New Steal Brainrot Super Clicker!",
    slug: "the-new-steal-brainrot-super-clicker",
    thumbnail: "/assets/thumbs/the-new-steal-brainrot-super-clicker.png",
    embedUrl: "/embed/the-new-steal-brainrot-super-clicker/index.html",
    categories: ["clicker"],
    isHot: false,
    createdAt: "2025-10-23"
  },
  {
    id: "astro-robot-clicker",
    title: "Astro Robot Clicker",
    slug: "astro-robot-clicker",
    thumbnail: "/assets/thumbs/astro-robot-clicker.png",
    embedUrl: "/embed/astro-robot-clicker/index.html",
    categories: ["clicker"],
    isHot: false,
    createdAt: "2025-10-22"
  },
  {
    id: "chill-girl-clicker",
    title: "Chill Girl Clicker",
    slug: "chill-girl-clicker",
    thumbnail: "/assets/thumbs/chill-girl-clicker.png",
    embedUrl: "/embed/chill-girl-clicker/index.html",
    categories: ["clicker"],
    isHot: false,
    createdAt: "2025-10-21"
  },
  {
    id: "italian-brainrot-clicker-2",
    title: "Italian Brainrot Clicker 2",
    slug: "italian-brainrot-clicker-2",
    thumbnail: "/assets/thumbs/italian-brainrot-clicker-2.png",
    embedUrl: "/embed/italian-brainrot-clicker-2/index.html",
    categories: ["clicker"],
    isHot: false,
    createdAt: "2025-10-20"
  },

  // =========================
  // IDLE GAMES
  // =========================
  {
    id: "idle-space-business-tycoon",
    title: "Idle Space Business Tycoon",
    slug: "idle-space-business-tycoon",
    thumbnail: "/assets/thumbs/idle-space-business-tycoon.png",
    embedUrl: "/embed/idle-space-business-tycoon/index.html",
    categories: ["idle"],
    isHot: false,
    createdAt: "2025-10-19"
  },
  {
    id: "idle-landmark-builder",
    title: "Idle Landmark Builder",
    slug: "idle-landmark-builder",
    thumbnail: "/assets/thumbs/idle-landmark-builder.png",
    embedUrl: "/embed/idle-landmark-builder/index.html",
    categories: ["idle"],
    isHot: false,
    createdAt: "2025-10-18"
  },
  {
    id: "idle-lumberjack-3d",
    title: "Idle Lumberjack 3D",
    slug: "idle-lumberjack-3d",
    thumbnail: "/assets/thumbs/idle-lumberjack-3d.png",
    embedUrl: "/embed/idle-lumberjack-3d/index.html",
    categories: ["idle"],
    isHot: false,
    createdAt: "2025-10-17"
  },
  {
    id: "idle-idol",
    title: "Idle Idol",
    slug: "idle-idol",
    thumbnail: "/assets/thumbs/idle-idol.png",
    embedUrl: "/embed/idle-idol/index.html",
    categories: ["idle"],
    isHot: false,
    createdAt: "2025-10-16"
  },
  {
    id: "idle-planet-gym-tycoon",
    title: "Idle Planet Gym Tycoon",
    slug: "idle-planet-gym-tycoon",
    thumbnail: "/assets/thumbs/idle-planet-gym-tycoon.png",
    embedUrl: "/embed/idle-planet-gym-tycoon/index.html",
    categories: ["idle"],
    isHot: false,
    createdAt: "2025-10-15"
  },
  {
    id: "police-evolution-idle",
    title: "Police Evolution Idle",
    slug: "police-evolution-idle",
    thumbnail: "/assets/thumbs/police-evolution-idle.png",
    embedUrl: "/embed/police-evolution-idle/index.html",
    categories: ["idle"],
    isHot: false,
    createdAt: "2025-10-14"
  },
  {
    id: "idle-pricon",
    title: "Idle Pricon",
    slug: "idle-pricon",
    thumbnail: "/assets/thumbs/idle-prico.png", // Ghi chú: giữ nguyên typo file idle-prico.png
    embedUrl: "/embed/idle-pricon/index.html",
    categories: ["idle"],
    isHot: false,
    createdAt: "2025-10-13"
  },
  {
    id: "idle-gold-miner",
    title: "Idle Gold Miner",
    slug: "idle-gold-miner",
    thumbnail: "/assets/thumbs/idle-gold-miner.png",
    embedUrl: "/embed/idle-gold-miner/index.html",
    categories: ["idle"],
    isHot: false,
    createdAt: "2025-10-12"
  },

  // =========================
  // IO GAMES
  // =========================
  {
    id: "brainrot-craft",
    title: "Brainrot Craft",
    slug: "brainrot-craft",
    thumbnail: "/assets/thumbs/brainrot-craft.png",
    embedUrl: "/embed/brainrot-craft/index.html",
    categories: ["io"],
    isHot: false,
    createdAt: "2025-10-11"
  },
  {
    id: "curve-rush-io",
    title: "Curve Rush IO",
    slug: "curve-rush-io",
    thumbnail: "/assets/thumbs/curve-rush-io.png",
    embedUrl: "/embed/curve-rush-io/index.html",
    categories: ["io"],
    isHot: false,
    createdAt: "2025-10-10"
  },
  {
    id: "blackhole-io",
    title: "BlackHole.io",
    slug: "blackhole-io",
    thumbnail: "/assets/thumbs/blackhole-io.png",
    embedUrl: "/embed/blackhole-io/index.html",
    categories: ["io"],
    isHot: false,
    createdAt: "2025-10-09"
  },
  {
    id: "lolbeans",
    title: "LOLBeans",
    slug: "lolbeans",
    thumbnail: "/assets/thumbs/lolbeans.png",
    embedUrl: "/embed/lolbeans/index.html",
    categories: ["io"],
    isHot: false,
    createdAt: "2025-10-08"
  },
  {
    id: "among-us",
    title: "Among Us",
    slug: "among-us",
    thumbnail: "/assets/thumbs/among-us.png",
    embedUrl: "/embed/among-us/index.html",
    categories: ["io"],
    isHot: false,
    createdAt: "2025-10-07"
  },
  {
    id: "2v2-io",
    title: "2v2.io",
    slug: "2v2-io",
    thumbnail: "/assets/thumbs/2v2-io.png",
    embedUrl: "/embed/2v2-io/index.html",
    categories: ["io"],
    isHot: false,
    createdAt: "2025-10-06"
  },
  {
    id: "slither-io",
    title: "Slither.io",
    slug: "slither-io",
    thumbnail: "/assets/thumbs/slither-io.png",
    embedUrl: "/embed/slither-io/index.html",
    categories: ["io"],
    isHot: false,
    createdAt: "2025-10-05"
  },
  {
    id: "gokarts-io",
    title: "GoKarts.io",
    slug: "gokarts-io",
    thumbnail: "/assets/thumbs/gokarts-io.png",
    embedUrl: "/embed/gokarts-io/index.html",
    categories: ["io"],
    isHot: false,
    createdAt: "2025-10-04"
  },
  {
    id: "exploder-io",
    title: "Exploder.io",
    slug: "exploder-io",
    thumbnail: "/assets/thumbs/exploder-io.png",
    embedUrl: "/embed/exploder-io/index.html",
    categories: ["io"],
    isHot: false,
    createdAt: "2025-10-03"
  },
  {
    id: "shell-shockers",
    title: "Shell Shockers",
    slug: "shell-shockers",
    thumbnail: "/assets/thumbs/shell-shockers.png",
    embedUrl: "/embed/shell-shockers/index.html",
    categories: ["io"],
    isHot: false,
    createdAt: "2025-10-02"
  },

  // =========================
  // HOT GAMES
  // =========================
  {
    id: "slope-2",
    title: "Slope 2",
    slug: "slope-2",
    thumbnail: "/assets/thumbs/slope-2.png",
    embedUrl: "/embed/slope-2/index.html",
    categories: ["hot"],
    isHot: true,
    createdAt: "2025-10-31"
  },
  {
    id: "ziggy-road",
    title: "Ziggy Road",
    slug: "ziggy-road",
    thumbnail: "/assets/thumbs/ziggy-road.png",
    embedUrl: "/embed/ziggy-road/index.html",
    categories: ["hot"],
    isHot: true,
    createdAt: "2025-10-20"
  },
  {
    id: "dancing-beat",
    title: "Dancing Beat",
    slug: "dancing-beat",
    thumbnail: "/assets/thumbs/dancing-beat.png",
    embedUrl: "/embed/dancing-beat/index.html",
    categories: ["hot"],
    isHot: true,
    createdAt: "2025-10-19"
  },
  {
    id: "steal-brainrots",
    title: "Steal Brainrots",
    slug: "steal-brainrots",
    thumbnail: "/assets/thumbs/steal-brainrots.png",
    embedUrl: "/embed/steal-brainrots/index.html",
    categories: ["hot"],
    isHot: true,
    createdAt: "2025-10-18"
  },
  {
    id: "space-waves",
    title: "Space Waves",
    slug: "space-waves",
    thumbnail: "/assets/thumbs/space-waves.png",
    embedUrl: "/embed/space-waves/index.html",
    categories: ["hot"],
    isHot: true,
    createdAt: "2025-10-17"
  },
  {
    id: "speed-stars",
    title: "Speed Stars",
    slug: "speed-stars",
    thumbnail: "/assets/thumbs/speed-stars.png",
    embedUrl: "/embed/speed-stars/index.html",
    categories: ["hot"],
    isHot: true,
    createdAt: "2025-10-16"
  },
  {
    id: "drift-hunters-2",
    title: "Drift Hunters 2",
    slug: "drift-hunters-2",
    thumbnail: "/assets/thumbs/drift-hunters-2.png",
    embedUrl: "/embed/drift-hunters-2/index.html",
    categories: ["hot"],
    isHot: true,
    createdAt: "2025-10-15"
  },
  {
    id: "subway-surfers-copenhagen",
    title: "Subway Surfers Copenhagen",
    slug: "subway-surfers-copenhagen",
    thumbnail: "/assets/thumbs/subway-surfers-copenhagen.png",
    embedUrl: "/embed/subway-surfers-copenhagen/index.html",
    categories: ["hot"],
    isHot: true,
    createdAt: "2025-10-14"
  },
  {
    id: "steal-brainrots-2",
    title: "Steal Brainrots 2",
    slug: "steal-brainrots-2",
    thumbnail: "/assets/thumbs/steal-brainrots-2.png",
    embedUrl: "/embed/steal-brainrots-2/index.html",
    categories: ["hot"],
    isHot: true,
    createdAt: "2025-10-13"
  },
  {
    id: "fnf-vs-velma-demo",
    title: "FNF: Vs. Velma Demo",
    slug: "fnf-vs-velma-demo",
    thumbnail: "/assets/thumbs/fnf-vs-velma-demo.png",
    embedUrl: "/embed/fnf-vs-velma-demo/index.html",
    categories: ["hot"],
    isHot: true,
    createdAt: "2025-10-12"
  }
];

// =========================
// Helper nội bộ
// =========================
function sortByDateDesc(list) {
  return list.slice().sort(function (a, b) {
    // Ghi chú: Date parse đơn giản, có thể thay bằng dayjs nếu sau này dùng lib
    const da = new Date(a.createdAt).getTime();
    const db = new Date(b.createdAt).getTime();
    return db - da;
  });
}

// =========================
// API public dùng cho site.js
// =========================

function getGameBySlug(slug) {
  if (!slug) return null;
  return GAMES.find(function (g) { return g.slug === slug; }) || null;
}

function getHotGames(limit) {
  const list = sortByDateDesc(GAMES.filter(function (g) { return g.isHot; }));
  if (typeof limit === "number") {
    return list.slice(0, limit);
  }
  return list;
}

function getClickerGames(limit) {
  const list = sortByDateDesc(GAMES.filter(function (g) {
    return Array.isArray(g.categories) && g.categories.includes("clicker");
  }));
  if (typeof limit === "number") {
    return list.slice(0, limit);
  }
  return list;
}

function getNewGames(limit) {
  const list = sortByDateDesc(GAMES);
  if (typeof limit === "number") {
    return list.slice(0, limit);
  }
  return list;
}

// Ghi chú: cat = "clicker" | "idle" | "io" | "hot"
// - Nếu "hot": dùng isHot
// - Ngược lại: filter theo categories.includes(cat)
function getGamesByCategory(cat, page, perPage) {
  const currentPage = parseInt(page || 1, 10) || 1;
  const size = parseInt(perPage || 20, 10) || 20;

  let filtered;
  if (cat === "hot") {
    filtered = GAMES.filter(function (g) { return g.isHot; });
  } else {
    filtered = GAMES.filter(function (g) {
      return Array.isArray(g.categories) && g.categories.includes(cat);
    });
  }

  const sorted = sortByDateDesc(filtered);
  const totalItems = sorted.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / size));
  const safePage = Math.min(Math.max(currentPage, 1), totalPages);
  const start = (safePage - 1) * size;
  const end = start + size;
  const items = sorted.slice(start, end);

  return {
    items: items,
    totalItems: totalItems,
    totalPages: totalPages,
    currentPage: safePage
  };
}

// Expose ra window để site.js dùng
window.GAMES = GAMES;
window.getGameBySlug = getGameBySlug;
window.getHotGames = getHotGames;
window.getClickerGames = getClickerGames;
window.getNewGames = getNewGames;
window.getGamesByCategory = getGamesByCategory;
