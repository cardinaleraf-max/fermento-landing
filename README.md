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

## Struttura

```
index.html   Markup (hero, gestionale, filiera agricola, Bira, demo, form, CTA)
styles.css   Stili mobile-first
script.js    Animazioni, stepper della filiera, chat di Bira, video demo, invio form (Web3Forms)
assets/      Video, foto, favicon, og-image
```

Font da Google Fonts (Fraunces, Hanken Grotesk, JetBrains Mono), icone Lucide da unpkg.
Tutti i dati mostrati nei componenti sono di esempio.
