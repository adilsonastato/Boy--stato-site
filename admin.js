const loginBox = document.querySelector('#login');
const panel = document.querySelector('#panel');

const passwordInput = document.querySelector('#password');
const loginMsg = document.querySelector('#login-msg');

const mtitle = document.querySelector('#mtitle');
const murl = document.querySelector('#murl');
const mcover = document.querySelector('#mcover');

const vtitle = document.querySelector('#vtitle');
const vurl = document.querySelector('#vurl');

const items = document.querySelector('#items');

async function check() {
  try {
    const r = await fetch('/api/me');
    const d = await r.json();

    if (d.authenticated) {
      loginBox.hidden = true;
      panel.hidden = false;
      await loadItems();
    }
  } catch (error) {
    console.error('Erro ao verificar login:', error);
  }
}

async function login() {
  const password = passwordInput.value;

  try {
    const r = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ password })
    });

    if (r.ok) {
      loginBox.hidden = true;
      panel.hidden = false;
      await loadItems();
    } else {
      loginMsg.textContent = 'Senha incorreta.';
    }
  } catch (error) {
    loginMsg.textContent = 'Erro ao ligar ao servidor.';
    console.error(error);
  }
}

async function logout() {
  await fetch('/api/logout', {
    method: 'POST'
  });

  location.reload();
}

async function addMusic() {
  if (!mtitle.value.trim() || !murl.value.trim()) {
    alert('Preenche o título e o link da música.');
    return;
  }

  await post('/api/music', {
    title: mtitle.value,
    url: murl.value,
    cover: mcover.value
  });

  mtitle.value = '';
  murl.value = '';
  mcover.value = '';

  await loadItems();
}

async function addVideo() {
  if (!vtitle.value.trim() || !vurl.value.trim()) {
    alert('Preenche o título e o link do YouTube.');
    return;
  }

  await post('/api/videos', {
    title: vtitle.value,
    url: vurl.value
  });

  vtitle.value = '';
  vurl.value = '';

  await loadItems();
}

async function post(url, data) {
  const r = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  if (!r.ok) {
    alert('Não foi possível guardar o conteúdo.');
  }

  return r;
}

async function remove(type, id) {
  if (!confirm('Queres realmente apagar este conteúdo?')) {
    return;
  }

  await fetch(`/api/${type}/${id}`, {
    method: 'DELETE'
  });

  await loadItems();
}

async function loadItems() {
  try {
    const r = await fetch('/api/content');

    if (!r.ok) {
      throw new Error('Erro ao carregar conteúdo');
    }

    const d = await r.json();

    const music = Array.isArray(d.music) ? d.music : [];
    const videos = Array.isArray(d.videos) ? d.videos : [];

    items.innerHTML = [
      ...music.map(x =>
        `<p>🎵 ${esc(x.title)}
        <button onclick="remove('music', ${x.id})">Apagar</button></p>`
      ),
      ...videos.map(x =>
        `<p>🎬 ${esc(x.title)}
        <button onclick="remove('videos', ${x.id})">Apagar</button></p>`
      )
    ].join('') || '<p>Nenhum conteúdo.</p>';

  } catch (error) {
    console.error(error);
    items.innerHTML = '<p>Erro ao carregar o conteúdo.</p>';
  }
}

function esc(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[c]));
}

check();
