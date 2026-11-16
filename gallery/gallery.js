(() => {
"use strict";

const PHOTO_R2 = "https://photo.itworldjersey.store";
const ASK_WA = "https://wa.me/601126238907";
const TOTAL = 1200;
const PER_PAGE = 100;

const grid = document.getElementById("galleryGrid");
const pagination = document.getElementById("galleryPagination");
const count = document.getElementById("galleryCount");
const search = document.getElementById("gallerySearch");
const searchButton = document.getElementById("gallerySearchButton");

const pad = n => String(n).padStart(4, "0");
const photoUrl = n => `${PHOTO_R2}/${pad(n)}.webp`;
const askMessage = n => {
  const name = pad(n);
  return `Hello..... IT World Jersey
itworldjersey.store/gallery

Product Name: ${name}
Product Type  : webp
Image: ${photoUrl(n)}

Hello IT WORLD JERSEY! I found this product in the gallery. Could you please let me know the current price and the total cost for an item like this?Thank you!`;
};
const askUrl = n => `${ASK_WA}?text=${encodeURIComponent(askMessage(n))}`;

let currentPage = 1;
let query = "";

function matchingNumbers() {
  if (!query) return Array.from({length: TOTAL}, (_, i) => i + 1);
  const q = query.replace(/^0+/, "") || "0";
  return Array.from({length: TOTAL}, (_, i) => i + 1)
    .filter(n => pad(n).includes(q) || String(n).includes(q));
}

function card(n) {
  const name = pad(n);
  const el = document.createElement("article");
  el.className = "gallery-card";
  el.innerHTML = `
    <div class="gallery-art">
      <img src="${photoUrl(n)}" alt="IT WORLD JERSEY Gallery ${name}" loading="lazy" decoding="async">
    </div>
    <div class="gallery-info">
      <p class="gallery-name">Gallery ${name}</p>
      <div class="gallery-actions">
        <button class="gallery-zoom" type="button" data-zoom="${photoUrl(n)}" data-name="${name}">🔍 Zoom</button>
        <a class="gallery-ask" href="${askUrl(n)}" target="_blank" rel="noopener">☏ Click to Ask</a>
      </div>
    </div>`;
  return el;
}

function render() {
  const items = matchingNumbers();
  const pages = Math.max(1, Math.ceil(items.length / PER_PAGE));
  currentPage = Math.min(currentPage, pages);
  const start = (currentPage - 1) * PER_PAGE;
  const visible = items.slice(start, start + PER_PAGE);

  grid.innerHTML = "";
  if (!visible.length) {
    grid.innerHTML = '<div class="gallery-empty">No gallery images match your search.</div>';
  } else {
    const frag = document.createDocumentFragment();
    visible.forEach(n => frag.appendChild(card(n)));
    grid.appendChild(frag);
  }

  count.textContent = query
    ? `${items.length} result${items.length === 1 ? "" : "s"}`
    : `${TOTAL} images`;

  pagination.innerHTML = "";
  const add = (label, page, disabled = false, current = false) => {
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = label;
    b.disabled = disabled;
    if (current) b.className = "current";
    b.addEventListener("click", () => { currentPage = page; render(); window.scrollTo({top: 0, behavior: "smooth"}); });
    pagination.appendChild(b);
  };

  add("‹", currentPage - 1, currentPage === 1);
  const from = Math.max(1, currentPage - 2);
  const to = Math.min(pages, currentPage + 2);
  for (let p = from; p <= to; p++) add(String(p), p, false, p === currentPage);
  add("›", currentPage + 1, currentPage === pages);
}

function doSearch() {
  query = search.value.trim();
  currentPage = 1;
  render();
}

search.addEventListener("keydown", e => {
  if (e.key === "Enter") doSearch();
});
searchButton.addEventListener("click", doSearch);

grid.addEventListener("click", e => {
  const btn = e.target.closest("[data-zoom]");
  if (!btn) return;

  const src = btn.dataset.zoom;
  const name = btn.dataset.name;
  const overlay = document.createElement("div");
  overlay.className = "image-viewer";
  overlay.innerHTML = `
    <div class="image-viewer-panel">
      <button class="image-viewer-close" type="button" aria-label="Close">×</button>
      <img class="image-viewer-full" src="${src}" alt="Gallery ${name}">
      <div class="image-viewer-actions">
        <a class="gallery-ask" href="${askUrl(Number(name))}" target="_blank" rel="noopener">☏ Click to Ask</a>
      </div>
    </div>`;
  document.body.appendChild(overlay);
  document.body.classList.add("viewer-open");

  const close = () => {
    overlay.remove();
    document.body.classList.remove("viewer-open");
  };
  overlay.querySelector(".image-viewer-close").addEventListener("click", close);
  overlay.addEventListener("click", e => { if (e.target === overlay) close(); });
  document.addEventListener("keydown", function onKey(e) {
    if (e.key === "Escape") { close(); document.removeEventListener("keydown", onKey); }
  });
});

render();
})();