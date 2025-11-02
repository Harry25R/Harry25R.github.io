# Harry Robertson — Personal Site

Tailwind-powered personal site for Harry Robertson's CV, portfolio, publications, and talks. The repo targets GitHub Pages; all assets compile to static HTML/CSS/JS.

## Structure

- `index.html`, `projects.html`, `publications.html`, `talks.html` — content pages with progressive enhancements.
- `assets/css/input.css` — Tailwind source; `assets/css/style.css` — compiled output (≤80 KB).
- `assets/js/src/` — readable ES modules. Run the build script to minify into `assets/js/` (≤25 KB served).
- `assets/data/` — JSON/CSV data powering interactive components.
- `img/` — avatar, banner, manifest icons, hero illustrations.
- `assets/cv/Harry_Robertson_CV.pdf` — placeholder CV; replace with the latest PDF.
- `.github/workflows/pages.yml` — GitHub Actions pipeline that builds CSS/JS and deploys to Pages.

## Local Development

```bash
npm install
npm run build   # compiles Tailwind + minifies JS into assets/js/
python3 -m http.server
```

Edit styles in `assets/css/input.css` and modules in `assets/js/src/`. Re-run `npm run build` (or `npm run build:css` / `npm run build:js`) after making changes.

## Deployment

1. Push to `main` (`Harry25R.github.io` repository).
2. GitHub Actions runs `npm run build` and deploys the generated static files.
3. Site publishes at `https://harry25r.github.io/`.

## Customisation Notes

- Update contact links, greetings, and hero copy directly in the HTML files.
- Extend projects/publications/talks data via the JSON files in `assets/data/`.
- Replace `img/avatar.jpg`, `img/banner.png`, hero illustrations, and the CV PDF with production-ready assets.
- Tailwind safelist lives in `tailwind.config.js`; add classes there if run-time string generation is required.
