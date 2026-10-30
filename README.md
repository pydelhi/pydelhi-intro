# PyDelhi: an introduction

The slides we use to introduce [PyDelhi](https://pydelhi.org), Delhi NCR's Python community, at colleges, companies and meetups. It uses the same look as the main site: Outfit, pastel cards, grain and the gold-and-navy palette.

It's a plain HTML, CSS and JavaScript page. There's no build step and no dependencies, so open `index.html` in a browser or serve the folder (`python3 -m http.server`).

## Presenting

| Key | Does |
| --- | --- |
| `→` `↓` `Space` `Enter` | next slide |
| `←` `↑` `Backspace` | previous slide |
| `Home` / `End` | first / last slide |
| `F` | fullscreen |

On a phone, swipe. Each slide has its own address (`#3`), so you can link straight to one. To get a PDF, print the page from the browser: each slide is one page.

## Changing it

Each slide is a `<section class="slide">` in `index.html`. Things inside a slide that carry `class="r"` rise in one after another; `--i` sets their order. Cards take the `blue`, `yellow` or `green` tint. Photos and logos live in `assets/`, copied from the main site.

## Licence

Code is MIT, photos and logos are covered by `LICENSE-MEDIA.md`.
