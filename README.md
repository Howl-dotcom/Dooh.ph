# DOOH Philippines — Website

Static site (plain HTML, CSS and JavaScript — no build step) restyled to match the Figma design.

## Pages

| File | What it is |
| --- | --- |
| `index.html` | Home: hero, What we offer, Nationwide + Make it shine, Our clients |
| `about.html` | About: intro, mission/vision, services, "Behind the success" CEO note, team |
| `booking.html` | Booking page: pick any of the 21 billboard sites; shows photo, specs and rates. Deep-link with `booking.html#BMND6N` |
| `js/sites.js` | The site inventory (codes, sizes, locations, rates). Edit this to change or add sites; photos go in `assets/booking/` |
| `contact.html` | Contact page with a map of the office |
| `css/style.css` | All styling. Colours, fonts and spacing tokens are at the top under `:root` |
| `js/script.js` | Loading screen, header colour on scroll, mobile menu, Products dropdown, footer year |

## Run it

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8080   # then visit http://localhost:8080
```

## Things to finish

- **Images cropped from the Figma screenshots are low resolution.** In Figma, select each one and export at 2x, then overwrite the files (same names):
  - `assets/offer/*.jpg` — the five product photos
  - `assets/clients/*.png` — the 19 client logos (SVG would be best; if you switch to `.svg`, update the `src` in `index.html`)
  - `assets/nationwide-bg.jpg`
- **NCR traffic count** — the Figma frame shows "vehicles/day" with no number. Fill it in `index.html` (search for `TODO`).
- **Fonts** — Bricolage Grotesque (headlines) and Inter (body) are stand-ins loaded from Google Fonts. If the Figma uses other fonts, change `--font-display` / `--font-body` in `css/style.css` and the `<link>` in each page's `<head>`.
- **Booking rates** — the chevrons next to Regular / Prime / Block Time are decorative for now. Check the `TODO` in `js/sites.js` (EDSA Boni Apo block-time price).
- **Contact panel** — the grey rounded panel in Figma is filled with a Google map. Replace the `<iframe>` in `contact.html` with a form if that was the intent.

## Loading screen

`assets/loading-animation.mp4` plays full-screen on a white background when the site is opened, then slides away once the page has loaded. It plays once per browser session; to play it on every page instead, set `SHOW_ONCE_PER_SESSION` to `false` in `initLoader()` in `js/script.js`. Visitors with "reduce motion" turned on skip it. To swap the animation, replace the mp4 (keep it silent-friendly and on a white background). The markup is the `#loader` block at the top of each page's `<body>`; styling is section 14 of `css/style.css`.

## Deploying to GitHub Pages

Push the folder to a repo, then Settings → Pages → Source: `main` branch, root folder.
