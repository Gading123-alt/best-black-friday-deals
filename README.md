# FridayFinds — Real Black Friday & Cyber Monday Deals 2026

[![Black Friday Deal Finder](https://make.fun/badge/black-friday-deal-finder-01.svg)](https://make.fun/bounty/black-friday-deal-finder-01)
[![Rank](https://make.fun/badge/black-friday-deal-finder-01/Gading123-alt/best-black-friday-deals/rank.svg)](https://make.fun/bounty/black-friday-deal-finder-01)
[![Reward](https://make.fun/badge/black-friday-deal-finder-01/Gading123-alt/best-black-friday-deals/reward.svg)](https://make.fun/bounty/black-friday-deal-finder-01)

A static deal-finder site of **real Black Friday and Cyber Monday 2026 deals**, found and price-checked on 27 Nov 2026. 20 deals from 5 stores (Amazon, Best Buy, Walmart, Target), each with its product, store, store link, sale price, usual price, discount and check time — plus an honest verdict on whether it is really a deal (new low / strong deal / solid saving).

Built for the make.fun bounty: https://make.fun/bounty/black-friday-deal-finder-01

## What it does

- **Search** deals by product, store or category
- **Filter** by category, store and minimum discount (20% / 30% / 50% off)
- **Sort** by biggest discount, biggest saving, lowest or highest price
- **Verdict on every deal**: “New low” (lowest price ever reported), “Strong deal” (a large cut), or “Solid saving” (a real but modest cut), with the evidence written on the card
- **“Also at”** notes where the same deal is listed at another store, so shoppers can compare
- Works offline from its own files, on desktop and on a phone

## How the deals were checked

Each deal was read on 27 Nov 2026 in a deals source that names the store (TradingView, 9to5Google, Popular Science, 2ndShift, TechResearchOnline, BeeBulletin, Miami Herald). The source is named on every card, and the footer explains the method. Prices are in USD and can change during the sale.

## Run it

```sh
node serve.ts        # serves app/ at http://localhost:8080
```

Or open `app/index.html` directly in a browser — no build step, no network requests.

## Hand in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` (Node 22, standard library only) copies `app/` and `screenshots/` to the output directory and writes `dossier.json` with the vendored make.fun library (`vendor/makefun-frontend.ts`, the kit's copy, unchanged).

## Layout

- `main.ts` — entrypoint: copies the site and writes the dossier
- `app/index.html` — page shell
- `app/style.css` — all styling, no external loads
- `app/deals.js` — the 20 checked deals with store, prices, links, sources and verdicts
- `app/app.js` — renders the grid; search, filters and sorting
- `screenshots/` — 3 real renders of the site (desktop, filtered view, phone)
- `vendor/makefun-frontend.ts` — kit library, unchanged
- `LICENSE` — MIT
