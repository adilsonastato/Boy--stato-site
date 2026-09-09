async function load(){
 const r=await fetch('/api/content'); const d=await r.json();
 const ml=document.querySelector('#music-list'), vl=document.querySelector('#video-list');
 ml.innerHTML=d.music.length?d.music.map(x=>`<article><h3>${esc(x.title)}</h3><a class="btn" href="${esc(x.url)}" target="_blank" rel="noopener">Ouvir</a></article>`).join(''):'<p>Em breve.</p>';
 vl.innerHTML=d.videos.length?d.videos.map(x=>`<article><h3>${esc(x.title)}</h3><a class="btn" href="${esc(x.url)}" target="_blank" rel="noopener">Ver vídeo</a></article>`).join(''):'<p>Em breve.</p>';
}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
load();