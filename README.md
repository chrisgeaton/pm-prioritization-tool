# Feature Prioritization Matrix

A visual PM tool for plotting product features on an impact vs. effort matrix, with automatic quadrant classification and value-score ranking. Built for stakeholder conversations where a picture beats a spreadsheet.

## What It Does

Enter any product feature with an **impact score** (1–10) and an **effort score** (1–10). The tool places it on a 2×2 matrix and classifies it into one of four quadrants:

| Quadrant | Impact | Effort | Recommendation |
|----------|--------|--------|----------------|
| **Quick Wins** | High | Low | Do these first |
| **Major Projects** | High | High | Plan carefully |
| **Fill-ins** | Low | Low | Nice to have |
| **Thankless Tasks** | Low | High | Consider dropping |

A ranked list below the matrix sorts features by **value score** (impact ÷ effort), giving you a clear prioritization order at a glance.

## Features

- Add, edit, and delete features on the fly
- Live matrix updates as you adjust sliders
- Value-score stack rank sorted by impact/effort ratio
- Export the matrix as a PNG for presentations
- Zero backend — runs entirely in the browser

## Tech Stack

- **React** — component state drives the matrix in real time
- **Tailwind CSS** — utility-first styling, no custom CSS needed
- **lucide-react** — icon set
- **html2canvas** — client-side PNG export
- **Vercel Analytics** — lightweight usage tracking

## Quick Start

```bash
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Key Design Decisions

- **No backend / no auth** — this is a session tool, not a database. Fast to load, easy to share.
- **Impact ÷ effort as value score** — simple ratio keeps the ranking transparent and explainable to non-technical stakeholders.
- **Client-side PNG export** — lets you paste the matrix directly into decks without a screenshot tool.

## Status

Active — deployed on Vercel.
