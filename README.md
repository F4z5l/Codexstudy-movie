# CODEXSTUDYS — OTT Demo Build

A frontend-only, premium movie/series streaming UI. Vanilla HTML/CSS/JS, no
build step, deploys as-is to Vercel (or any static host).

## What's inside
- `index.html` — home page: hero, movie rows, Continue Watching, Movies,
  Series, Genres, Latest, My List, search.
- `player.html` — custom video player: play/pause, seek, fullscreen,
  quality/language selectors (UI only), episode list for series.
- `js/movies.js` — all catalogue data. Add a title by adding one object here.
- `js/app.js`, `js/player.js` — app logic.
- `css/style.css` — the design system.
- `assets/demo-video.mp4` / `demo-video.webm` — short placeholder clip used
  as the demo video source for every title.

## This is demo content
Every title, poster and backdrop is generated placeholder art (CSS
gradients + genre icons) with a made-up description. All titles currently
point at the same short demo video, clearly labeled "Demo Preview" in the
player. No third-party streaming providers, no scraped posters, no
copyrighted artwork.

## Adding your own authorized content
1. Open `js/movies.js`.
2. Each entry has a `videoUrl` (mp4) and `videoUrlWebm` (webm) — replace
   with your own hosted file URLs per title once you have the rights.
3. Posters/backdrops are CSS-generated (`colorA`/`colorB` gradient + a genre
   icon) so there's nothing to swap unless you want to add real images —
   in that case, add a `poster`/`backdrop` URL field and update
   `posterStyle()` in `app.js` to use `background-image` instead.

## Local preview
Just open `index.html` in a browser, or run any static server:
```
npx serve .
```

## Deploy
Push to a Git repo and import into Vercel as a static project (no build
command needed) — or drag-and-drop the folder in the Vercel dashboard.


## Installable as an app (PWA)
The site now ships with `manifest.webmanifest`, `sw.js`, and app icons in
`assets/icons/`. A permanent **Install App** button lives in the navbar
(and inside the mobile menu / player topbar) — it triggers the native
Chrome/Edge/Android install prompt, shows Add-to-Home-Screen instructions
on iOS Safari (which has no install prompt API), and reads "Installed"
once the app is added. The navbar logo and all icons use the logo you
provided (`assets/logo.png`).
