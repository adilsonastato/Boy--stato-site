async function load() {
  try {
    const r = await fetch('/api/content');

    if (!r.ok) {
      throw new Error('Erro ao carregar conteúdo');
    }

    const d = await r.json();

    const ml = document.querySelector('#music-list');
    const vl = document.querySelector('#video-list');

    const music = Array.isArray(d.music) ? d.music : [];
    const videos = Array.isArray(d.videos) ? d.videos : [];


    // =========================
    // MÚSICAS
    // =========================

    if (music.length) {

      ml.innerHTML = music.map(x => {

        const cover = x.cover
          ? `
            <img
              src="${esc(x.cover)}"
              alt="Capa de ${esc(x.title)}"
              loading="lazy"
              onerror="this.style.display='none'"
            >
          `
          : `
            <div class="music-cover">
              🎵
            </div>
          `;

        return `
          <article class="music-card">

            ${cover}

            <div class="music-info">

              <p class="music-label">
                BOY ÁSTATO
              </p>

              <h3>
                ${esc(x.title)}
              </h3>

              <audio
                controls
                preload="none"
                src="${esc(x.url)}">
              </audio>

              <a
                class="btn"
                href="${esc(x.url)}"
                target="_blank"
                rel="noopener noreferrer">
                Abrir música
              </a>

            </div>

          </article>
        `;

      }).join('');

    } else {

      ml.innerHTML = `
        <div class="empty-state">
          <p>🎵 Novas músicas em breve.</p>
        </div>
      `;

    }


    // =========================
    // VÍDEOS
    // =========================

    if (videos.length) {

      vl.innerHTML = videos.map(x => {

        return `
          <article class="video-card">

            <div class="video-icon">
              ▶
            </div>

            <div class="video-info">

              <p class="music-label">
                BOY ÁSTATO
              </p>

              <h3>
                ${esc(x.title)}
              </h3>

              <a
                class="btn"
                href="${esc(x.url)}"
                target="_blank"
                rel="noopener noreferrer">
                ▶ Ver vídeo
              </a>

            </div>

          </article>
        `;

      }).join('');

    } else {

      vl.innerHTML = `
        <div class="empty-state">
          <p>🎬 Novos vídeos em breve.</p>
        </div>
      `;

    }

  } catch (error) {

    console.error('Erro:', error);

    const ml = document.querySelector('#music-list');
    const vl = document.querySelector('#video-list');

    if (ml) {
      ml.innerHTML = '<p>Não foi possível carregar as músicas.</p>';
    }

    if (vl) {
      vl.innerHTML = '<p>Não foi possível carregar os vídeos.</p>';
    }
  }
}


// =========================
// PROTEÇÃO DE TEXTO
// =========================

function esc(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[c]));
}


load();
