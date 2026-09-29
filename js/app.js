/* ==========================================================================
   CODEXSTUDYS — app.js (home page logic)
   ========================================================================== */
(function () {
  "use strict";

  const LS_MYLIST = "cx_mylist";
  const LS_CONTINUE = "cx_continue";

  /* ---------------- storage helpers ---------------- */
  function getMyList() {
    try { return JSON.parse(localStorage.getItem(LS_MYLIST)) || []; }
    catch { return []; }
  }
  function setMyList(arr) { localStorage.setItem(LS_MYLIST, JSON.stringify(arr)); }
  function isInMyList(id) { return getMyList().includes(Number(id)); }
  function toggleMyList(id) {
    id = Number(id);
    let list = getMyList();
    if (list.includes(id)) list = list.filter((x) => x !== id);
    else list.unshift(id);
    setMyList(list);
    return list.includes(id);
  }

  function getContinue() {
    try { return JSON.parse(localStorage.getItem(LS_CONTINUE)) || {}; }
    catch { return {}; }
  }
  function setContinue(obj) { localStorage.setItem(LS_CONTINUE, JSON.stringify(obj)); }

  function seedDemoContinueWatching() {
    const existing = getContinue();
    if (Object.keys(existing).length) return;
    const seed = {};
    [4, 101, 3, 105].forEach((id, i) => {
      seed[id] = { percent: [72, 34, 58, 12][i], updatedAt: Date.now() };
    });
    setContinue(seed);
  }

  /* ---------------- toast ---------------- */
  let toastTimer;
  function toast(msg) {
    let el = document.querySelector(".toast");
    if (!el) {
      el = document.createElement("div");
      el.className = "toast";
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), 1800);
  }

  /* ---------------- card / poster builders ---------------- */
  function posterStyle(m) {
    return `background:linear-gradient(155deg, ${m.colorA}, ${m.colorB});`;
  }

  function svgIcon(path, cls) {
    return `<svg class="${cls || ""}" viewBox="0 0 24 24">${path}</svg>`;
  }

  function playIcon() {
    return `<div class="play-overlay"><div class="play-circle">${svgIcon(
      '<path d="M6 4l14 8-14 8V4z"/>'
    )}</div></div>`;
  }

  function buildCard(m) {
    const inList = isInMyList(m.id);
    return `
    <div class="card" data-id="${m.id}" tabindex="0" role="button" aria-label="${m.title}">
      <div class="poster" style="${posterStyle(m)}">
        ${svgIcon(m.icon, "p-icon")}
        <span class="p-badge">${m.quality}</span>
        ${playIcon()}
        <div class="p-info">
          <div class="p-title">${m.title}</div>
          <div class="p-sub"><span>${m.year}</span><span>&middot;</span><span>${m.type === "series" ? m.duration : m.duration}</span></div>
        </div>
      </div>
    </div>`;
  }

  function buildContinueCard(m, percent) {
    return `
    <div class="card cw" data-id="${m.id}" tabindex="0" role="button" aria-label="Resume ${m.title}">
      <div class="poster" style="${posterStyle(m)}">
        ${svgIcon(m.icon, "p-icon")}
        ${playIcon()}
        <div class="cw-progress"><div class="cw-progress-fill" style="width:${percent}%"></div></div>
      </div>
      <div class="cw-meta">
        <div class="p-title">${m.title}</div>
        <div class="p-sub">${percent}% watched &middot; Resume</div>
      </div>
    </div>`;
  }

  /* ---------------- rows ---------------- */
  function renderRow(container, title, items, isContinue) {
    if (!items.length) return;
    const wrap = document.createElement("div");
    wrap.className = "section";
    wrap.innerHTML = `
      <div class="section-head"><h2 class="section-title">${title}</h2></div>
      <div class="row-wrap">
        <button class="row-arrow left" aria-label="Scroll left">${svgIcon('<path d="M15 18l-6-6 6-6"/>')}</button>
        <div class="row-scroll">${items
          .map((m) => (isContinue ? buildContinueCard(m, getContinue()[m.id].percent) : buildCard(m)))
          .join("")}</div>
        <button class="row-arrow right" aria-label="Scroll right">${svgIcon('<path d="M9 18l6-6-6-6"/>')}</button>
      </div>`;
    container.appendChild(wrap);
    const scroller = wrap.querySelector(".row-scroll");
    wrap.querySelector(".row-arrow.left").addEventListener("click", () => scroller.scrollBy({ left: -scroller.clientWidth * 0.85, behavior: "smooth" }));
    wrap.querySelector(".row-arrow.right").addEventListener("click", () => scroller.scrollBy({ left: scroller.clientWidth * 0.85, behavior: "smooth" }));
  }

  function renderHome() {
    const root = document.getElementById("home-rows");
    root.innerHTML = "";

    const cont = getContinue();
    const cwIds = Object.keys(cont).filter((id) => findMovie(id));
    if (cwIds.length) {
      renderRow(root, "Continue Watching", cwIds.map(findMovie), true);
    }
    CATEGORIES.forEach((cat) => {
      renderRow(root, cat.label, byTagOrGenre(cat));
    });
  }

  /* ---------------- hero ---------------- */
  function renderHero() {
    const featured = findMovie(4); // Ashfall Protocol
    const hero = document.getElementById("hero");
    const inList = isInMyList(featured.id);
    hero.innerHTML = `
      <div class="hero-bg">
        <div class="bg-grad" style="background:linear-gradient(120deg, ${featured.colorA}, ${featured.colorB} 60%, #050505);"></div>
        <div class="bg-shape" style="width:46vw;height:46vw;left:-8vw;top:-10vw;background:${featured.colorB};"></div>
        <div class="bg-shape" style="width:36vw;height:36vw;right:-6vw;bottom:-8vw;background:${featured.colorA};"></div>
      </div>
      <div class="hero-scrim"></div>
      <div class="hero-content">
        <div class="hero-badge">${svgIcon('<path d="M12 2l2.6 6.6L22 9l-5.6 4.5L18 22l-6-4.3L6 22l1.6-8.5L2 9l7.4-.4L12 2z"/>')} Featured Original</div>
        <h1 class="hero-title">${featured.title}</h1>
        <div class="hero-meta">
          <span class="chip rating">★ ${featured.rating}</span>
          <span class="chip">${featured.uaRating}</span>
          <span class="chip">${featured.year}</span>
          <span class="chip">${featured.duration}</span>
          <span class="chip">${featured.genre.join(" / ")}</span>
        </div>
        <p class="hero-desc">${featured.description}</p>
        <div class="hero-actions">
          <a class="btn btn-primary" href="player.html?id=${featured.id}">${svgIcon('<path d="M6 4l14 8-14 8V4z"/>')} Watch Now</a>
          <button class="btn btn-ghost ${inList ? "active" : ""}" data-mylist="${featured.id}">
            ${svgIcon('<path d="M12 5v14M5 12h14"/>')} <span>${inList ? "In My List" : "Add to List"}</span>
          </button>
        </div>
      </div>`;
  }

  /* ---------------- modal ---------------- */
  const modalBackdrop = () => document.getElementById("modal-backdrop");

  function openModal(id) {
    const m = findMovie(id);
    if (!m) return;
    const inList = isInMyList(m.id);
    modalBackdrop().innerHTML = `
      <div class="modal">
        <div class="modal-backdrop-img" style="background:linear-gradient(135deg, ${m.colorA}, ${m.colorB});">
          <div class="m-scrim"></div>
          <button class="modal-close" id="modal-close">${svgIcon('<path d="M18 6L6 18M6 6l12 12"/>')}</button>
        </div>
        <div class="modal-body">
          <h2 class="modal-title">${m.title}</h2>
          <div class="modal-meta">
            <span class="chip rating">★ ${m.rating}</span>
            <span class="chip">${m.uaRating}</span>
            <span class="chip">${m.year}</span>
            <span class="chip">${m.duration}</span>
            <span class="chip">${m.quality}</span>
            <span class="chip">${m.language}</span>
            ${m.genre.map((g) => `<span class="chip">${g}</span>`).join("")}
          </div>
          <p class="modal-desc">${m.description}</p>
          <div class="modal-actions">
            <a class="btn btn-primary" href="player.html?id=${m.id}">${svgIcon('<path d="M6 4l14 8-14 8V4z"/>')} Watch Now</a>
            <button class="btn btn-ghost ${inList ? "active" : ""}" data-mylist="${m.id}">
              ${svgIcon('<path d="M12 5v14M5 12h14"/>')} <span>${inList ? "In My List" : "Add to My List"}</span>
            </button>
          </div>
          ${m.type === "series" ? `
          <div class="modal-episodes">
            <h3 class="section-title" style="font-size:15px;margin-bottom:10px;">Episodes</h3>
            ${m.episodes.map((e) => `
              <a class="ep-row" href="player.html?id=${m.id}&ep=${e.ep}">
                <div class="ep-num">${e.ep}</div>
                <div class="ep-title">${e.title}</div>
                <div class="ep-dur">${e.duration}</div>
              </a>`).join("")}
          </div>` : ""}
        </div>
      </div>`;
    modalBackdrop().classList.add("open");
    document.body.style.overflow = "hidden";
    document.getElementById("modal-close").addEventListener("click", closeModal);
  }
  function closeModal() {
    modalBackdrop().classList.remove("open");
    document.body.style.overflow = "";
  }

  /* ---------------- search ---------------- */
  const searchOverlay = () => document.getElementById("search-overlay");
  function openSearch() {
    searchOverlay().classList.add("open");
    document.body.style.overflow = "hidden";
    setTimeout(() => document.getElementById("search-input").focus(), 200);
  }
  function closeSearch() {
    searchOverlay().classList.remove("open");
    document.body.style.overflow = "";
    document.getElementById("search-input").value = "";
    renderSearchResults("");
  }
  function renderSearchResults(q) {
    const results = document.getElementById("search-results");
    q = q.trim().toLowerCase();
    if (!q) {
      results.innerHTML = `<div class="empty-state">${svgIcon('<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>')}<h3>Search CodexStudys</h3><p>Find movies, series and genres.</p></div>`;
      return;
    }
    const matches = MOVIES.filter(
      (m) => m.title.toLowerCase().includes(q) || m.genre.some((g) => g.toLowerCase().includes(q))
    );
    if (!matches.length) {
      results.innerHTML = `<div class="empty-state">${svgIcon('<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>')}<h3>No results found</h3><p>We couldn't find anything for "${q}".</p></div>`;
      return;
    }
    results.innerHTML = `<div class="grid">${matches.map(buildCard).join("")}</div>`;
  }

  /* ---------------- views / nav ---------------- */
  function setActiveNav(view) {
    document.querySelectorAll("[data-nav]").forEach((el) => {
      el.classList.toggle("active", el.dataset.nav === view);
    });
  }

  function showView(view) {
    document.querySelectorAll(".view").forEach((v) => v.classList.remove("active"));
    const el = document.getElementById(view + "-view");
    if (el) el.classList.add("active");
    setActiveNav(view);
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
    closeMobileMenu();
    if (view === "movies") renderGrid("movies-grid", MOVIES.filter((m) => m.type === "movie"));
    if (view === "series") renderGrid("series-grid", MOVIES.filter((m) => m.type === "series"));
    if (view === "latest") renderGrid("latest-grid", [...MOVIES].sort((a, b) => b.year - a.year));
    if (view === "mylist") renderGrid("mylist-grid", getMyList().map(findMovie).filter(Boolean), "Your list is empty. Tap + Add to List on any title.");
    if (view === "genres") renderGenres();
  }

  function renderGrid(id, items, emptyMsg) {
    const el = document.getElementById(id);
    if (!items.length) {
      el.innerHTML = `<div class="empty-state">${svgIcon('<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18"/>')}<h3>Nothing here yet</h3><p>${emptyMsg || "Check back soon."}</p></div>`;
      return;
    }
    el.innerHTML = items.map(buildCard).join("");
  }

  const GENRE_COLORS = {
    Action: ["#3a1414", "#5a1f1f"], Comedy: ["#3a2f0e", "#5a4a16"], Drama: ["#1a1f3a", "#242c52"],
    Thriller: ["#241428", "#3a1f42"], Romance: ["#3a1424", "#5a1f38"], "Sci-Fi": ["#0e2a3a", "#16455a"],
    Horror: ["#141414", "#2a0e0e"], Animation: ["#0e3a2a", "#165a42"], Crime: ["#2a2414", "#42381e"],
    Adventure: ["#14301c", "#1e4a2c"], Fantasy: ["#22143a", "#361f5a"],
  };
  function renderGenres() {
    const el = document.getElementById("genres-grid");
    el.innerHTML = GENRE_LIST.map((g) => {
      const [c0, c1] = GENRE_COLORS[g] || ["#1c1c1c", "#242424"];
      return `<div class="genre-tile" style="background:linear-gradient(135deg, ${c0}, ${c1});" data-genre="${g}">
        ${svgIcon(GENRE_ICONS[g])}${g}
      </div>`;
    }).join("");
  }

  function renderMoviesGenreFilter() {
    const bar = document.getElementById("movies-filter");
    bar.innerHTML = `<button class="btn btn-ghost btn-sm active" data-genre-filter="All">All</button>` +
      GENRE_LIST.map((g) => `<button class="btn btn-ghost btn-sm" data-genre-filter="${g}">${g}</button>`).join("");
  }

  /* ---------------- event delegation ---------------- */
  function wireGlobalClicks() {
    document.body.addEventListener("click", (e) => {
      const card = e.target.closest(".card");
      const mylistBtn = e.target.closest("[data-mylist]");
      const navEl = e.target.closest("[data-nav]");
      const genreTile = e.target.closest(".genre-tile");
      const genreFilter = e.target.closest("[data-genre-filter]");

      if (mylistBtn) {
        e.stopPropagation();
        const id = mylistBtn.dataset.mylist;
        const nowIn = toggleMyList(id);
        mylistBtn.classList.toggle("active", nowIn);
        mylistBtn.querySelector("span").textContent = nowIn ? "In My List" : "Add to My List";
        toast(nowIn ? "Added to My List" : "Removed from My List");
        return;
      }
      if (card && !mylistBtn) {
        openModal(card.dataset.id);
        return;
      }
      if (navEl) {
        e.preventDefault();
        showView(navEl.dataset.nav);
        return;
      }
      if (genreTile) {
        showView("movies");
        setTimeout(() => {
          document.querySelectorAll("[data-genre-filter]").forEach((b) => b.classList.toggle("active", b.dataset.genreFilter === genreTile.dataset.genre));
          renderGrid("movies-grid", MOVIES.filter((m) => m.genre.includes(genreTile.dataset.genre)));
        }, 0);
        return;
      }
      if (genreFilter) {
        document.querySelectorAll("[data-genre-filter]").forEach((b) => b.classList.remove("active"));
        genreFilter.classList.add("active");
        const g = genreFilter.dataset.genreFilter;
        renderGrid("movies-grid", g === "All" ? MOVIES.filter((m) => m.type === "movie") : MOVIES.filter((m) => m.genre.includes(g)));
        return;
      }
    });
  }

  /* ---------------- navbar scroll + mobile menu ---------------- */
  function wireNavbarScroll() {
    const nav = document.getElementById("navbar");
    window.addEventListener("scroll", () => {
      nav.classList.toggle("scrolled", window.scrollY > 30);
    }, { passive: true });
  }
  function openMobileMenu() { document.getElementById("mobile-menu").classList.add("open"); }
  function closeMobileMenu() { document.getElementById("mobile-menu")?.classList.remove("open"); }

  /* ---------------- profile dropdown ---------------- */
  function wireDropdown() {
    const dd = document.getElementById("profile-dropdown");
    dd.querySelector(".avatar").addEventListener("click", (e) => {
      e.stopPropagation();
      dd.classList.toggle("open");
    });
    document.addEventListener("click", () => dd.classList.remove("open"));
  }

  /* ---------------- init ---------------- */
  document.addEventListener("DOMContentLoaded", () => {
    seedDemoContinueWatching();
    renderHero();
    renderHome();
    renderMoviesGenreFilter();
    wireGlobalClicks();
    wireNavbarScroll();
    wireDropdown();

    document.getElementById("search-btn").addEventListener("click", openSearch);
    document.getElementById("search-close").addEventListener("click", closeSearch);
    document.getElementById("search-input").addEventListener("input", (e) => renderSearchResults(e.target.value));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") { closeSearch(); closeModal(); closeMobileMenu(); }
    });

    modalBackdrop().addEventListener("click", (e) => { if (e.target === modalBackdrop()) closeModal(); });

    document.getElementById("hamburger-btn").addEventListener("click", openMobileMenu);
    document.getElementById("mobile-menu-close").addEventListener("click", closeMobileMenu);
    document.getElementById("mobile-menu").addEventListener("click", (e) => {
      if (e.target.id === "mobile-menu") closeMobileMenu();
    });

    showView("home");
  });
})();
