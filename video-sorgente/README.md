# Video demo — sorgente

Il video `assets/demo.mp4` è generato da codice: nessuna registrazione dello schermo.

- `video.html` — schermate dell'app ricostruite in HTML, animate su una timeline (`seek(t)`), con sottotitoli.
- `voce.mp3` — voiceover ElevenLabs (voce "Thomas", eleven_multilingual_v2). Riutilizzalo: rigenerarlo costa crediti.
- `render.js` — cattura 30 fotogrammi al secondo con Playwright in `frames/`.
- `poster.js` — crea la copertina (`poster.png`).

Rigenerare il video (dalla cartella `video-sorgente/`):

```bash
node render.js
ffmpeg -framerate 30 -i frames/f%05d.jpg -i voce.mp3 \
  -filter_complex "[1:a]adelay=800|800,loudnorm=I=-16:TP=-1.5:LRA=11,apad[a];[0:v]fade=t=in:st=0:d=0.4,fade=t=out:st=54.3:d=0.7,format=yuv420p[v]" \
  -map "[v]" -map "[a]" -t 55 -c:v libx264 -preset slow -crf 22 -c:a aac -b:a 128k -movflags +faststart ../assets/demo.mp4
```

Se cambi il testo della voce, aggiorna i tempi in `CAPS` e `T` dentro `video.html`.
