# Harry Robertson — Personal Site

Static personal website for Harry Robertson's CV, portfolio, publications, and talks. Built for GitHub Pages with no build tooling.

## Structure

- `index.html` — landing page with hero, skills, experience, highlights.
- `projects.html` — searchable and filterable project showcase.
- `publications.html` — publication list with BibTeX reveals.
- `talks.html` — talks, seminars, and workshop listings.
- `assets/css/style.css` — responsive layout, dark mode tokens, print styles.
- `assets/js/main.js` — navigation, theme toggle, project filters, footer metadata.
- `assets/img/` — avatar, social banners, icons.
- `assets/cv/Harry_Robertson_CV.pdf` — placeholder CV. Replace with latest PDF.

## Local Preview

Open `index.html` directly in your browser or use a lightweight server:

```bash
python3 -m http.server
```

## Deploying to GitHub Pages

1. Commit and push to the `main` branch of the `Harry25R.github.io` repository.
2. In GitHub, ensure **Settings → Pages** is set to deploy from the `main` branch root.
3. Changes publish automatically at `https://harry25r.github.io/`.

## Customisation

- Update contact details, social links, and copy in the HTML files (look for inline comments where tweaks are expected).
- Replace the placeholder CV PDF, avatar, and banner images under `assets/`.
- Adjust project metadata or add entries by editing `projects.html`.

