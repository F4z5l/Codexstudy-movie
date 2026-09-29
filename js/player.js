/* ==========================================================================
   CODEXSTUDYS — player.js
   ========================================================================== */
(function () {
  "use strict";
  const LS_MYLIST = "cx_mylist";
  const LS_CONTINUE = "cx_continue";

  function qs(name) {
    return new URLSearchParams(window.location.search).get(name);
  }
  function getMyList() { try { return JSON.parse(localStorage.getItem(LS_MYLIST)) || []; } catch { return []; } }
  function setMyList(a) { localStorage.setItem(LS_MYLIST, JSON.stringify(a)); }
  function isInMyList(id) { return getMyList().includes(Number(id)); }
  function toggleMyList(id) {
    id = Number(id);
    let l = getMyList();
    if (l.includes(id)) l = l.filter((x) => x !== id); else l.unshift(id);
    setMyList(l);
    return l.includes(id);
  }
  function getContinue() { try { return JSON.parse(localStorage.getItem(LS_CONTINUE)) || {}; } catch { return {}; } }
  function saveProgress(id, percent) {
    const c = getContinue();
    c[id] = { percent: Math.round(percent), updatedAt: Date.now() };
    localStorage.setItem(LS_CONTINUE, JSON.stringify(c));
  }

  function svgIcon(path) { return `<svg viewBox="0 0 24 24">${path}</svg>`; }
  function fmtTime(t) {
    if (!isFinite(t)) return "0:00";
    const m = Math.floor(t / 60), s = Math.floor(t % 60);
    return `${m}:${String(s).padStart(2, "0")}`;
  }

  document.addEventListener("DOMContentLoaded", () => {
    const id = qs("id") || "4";
    const epParam = qs("ep");
    const movie = findMovie(id);

    if (!movie) {
      document.getElementById("player-app").innerHTML = `
        <div class="empty-state" style="padding:120px 20px;">
          ${svgIcon('<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>')}
          <h3>Title not found</h3><p>This demo title may have been removed.</p>
          <a class="btn btn-primary" style="margin-top:16px;display:inline-flex;" href="index.html">Back to Home</a>
        </div>`;
      return;
    }

    document.title = `${movie.title} — CODEXSTUDYS`;

    const video = document.getElementById("video");
    video.innerHTML = `
      <source src="${movie.videoUrlWebm}" type="video/webm">
      <source src="${movie.videoUrl}" type="video/mp4">`;
    video.load();

    const cont = getContinue();
    const savedPercent = cont[movie.id] ? cont[movie.id].percent : 0;

    /* ---- info panel ---- */
    document.getElementById("player-title").textContent = movie.title;
    document.getElementById("player-meta").innerHTML = `
      <span class="chip rating">★ ${movie.rating}</span>
      <span class="chip">${movie.uaRating}</span>
      <span class="chip">${movie.year}</span>
      <span class="chip">${movie.duration}</span>
      <span class="chip">${movie.quality}</span>
      <span class="chip">${movie.language}</span>
      ${movie.genre.map((g) => `<span class="chip">${g}</span>`).join("")}`;
    document.getElementById("player-desc").textContent = movie.description;

    const mylistBtn = document.getElementById("player-mylist");
    const inList = isInMyList(movie.id);
    mylistBtn.classList.toggle("active", inList);
    mylistBtn.querySelector("span").textContent = inList ? "In My List" : "Add to My List";
    mylistBtn.addEventListener("click", () => {
      const now = toggleMyList(movie.id);
      mylistBtn.classList.toggle("active", now);
      mylistBtn.querySelector("span").textContent = now ? "In My List" : "Add to My List";
    });

    /* ---- episode selector ---- */
    const epWrap = document.getElementById("episode-section");
    let currentEp = movie.type === "series" ? (movie.episodes.find((e) => String(e.ep) === String(epParam)) || movie.episodes[0]) : null;
    if (movie.type === "series") {
      epWrap.style.display = "";
      document.getElementById("episode-list").innerHTML = movie.episodes.map((e) => `
        <div class="ep-row ${currentEp.ep === e.ep ? "active-ep" : ""}" data-ep="${e.ep}">
          <div class="ep-num">${e.ep}</div>
          <div class="ep-title">${e.title}</div>
          <div class="ep-dur">${e.duration}</div>
        </div>`).join("");
      document.getElementById("now-playing-ep").textContent = `E${currentEp.ep} · ${currentEp.title}`;
      document.getElementById("episode-list").addEventListener("click", (e) => {
        const row = e.target.closest("[data-ep]");
        if (!row) return;
        const ep = movie.episodes.find((x) => String(x.ep) === row.dataset.ep);
        currentEp = ep;
        document.getElementById("now-playing-ep").textContent = `E${ep.ep} · ${ep.title}`;
        document.querySelectorAll("#episode-list .ep-row").forEach((r) => r.classList.remove("active-ep"));
        row.classList.add("active-ep");
        history.replaceState(null, "", `player.html?id=${movie.id}&ep=${ep.ep}`);
        video.currentTime = 0;
        video.play().catch(() => {});
      });
    } else {
      epWrap.style.display = "none";
    }

    /* ---- custom controls ---- */
    const playBtn = document.getElementById("ctrl-play");
    const seek = document.getElementById("seek");
    const curTimeEl = document.getElementById("cur-time");
    const durTimeEl = document.getElementById("dur-time");
    const fsBtn = document.getElementById("ctrl-fullscreen");
    const stage = document.getElementById("player-stage");
    const volBtn = document.getElementById("ctrl-mute");
    const bigPlay = document.getElementById("big-play");

    function setPlayIcon(playing) {
      playBtn.innerHTML = playing
        ? svgIcon('<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>')
        : svgIcon('<path d="M6 4l14 8-14 8V4z"/>');
    }
    function togglePlay() {
      if (video.paused) { video.play().catch(() => {}); } else { video.pause(); }
    }
    playBtn.addEventListener("click", togglePlay);
    bigPlay.addEventListener("click", togglePlay);
    video.addEventListener("play", () => { setPlayIcon(true); bigPlay.classList.add("hidden"); });
    video.addEventListener("pause", () => { setPlayIcon(false); bigPlay.classList.remove("hidden"); });

    video.addEventListener("loadedmetadata", () => {
      durTimeEl.textContent = fmtTime(video.duration);
      if (savedPercent > 0 && savedPercent < 95) {
        video.currentTime = (savedPercent / 100) * video.duration;
      }
    });
    video.addEventListener("timeupdate", () => {
      const pct = (video.currentTime / video.duration) * 100 || 0;
      seek.value = pct;
      seek.style.setProperty("--pct", pct + "%");
      curTimeEl.textContent = fmtTime(video.currentTime);
      if (video.duration) saveProgress(movie.id, pct);
    });
    seek.addEventListener("input", () => {
      video.currentTime = (seek.value / 100) * (video.duration || 0);
    });

    volBtn.addEventListener("click", () => {
      video.muted = !video.muted;
      volBtn.innerHTML = video.muted
        ? svgIcon('<path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M23 9l-6 6M17 9l6 6"/>')
        : svgIcon('<path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M15.5 8.5a5 5 0 010 7"/>');
    });

    fsBtn.addEventListener("click", () => {
      if (!document.fullscreenElement) stage.requestFullscreen?.();
      else document.exitFullscreen?.();
    });

    /* ---- quality / language fake selectors ---- */
    function wireSelect(btnId, menuId) {
      const btn = document.getElementById(btnId);
      const menu = document.getElementById(menuId);
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        document.querySelectorAll(".select-menu").forEach((m) => { if (m !== menu) m.classList.remove("open"); });
        menu.classList.toggle("open");
      });
      menu.addEventListener("click", (e) => {
        const opt = e.target.closest("[data-opt]");
        if (!opt) return;
        btn.querySelector("span").textContent = opt.dataset.opt;
        menu.querySelectorAll("[data-opt]").forEach((o) => o.classList.remove("sel"));
        opt.classList.add("sel");
        menu.classList.remove("open");
      });
    }
    wireSelect("quality-btn", "quality-menu");
    wireSelect("lang-btn", "lang-menu");
    document.addEventListener("click", () => document.querySelectorAll(".select-menu").forEach((m) => m.classList.remove("open")));

    document.getElementById("back-home").addEventListener("click", () => { window.location.href = "index.html"; });

    window.addEventListener("beforeunload", () => {
      if (video.duration) saveProgress(movie.id, (video.currentTime / video.duration) * 100);
    });
  });
})();
