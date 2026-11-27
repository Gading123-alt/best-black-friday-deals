// FridayFinds — renders the deal grid and wires search, filters and sorting.
// All data comes from deals.js in this same folder; nothing is fetched.

import { DEALS, META } from "./deals.js";

const grid = document.getElementById("grid");
const resultLine = document.getElementById("result-line");
const emptyNote = document.getElementById("empty");
const qInput = document.getElementById("q");
const categorySelect = document.getElementById("category");
const storeSelect = document.getElementById("store");
const discountSelect = document.getElementById("discount");
const sortSelect = document.getElementById("sort");

const VERDICT_LABEL = {
  "new-low": "New low",
  strong: "Strong deal",
  solid: "Solid saving",
};

function money(n) {
  return "$" + n.toFixed(2).replace(/\.00$/, "");
}

function discountPct(deal) {
  return Math.round((1 - deal.sale / deal.usual) * 100);
}

function fillOptions(select, values) {
  for (const value of values) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    select.appendChild(option);
  }
}

fillOptions(categorySelect, [...new Set(DEALS.map((d) => d.category))].sort());
fillOptions(storeSelect, [...new Set(DEALS.map((d) => d.store))].sort());

function dealCard(deal) {
  const pct = discountPct(deal);
  const saving = deal.usual - deal.sale;
  const article = document.createElement("article");
  article.className = "card";

  const badge = document.createElement("span");
  badge.className = "badge";
  badge.textContent = "−" + pct + "%";
  article.appendChild(badge);

  const title = document.createElement("h2");
  title.textContent = deal.product;
  article.appendChild(title);

  const storeLine = document.createElement("p");
  storeLine.className = "store-line";
  const storeName = document.createElement("strong");
  storeName.textContent = deal.store;
  storeLine.appendChild(storeName);
  storeLine.append(" · " + deal.category);
  article.appendChild(storeLine);

  const priceRow = document.createElement("div");
  priceRow.className = "price-row";
  const sale = document.createElement("span");
  sale.className = "sale";
  sale.textContent = money(deal.sale);
  const was = document.createElement("s");
  was.className = "was";
  was.textContent = money(deal.usual);
  const save = document.createElement("span");
  save.className = "save";
  save.textContent = "Save " + money(saving);
  priceRow.append(sale, was, save);
  article.appendChild(priceRow);

  const chip = document.createElement("span");
  chip.className = "chip " + deal.verdict;
  chip.textContent = VERDICT_LABEL[deal.verdict];
  article.appendChild(chip);

  const evidence = document.createElement("p");
  evidence.className = "evidence";
  evidence.textContent = deal.evidence;
  article.appendChild(evidence);

  if (deal.alsoAt) {
    const also = document.createElement("p");
    also.className = "also";
    also.textContent = "Also at: " + deal.alsoAt + ".";
    article.appendChild(also);
  }

  const meta = document.createElement("p");
  meta.className = "meta";
  meta.textContent = "Checked " + deal.checked + " · Source: " + deal.source;
  article.appendChild(meta);

  const buy = document.createElement("a");
  buy.className = "buy";
  buy.href = deal.link;
  buy.target = "_blank";
  buy.rel = "noopener";
  buy.textContent = "View at " + deal.store + " →";
  article.appendChild(buy);

  return article;
}

function currentFilters() {
  return {
    q: qInput.value.trim().toLowerCase(),
    category: categorySelect.value,
    store: storeSelect.value,
    minDiscount: Number(discountSelect.value),
    sort: sortSelect.value,
  };
}

// Shareable filtered views: ?q=airpods&category=Audio&store=Target&discount=30&sort=saving
// presets the controls on load, so a link opens the finder already filtered.
const params = new URLSearchParams(location.search);
if (params.get("q")) qInput.value = params.get("q");
if (params.get("category")) categorySelect.value = params.get("category");
if (params.get("store")) storeSelect.value = params.get("store");
if (params.get("discount")) discountSelect.value = params.get("discount");
if (params.get("sort")) sortSelect.value = params.get("sort");

function applyFilters() {
  const f = currentFilters();
  let shown = DEALS.filter((deal) => {
    if (f.category && deal.category !== f.category) return false;
    if (f.store && deal.store !== f.store) return false;
    if (discountPct(deal) < f.minDiscount) return false;
    if (f.q) {
      const hay = (deal.product + " " + deal.store + " " + deal.category).toLowerCase();
      if (!hay.includes(f.q)) return false;
    }
    return true;
  });

  const byDiscount = (a, b) => discountPct(b) - discountPct(a);
  const bySaving = (a, b) => b.usual - b.sale - (a.usual - a.sale);
  const byPriceAsc = (a, b) => a.sale - b.sale;
  const byPriceDesc = (a, b) => b.sale - a.sale;
  const sorters = {
    discount: byDiscount,
    saving: bySaving,
    "price-asc": byPriceAsc,
    "price-desc": byPriceDesc,
  };
  shown = [...shown].sort(sorters[f.sort] || byDiscount);

  grid.replaceChildren(...shown.map(dealCard));
  emptyNote.hidden = shown.length > 0;
  resultLine.textContent =
    "Showing " + shown.length + " of " + DEALS.length + " deals · " + META.edition + " · all prices checked " + META.checkedDay + ".";
}

for (const el of [qInput, categorySelect, storeSelect, discountSelect, sortSelect]) {
  el.addEventListener("input", applyFilters);
}

applyFilters();
