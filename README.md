# Fermento — Landing Page

Sito statico di presentazione per [Fermento](https://github.com/cardinaleraf-max/Fermento), gestionale desktop per birrifici artigianali.

## Sviluppo locale

Non serve build, è HTML + CSS vanilla. Apri `index.html` nel browser o usa un server locale:

```bash
python3 -m http.server 8000
# oppure
npx serve .
```

## Deploy su GitHub Pages

1. Crea repo `fermento-landing` su GitHub
2. `git init && git add . && git commit -m "Landing iniziale"`
3. `git remote add origin git@github.com:cardinaleraf-max/fermento-landing.git`
4. `git push -u origin main`
5. Su GitHub → Settings → Pages → Source: `main` branch, root folder
6. URL pubblico: `https://cardinaleraf-max.github.io/fermento-landing/`

## Cose da modificare prima del lancio pubblico

- **Numero WhatsApp**: cerca `PLACEHOLDER_NUMERO` in `index.html` e sostituisci con il numero formato internazionale senza `+` o spazi (es. `393331234567`)
- **Demo**: nel commento `PLACEHOLDER DEMO` in `index.html` decommentare e configurare iframe Arcade o tag video
- **Screenshot hero**: sostituire `<div class="hero-screenshot-placeholder">` con un `<img>` reale
- **OG image**: aggiungere `<meta property="og:image" content="...">` in `<head>` per anteprima WhatsApp ricca
- **Favicon**: sostituire `assets/favicon.svg` se vuoi un'altra grafica

## Struttura

```
landing fermento/
├── index.html          Markup completo
├── styles.css          Stili mobile-first, media query a 768px e 1024px
├── .nojekyll           Disabilita Jekyll su GitHub Pages
├── README.md           Questo file
└── assets/
    └── favicon.svg     Favicon F ambrata
```
