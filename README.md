# 5/3/1 for Hardgainers – Client-side Calculator (Single HTML)

A single static client-side app (no backend) that lets you enter your **actual 1RM** for the four main lifts and automatically calculates:

- **Training Max (TM)** = **85% of 1RM**
- All working sets for the **5/3/1 for Hardgainers** template (Weeks 1–3)
- Each set’s weight is calculated from **TM** and updated instantly on input changes

This is intended as a lightweight “calculator” app only (not a workout logger).

## Features

- **100% client-side**: HTML + CSS + JS in one file.
- **jQuery-based**: all DOM updates / event handlers use jQuery.
- **Persistent inputs** using `localStorage`:
  - Your 1RM inputs are saved “forever” (until you clear browser/site data).
  - This also helps on mobile where browsers may reload pages after switching apps.
- **Week toggles**:
  - Weeks are **collapsed by default**.
  - Tap/click the **Week pill** to expand/collapse its days.
- **Defaults** (pre-filled on first load):
  - Squat: **100 kg**
  - Deadlift: **50 kg**
  - Bench Press: **100 kg**
  - Overhead Press: **50 kg**
- **Rounding**:
  - Weights are rounded to the nearest **0.5 kg** (configurable in the JS).

## Files

- `index.html` (recommended name): contains everything (markup, styles, scripts).
- `index.js`: contains all js functions written using jQuery to reference the DOM.
- `style.css`: contains all styling that are applied to the app.
- `workout.js`: contains the whole workout program as a JS object.
- `favicon.ico`: icon applied to the app tab.

## How to use

1. Setup:
   1. **Local**:
      1. Download the aforementioned files.
      2. Open `index.html` in a browser.
   2. **Online**: navigate to `https://trainingforhardgainers.deegeedev.eu/`
2. Enter your **actual** 1RM values.
3. The page will display:
   - TM for each lift
   - All set weights for each week/day

## Notes / Limitations

- Browsers/OS decide whether a mobile tab refreshes; JavaScript **cannot fully disable refresh**.
  - This app mitigates the impact by restoring your inputs from `localStorage`.
- jQuery is loaded from the CDN in the HTML.  
  If you want fully offline use, download jQuery and reference it locally instead.

## Program Source

The routine implemented is based on:

- Jim Wendler – “5/3/1 for Hardgainers”  
  https://www.jimwendler.com/blogs/jimwendler-com/5-3-1-for-hardgainers
