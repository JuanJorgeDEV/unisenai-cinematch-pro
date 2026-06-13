/* ========================================
   CLASSE FILME
   ======================================== */

class Filme {
    constructor(titulo, ano, duracao, diretor, sinopse, imagem, youtubeId, genero) {
        this.id = Date.now();
        this.titulo = titulo;
        this.ano = ano;
        this.duracao = duracao;
        this.diretor = diretor;
        this.sinopse = sinopse;
        this.imagem = imagem;
        this.youtubeId = youtubeId;
        this.genero = genero;
        this.dataCadastro = new Date().toLocaleDateString('pt-BR');
    }
}

/* ========================================
   GERENCIAMENTO DE LOCALSTORAGE
   ======================================== */

const StorageManager = {
    CHAVE: 'cinematchPro_filmes',

    obterFilmes() {
        const dados = localStorage.getItem(this.CHAVE);
        return dados ? JSON.parse(dados) : [];
    },

    salvarFilmes(filmes) {
        localStorage.setItem(this.CHAVE, JSON.stringify(filmes));
    },

    adicionarFilme(filme) {
        const filmes = this.obterFilmes();
        filmes.push(filme);
        this.salvarFilmes(filmes);
    },

    removerFilme(id) {
        const filmes = this.obterFilmes();
        const filmosAtualizados = filmes.filter(filme => filme.id !== id);
        this.salvarFilmes(filmosAtualizados);
    },

    limparTodos() {
        localStorage.removeItem(this.CHAVE);
    }
};

/* ========================================
   MANIPULAÇÃO DO FORMULÁRIO (INDEX.HTML)
   ======================================== */

function inicializarFormulario() {
    const formulario = document.getElementById('filmForm');

    if (formulario) {
        formulario.addEventListener('submit', (evento) => {
            evento.preventDefault();

            const titulo = document.getElementById('titulo').value.trim();
            const ano = parseInt(document.getElementById('ano').value);
            const duracao = parseInt(document.getElementById('duracao').value);
            const diretor = document.getElementById('diretor').value.trim();
            const sinopse = document.getElementById('sinopse').value.trim();
            const imagem = document.getElementById('imagem').value.trim();
            const youtubeId = document.getElementById('youtubeId').value.trim();
            const genero = document.getElementById('genero').value.trim();

            if (validarFormulario(titulo, ano, duracao, imagem, youtubeId)) {
                const novoFilme = new Filme(
                    titulo,
                    ano,
                    duracao,
                    diretor,
                    sinopse,
                    imagem,
                    youtubeId,
                    genero
                );

                StorageManager.adicionarFilme(novoFilme);
                mostrarMensagem('✅ Filme adicionado com sucesso!', 'sucesso');

                formulario.reset();

                setTimeout(() => {
                    window.location.href = 'catalogo.html';
                }, 1500);
            }
        });
    }
}

function validarFormulario(titulo, ano, duracao, imagem, youtubeId) {
    const anoAtual = new Date().getFullYear();

    if (!titulo || titulo.length < 2) {
        mostrarMensagem('❌ Título deve ter pelo menos 2 caracteres.', 'erro');
        return false;
    }

    if (ano < 1895 || ano > anoAtual) {
        mostrarMensagem(`❌ Ano deve estar entre 1895 e ${anoAtual}.`, 'erro');
        return false;
    }

    if (duracao < 1) {
        mostrarMensagem('❌ Duração deve ser maior que 0 minutos.', 'erro');
        return false;
    }

    if (!imagem.startsWith('http')) {
        mostrarMensagem('❌ URL da imagem deve ser válida e começar com http.', 'erro');
        return false;
    }

    if (!youtubeId || youtubeId.length < 5) {
        mostrarMensagem('❌ ID do YouTube deve ser válido.', 'erro');
        return false;
    }

    return true;
}

function mostrarMensagem(mensagem, tipo) {
    const mensagemDiv = document.createElement('div');
    mensagemDiv.className = `mensagem mensagem-${tipo}`;
    mensagemDiv.textContent = mensagem;
    mensagemDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background-color: ${tipo === 'sucesso' ? '#10b981' : '#ef4444'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        font-weight: 600;
        z-index: 3000;
        animation: slideInRight 0.3s ease-in-out;
    `;

    document.body.appendChild(mensagemDiv);

    setTimeout(() => {
        mensagemDiv.style.animation = 'slideOutRight 0.3s ease-in-out';
        setTimeout(() => mensagemDiv.remove(), 300);
    }, 3000);
}

/* ========================================
   MANIPULAÇÃO DO CATÁLOGO (CATALOGO.HTML)
   ======================================== */

function inicializarCatalogo() {
    const gridFilmes = document.getElementById('filmsCatalog');
    const searchInput = document.getElementById('searchInput');
    const btnLimpar = document.getElementById('btnLimpar');
    const btnLimparTodos = document.getElementById('btnLimparTodos');

    if (!gridFilmes) return;

    renderizarFilmes();
    atualizarEstatisticas();

    if (searchInput) {
        searchInput.addEventListener('input', (evento) => {
            const termo = evento.target.value.toLowerCase();
            filtrarFilmes(termo);
        });
    }

    if (btnLimpar) {
        btnLimpar.addEventListener('click', () => {
            searchInput.value = '';
            renderizarFilmes();
        });
    }

    if (btnLimparTodos) {
        btnLimparTodos.addEventListener('click', () => {
            if (confirm('⚠️ Tem certeza? Todos os filmes serão deletados!')) {
                StorageManager.limparTodos();
                renderizarFilmes();
                atualizarEstatisticas();
                mostrarMensagem('✅ Todos os filmes foram removidos.', 'sucesso');
            }
        });
    }
}

function renderizarFilmes(filmes = null) {
    const gridFilmes = document.getElementById('filmsCatalog');
    const filmesParaExibir = filmes || StorageManager.obterFilmes();

    gridFilmes.innerHTML = '';

    if (filmesParaExibir.length === 0) {
        gridFilmes.innerHTML = `
            <p class="empty-message">
                Nenhum filme encontrado. <a href="index.html">Adicione um agora!</a>
            </p>
        `;
        document.getElementById('totalFilmes').textContent = 'Nenhum filme cadastrado';
        return;
    }

    document.getElementById('totalFilmes').textContent = `Total de filmes: ${filmesParaExibir.length}`;

    filmesParaExibir.forEach((filme) => {
        const card = criarCardFilme(filme);
        gridFilmes.appendChild(card);
    });
}

function criarCardFilme(filme) {
    const article = document.createElement('article');
    article.className = 'film-card';
    article.dataset.id = filme.id;

    const imagemHTML = `
        <img
            src="${filme.imagem}"
            alt="Capa do filme ${filme.titulo}"
            class="film-poster"
            onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22280%22 height=%22350%22%3E%3Crect fill=%22%23ddd%22 width=%22280%22 height=%22350%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23999%22 font-size=%2220%22%3EImagem não disponível%3C/text%3E%3C/svg%3E'"
        >
    `;

    const acoes = `
        <div class="film-actions">
            <button class="btn-trailer" data-youtube="${filme.youtubeId}">🎬 Trailer</button>
            <button class="btn-delete" data-id="${filme.id}">🗑️ Deletar</button>
        </div>
    `;

    article.innerHTML = `
        ${imagemHTML}
        <div class="film-info">
            <h2 class="film-title">${escaparHTML(filme.titulo)}</h2>
            <div class="film-meta">
                <span class="film-year">📅 ${filme.ano}</span>
                <span class="film-duration">⏱️ ${filme.duracao} min</span>
            </div>
            <span class="film-genre">${escaparHTML(filme.genero)}</span>
            <p class="film-diretor"><strong>Diretor:</strong> ${escaparHTML(filme.diretor)}</p>
            <p class="film-sinopse">${escaparHTML(filme.sinopse)}</p>
            ${acoes}
        </div>
    `;

    const btnTrailer = article.querySelector('.btn-trailer');
    const btnDelete = article.querySelector('.btn-delete');

    btnTrailer.addEventListener('click', () => {
        abrirTrailer(filme.youtubeId, filme.titulo);
    });

    btnDelete.addEventListener('click', () => {
        if (confirm(`Deseja deletar "${filme.titulo}"?`)) {
            StorageManager.removerFilme(filme.id);
            article.remove();
            atualizarEstatisticas();
            mostrarMensagem('✅ Filme removido com sucesso.', 'sucesso');
        }
    });

    return article;
}

function filtrarFilmes(termo) {
    const filmes = StorageManager.obterFilmes();

    const filmesFiltrados = filmes.filter((filme) => {
        return (
            filme.titulo.toLowerCase().includes(termo) ||
            filme.genero.toLowerCase().includes(termo) ||
            filme.diretor.toLowerCase().includes(termo)
        );
    });

    renderizarFilmes(filmesFiltrados);
}

function atualizarEstatisticas() {
    const filmes = StorageManager.obterFilmes();

    const totalMinutos = filmes.reduce((acc, filme) => acc + filme.duracao, 0);
    const totalHoras = Math.floor(totalMinutos / 60);
    const duracionMedia = filmes.length > 0 ? Math.round(totalMinutos / filmes.length) : 0;

    const statFilmes = document.getElementById('statFilmes');
    const statMinutos = document.getElementById('statMinutos');
    const statHoras = document.getElementById('statHoras');
    const statMedia = document.getElementById('statMedia');

    if (statFilmes) statFilmes.textContent = filmes.length;
    if (statMinutos) statMinutos.textContent = totalMinutos.toLocaleString('pt-BR');
    if (statHoras) statHoras.textContent = `${totalHoras}h ${totalMinutos % 60}m`;
    if (statMedia) statMedia.textContent = `${duracionMedia} min`;
}

function abrirTrailer(youtubeId, titulo) {
    const modal = document.getElementById('trailerModal');
    const iframe = document.getElementById('trailerFrame');

    iframe.src = `https://www.youtube.com/embed/${youtubeId}?autoplay=1`;
    modal.classList.add('active');

    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.addEventListener('click', fecharTrailer);

    modal.addEventListener('click', (evento) => {
        if (evento.target === modal) {
            fecharTrailer();
        }
    });

    document.addEventListener('keydown', (evento) => {
        if (evento.key === 'Escape') {
            fecharTrailer();
        }
    });
}

function fecharTrailer() {
    const modal = document.getElementById('trailerModal');
    const iframe = document.getElementById('trailerFrame');

    modal.classList.remove('active');
    iframe.src = '';
}

function escaparHTML(texto) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return texto.replace(/[&<>"']/g, (char) => map[char]);
}

/* ========================================
   INICIALIZAÇÃO
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
    inicializarFormulario();
    inicializarCatalogo();

    const estiloAnimacoes = document.createElement('style');
    estiloAnimacoes.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(estiloAnimacoes);
});
