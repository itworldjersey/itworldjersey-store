(() => {
  const R2 = "https://video.itworldjersey.store/";
  const TOTAL = 1200, PAGE = 24;
  const grid = document.getElementById("videoGrid"), load = document.getElementById("loadMore");
  const count = document.getElementById("resultCount"), hint = document.getElementById("resultHint");
  const empty = document.getElementById("empty"), searchInput = document.getElementById("searchInput");
  const dialog = document.getElementById("playerDialog"), player = document.getElementById("mainPlayer");
  const playerId = document.getElementById("playerId"), playerTitle = document.getElementById("playerTitle"), openSource = document.getElementById("openSource");
  let shown = PAGE, query = "", view = "grid";

  const id4 = n => String(n).padStart(4, "0");
  const srcFor = n => R2 + id4(n) + ".mp4";

  function buildNumbers() {
    const q = query.replace(/[^0-9]/g, "");
    if (!q) return Array.from({length: TOTAL}, (_, i) => i + 1);
    const n = Math.max(1, Math.min(TOTAL, Number(q)));
    return Array.from({length: Math.min(40, TOTAL)}, (_, i) => {
      const v = n + i;
      return v <= TOTAL ? v : null;
    }).filter(Boolean);
  }

  function card(n) {
    const id = id4(n), src = srcFor(n);
    const el = document.createElement("article");
    el.className = "video-card";
    el.dataset.video = id;
    el.innerHTML = '<div class="thumb"><video muted playsinline preload="metadata" src="' + src + '"></video><span class="video-number">#' + id + '</span><span class="duration">VIDEO</span><button class="play" type="button" aria-label="Play video ' + id + '">▶</button></div><div class="card-body"><div class="card-title">IT WORLD JERSEY — Video ' + id + '</div><div class="card-meta"><span>MP4 • R2 Delivery</span><span>0001–1200</span></div><button class="watch" type="button">Watch video</button></div>';
    const vid = el.querySelector("video"), play = el.querySelector(".play");
    const open = () => {
      player.src = src; player.currentTime = 0;
      playerId.textContent = "#" + id;
      playerTitle.textContent = "IT WORLD JERSEY — Video " + id;
      openSource.href = src;
      dialog.showModal();
      player.play().catch(() => {});
    };
    play.addEventListener("click", open);
    el.querySelector(".watch").addEventListener("click", open);
    el.addEventListener("mouseenter", () => { vid.play().catch(() => {}); });
    el.addEventListener("mouseleave", () => { vid.pause(); vid.currentTime = 0; });
    vid.addEventListener("loadedmetadata", () => {
      if (Number.isFinite(vid.duration) && vid.duration > 0) {
        const m = Math.floor(vid.duration / 60), s = Math.floor(vid.duration % 60);
        el.querySelector(".duration").textContent = m + ":" + String(s).padStart(2, "0");
      }
    });
    vid.addEventListener("error", () => { el.querySelector(".duration").textContent = "PREVIEW"; });
    return el;
  }

  function render() {
    const nums = buildNumbers();
    const visible = nums.slice(0, shown);
    grid.className = "video-grid" + (view === "compact" ? " compact" : "");
    grid.innerHTML = "";
    visible.forEach(n => grid.appendChild(card(n)));
    empty.hidden = visible.length > 0;
    count.textContent = visible.length + " video" + (visible.length === 1 ? "" : "s");
    hint.textContent = query ? "Search result for " + query : "Showing " + visible.length + " of " + TOTAL;
    load.hidden = visible.length >= nums.length || nums.length === 0;
  }

  document.getElementById("searchBtn").addEventListener("click", () => { query = searchInput.value.trim(); shown = PAGE; render(); });
  searchInput.addEventListener("keydown", e => { if (e.key === "Enter") { query = searchInput.value.trim(); shown = PAGE; render(); } });
  load.addEventListener("click", () => { shown += PAGE; render(); });
  document.querySelectorAll(".view-btn").forEach(btn => btn.addEventListener("click", () => {
    view = btn.dataset.view;
    document.querySelectorAll(".view-btn").forEach(x => x.classList.toggle("active", x === btn));
    render();
  }));
  dialog.addEventListener("close", () => { player.pause(); player.removeAttribute("src"); player.load(); });
  render();
})();