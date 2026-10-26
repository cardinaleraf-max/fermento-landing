const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: {width:1920,height:1080} });
  await p.goto('file://' + path.resolve('video.html'), { waitUntil: 'networkidle' }); await p.evaluate(() => window.ready);
  await p.evaluate(() => { seek(12.3); document.getElementById('cap').style.display='none'; document.querySelectorAll('#prodcard .meter i').forEach(m=>m.style.width=m.dataset.w+'%'); document.getElementById('cur').style.opacity=0; });
  await p.screenshot({ path: 'poster.png' }); await b.close();
})();
