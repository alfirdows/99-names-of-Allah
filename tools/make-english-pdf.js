/* Rebuilds names-english.pdf from the data in index.html. Run "python3 -m http.server 8765" in the repo folder, then "node tools/make-english-pdf.js". */
const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const p=await b.newPage();
await p.goto('http://localhost:8765/');await p.waitForTimeout(800);
const d=await p.evaluate(()=>({D:DATA,G:GLOSS,M:MEAN_EN,W:WM,E:WM_EN}));
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;');
const LBL='<div class="lbl">AI translation · please check with your teacher</div>';
const pg=(a,b)=>'p. '+a+(b!==a?'–'+b:'');
let h=`<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:Name;src:url(http://localhost:8765/fonts/Amiri-Bold.woff)}
@font-face{font-family:Naskh;src:url(http://localhost:8765/fonts/ScheherazadeNew-Regular.woff)}
@font-face{font-family:Plex;src:url(http://localhost:8765/fonts/IBMPlexSansArabic-Regular.woff)}
@font-face{font-family:Plex;font-weight:700;src:url(http://localhost:8765/fonts/IBMPlexSansArabic-Bold.woff)}
@page{size:A4;margin:16mm 15mm}
body{font-family:Plex,sans-serif;color:#1d2a22;font-size:10.5pt;line-height:1.5}
h1{font-size:22pt;color:#2f6b45;text-align:center;margin:40mm 0 4mm}
.sub{text-align:center;color:#555;max-width:140mm;margin:0 auto}
.warn{border:1.5px solid #c0392b;border-radius:8px;padding:10px 14px;margin:14mm auto 0;max-width:150mm;color:#7a2318}
.cover{page-break-after:always}
.ls{border-top:2px solid #3f7f55;padding:8px 0 10px;margin-top:8px}
.no{color:#3f7f55;font-weight:700;font-size:9pt}
.nm{display:flex;flex-wrap:wrap;gap:4px 22px;justify-content:center;direction:rtl}
.nm div{text-align:center}.nm b{font-family:Name;font-size:20pt;font-weight:400;display:block;line-height:1.5}.nm span{font-size:9pt;color:#555}
h4{margin:8px 0 2px;font-size:9.5pt;color:#2f6b45}
.ar{font-family:Naskh;direction:rtl;text-align:right;font-size:14pt;line-height:1.8;margin:2px 0}
.ref{font-size:8.5pt;color:#666;direction:rtl;text-align:right}
.lbl{font-size:7.5pt;font-weight:700;color:#a0522d;letter-spacing:.03em}
.en{margin:1px 0 4px}.nm,.q,h4{page-break-inside:avoid;page-break-after:auto}.q{border-inline-start:3px solid #d8e6dc;padding-inline-start:8px;margin:4px 0}
.src{font-size:8pt;color:#666}
</style></head><body>
<div class="cover"><h1>The Most Beautiful Names of Allah</h1><p class="sub">The text of «متن الأسماء» (evidence and meaning), with an English translation of each meaning, and the meaning of each name quoted from al-Sa'di, <i>Tafsir Asma' Allah al-Husna</i>.</p>
<div class="warn"><b>Please note:</b> every English text in this file is an AI translation and has not been checked by a scholar. Please check it with your teacher. The Arabic text is the original. The evidence (Qur'an and hadith) is given in Arabic only.</div>
<p class="sub" style="margin-top:10mm">alfirdows.github.io/99-names-of-Allah</p></div>`;
d.D.forEach((L,i)=>{
 h+=`<div class="ls"><div class="no">Lesson ${i+1}</div><div class="nm">${L.names.map((n,k)=>`<div><b>${esc(n)}</b><span>${esc(d.G[i][k]||'')}</span></div>`).join('')}</div>${LBL}
 <h4>Evidence · الدليل</h4>${L.ev.map(([x,r])=>`<p class="ar">${esc(x)}</p><div class="ref">${esc(r)}</div>`).join('')}
 <h4>Meaning · المعنى</h4>${L.m.map(x=>`<p class="ar">${esc(x)}</p>`).join('')}${LBL}${d.M[i].map(x=>`<p class="en">${esc(x)}</p>`).join('')}`;
 const W=d.W[i]||[];if(W.length){h+=`<h4>Meaning of each name, from al-Sa'di · معاني الأسماء</h4>`+W.map(([ks,q,a,b2])=>`<div class="q"><div class="ar" style="font-family:Name;font-size:13pt">${ks.map(k=>esc(L.names[k])).join(' · ')}</div><p class="ar">«${esc(q)}»</p>${d.E[q]?LBL+`<p class="en">${esc(d.E[q])}</p>`:''}<div class="src">al-Sa'di, Tafsir Asma' Allah al-Husna, ${pg(a,b2)}</div></div>`).join('')}
 h+='</div>'});
h+='</body></html>';
fs.writeFileSync('/dev/null',h);
await p.setContent(h,{waitUntil:'networkidle'});await p.waitForTimeout(800);
await p.pdf({path:'names-english.pdf',format:'A4',printBackground:true,displayHeaderFooter:true,headerTemplate:'<span></span>',footerTemplate:'<div style="font-size:7pt;width:100%;text-align:center;color:#888">AI translation · please check with your teacher · <span class="pageNumber"></span></div>',margin:{top:'16mm',bottom:'16mm',left:'15mm',right:'15mm'}});
await b.close();})();
