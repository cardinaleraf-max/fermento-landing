const { chromium } = require('playwright');
const path = require('path'); const fs = require('fs');
(async () => {
  const FPS = 30;
  fs.rmSync('frames', { recursive: true, force: true }); fs.mkdirSync('frames');
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: {width:1920,height:1080} });
  await p.goto('file://' + path.resolve('video.html'), { waitUntil: 'networkidle' });
  await p.evaluate(() => window.ready);
  const dur = await p.evaluate(() => window.DURATION);
  const n = Math.ceil(dur * FPS);
  for (let i = 0; i < n; i++) {
    await p.evaluate(t => seek(t), i / FPS);
    await p.screenshot({ path: `frames/f${String(i).padStart(5,'0')}.jpg`, type: 'jpeg', quality: 92 });
  }
  console.log('frames', n, 'dur', dur);
  await b.close();
})();
