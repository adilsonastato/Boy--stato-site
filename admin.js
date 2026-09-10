
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
  const password = passwordInput.value.trim();

  if (!password) {
    loginMsg.textContent = 'Digite a sua senha.';
    return;
  }

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
      loginMsg.textContent = '';
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
  try {
    await fetch('/api/logout', {
      method: 'POST'
    });

    location.reload();
  } catch (error) {
    console.error('Erro ao sair:', error);
  }
}

async function addMusic() {
  const title = mtitle.value.trim();
  const url = murl.value.trim();
  const cover = mcover.value.trim();

  if (!title || !url) {
    alert('Preenche o título e o link da música.');
    return;
  }

  try {
    const r = await post('/api/music', {
      title,
      url,
      cover
    });

    if (!r.ok) return;

    mtitle.value = '';
    murl.value = '';
    mcover.value = '';

    alert('🎵 Música publicada com sucesso!');
    await loadItems();

  } catch (error) {
    console.error(error);
    alert('Erro ao publicar a música.');
  }
}

async function addVideo() {
  const title = vtitle.value.trim();
  const url = vurl.value.trim();

  if (!title || !url) {
    alert('Preenche o título e o link do YouTube.');
    return;
  }

  try {
    const r = await post('/api/videos', {
      title,
      url
    });

    if (!r.ok) return;

    vtitle.value = '';
    vurl.value = '';

    alert('🎬 Vídeo publicado com sucesso!');
    await loadItems();

  } catch (error) {
    console.error(error);
    alert('Erro ao publicar o vídeo.');
  }
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
  const confirmacao = confirm(
    '⚠️ Queres realmente apagar este conteúdo?'
  );

  if (!confirmacao) {
    return;
  }

  try {
    const r = await fetch(`/api/${type}/${id}`, {
      method: 'DELETE'
    });

    if (!r.ok) {
      alert('Não foi possível apagar.');
      return;
    }

    await loadItems();

  } catch (error) {
    console.error(error);
    alert('Erro ao apagar o conteúdo.');
  }
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

    const musicHTML = music.map(x => `
      <div class="content-item">
        <div>
          <strong>🎵 ${esc(x.title)}</strong>
          <small>Música publicada</small>
        </div>

        <button
          type="button"
          onclick="remove('music', ${x.id})">
          Apagar
        </button>
      </div>
    `).join('');

    const videosHTML = videos.map(x => `
      <div class="content-item">
        <div>
          <strong>🎬 ${esc(x.title)}</strong>
          <small>Vídeo publicado</small>
        </div>

        <button
          type="button"
          onclick="remove('videos', ${x.id})">
          Apagar
        </button>
      </div>
    `).join('');

    items.innerHTML =
      musicHTML +
      videosHTML ||
      '<p>Nenhum conteúdo publicado.</p>';

  } catch (error) {
    console.error(error);
    items.innerHTML =
      '<p>Erro ao carregar o conteúdo.</p>';
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
