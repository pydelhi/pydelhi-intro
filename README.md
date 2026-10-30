# PyDelhi: an introduction

The slides we use to introduce [PyDelhi](https://pydelhi.org), Delhi NCR's Python community, at colleges, companies and meetups. They share the main site's look: Outfit, the pastel cards, the grain, the navy and gold, and the mascot snake, which grows along the bottom edge as the progress bar.

It's a plain HTML, CSS and JavaScript page. There's no build step and no dependencies, so open `index.html` in a browser or serve the folder (`python3 -m http.server`).

## Presenting

The deck is made for a projector: nothing on a slide is clicked or hovered. Every way to join in is a QR code with its short address beside it, so the room can scan it from their seats. It runs from the keyboard or a clicker.

| Key | Does |
| --- | --- |
| `→` `↓` `Space` `Enter` `Page Down` | next step, then the next slide |
| `←` `↑` `Backspace` `Page Up` | back a step, then the previous slide |
| `Home` / `End` | first / last slide |
| `F` | fullscreen |

Two slides have steps inside them. On "One Saturday a month, many ways in." each press lights the next format and shows its photo. On "Saturdays look like this." each press tosses the top photo off the pile. The mouse cursor hides itself when it isn't moving.

Each slide has its own address (`#3`), so you can open straight to one. On a phone, swipe or use the next and back buttons, which show only there. To get a PDF, print the page from the browser: each slide is one page.

## Changing it

Each slide is a `<section class="slide">` in `index.html`. Pieces with a `data-m` attribute play in one after another as the slide arrives (`rise`, `fade`, `pop`, `drop`, `photo`, `underline`; the motions are in `deck.js`). Slides with steps are registered in `STEPS` in `deck.js`.

Photos and logos are copied from the main site's `src/assets/`. The QR codes in `assets/qr/` are plain SVGs; if a link changes, regenerate its code (any QR generator that exports SVG works) and keep the navy `#00296B` fill. The month-by-month graph reads `MONTHS_MET` in `deck.js`, kept in step with `src/_data/meetupHistory.js` on the main site.

## Licence

Code is MIT, photos and logos are covered by `LICENSE-MEDIA.md`.
