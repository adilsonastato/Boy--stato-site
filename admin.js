const loginBox=document.querySelector('#login'), panel=document.querySelector('#panel');
async function check(){const r=await fetch('/api/me');const d=await r.json();if(d.authenticated){loginBox.hidden=true;panel.hidden=false;loadItems();}}
async function login(){const password=document.querySelector('#password').value;const r=await fetch('/api/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({password})});if(r.ok){loginBox.hidden=true;panel.hidden=false;loadItems();}else document.querySelector('#login-msg').textContent='Senha incorreta.';}
async function logout(){await fetch('/api/logout',{method:'POST'});location.reload();}
async function addMusic(){await post('/api/music',{title:mtitle.value,url:murl.value,cover:mcover.value});mtitle.value=murl.value=mcover.value='';loadItems();}
async function addVideo(){await post('/api/videos',{title:vtitle.value,url:vurl.value});vtitle.value=vurl.value='';loadItems();}
async function post(url,data){await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});}
async function remove(type,id){await fetch(`/api/${type}/${id}`,{method:'DELETE'});loadItems();}
async function loadItems(){const r=await fetch('/api/content');const d=await r.json();items.innerHTML=[...d.music.map(x=>`<p>🎵 ${esc(x.title)} <button onclick="remove('music',${x.id})">Apagar</button></p>`),...d.videos.map(x=>`<p>🎬 ${esc(x.title)} <button onclick="remove('videos',${x.id})">Apagar</button></p>`)].join('')||'<p>Nenhum conteúdo.</p>';}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
check();