# NiceyBud — Agency Website

Animated, multi-page static website for **NiceyBud** — *Your AI Partner for Growth, Creativity & Automation*.

No build step, no dependencies: plain HTML, CSS and vanilla JavaScript.

## Pages
| Page | File |
|---|---|
| Home | `index.html` |
| Services + pricing + FAQ | `services.html` |
| Products (filter, search, detail modal) | `products.html` |
| Blog (featured, categories, search) | `blog.html` |
| Blog article (`post.html?p=<slug>`) | `post.html` |
| About (manifesto, values, team, timeline) | `about.html` |
| Contact (form, budget slider, emails) | `contact.html` |
| 404 | `404.html` |

## Effects
Preloader · interactive neural-network canvas (mouse-reactive, click to send pulses) · 3D orbiting service chips around the logo · text scramble & split-word reveals · custom cursor with labels · magnetic buttons · spotlight/tilt cards · sticky horizontal process scroll · live "AI agent" terminal demo · counters · marquees · infinite testimonials · circular dark/light theme transition · page wipe transitions · scroll progress · confetti · reading progress & TOC on articles · respects `prefers-reduced-motion`.

## Editing content
All services, products and blog posts live in **`js/data.js`**. Add an entry and it appears everywhere (home, listings, footer, article page).

## Run locally
```bash
python3 -m http.server 8000
```
Then open http://localhost:8000. Deploy anywhere static (Vercel, Netlify, GitHub Pages).

The contact form has no backend yet: when submitted it shows a success screen with a pre-filled `mailto:` link to support@niceybud.com. Connect Formspree, Netlify Forms or your own API in `js/pages.js` to receive submissions directly.
