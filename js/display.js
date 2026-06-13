/* ========================================
   DISPLAY.JS - MÓDULO DE RENDERIZAÇÃO
   ======================================== */

/* Este arquivo é carregado em catalogo.html e trabalha em conjunto com main.js
   para gerenciar a exibição dinâmica e interatividade do catálogo. */

document.addEventListener('DOMContentLoaded', () => {
    inicializarDisplay();
});

function inicializarDisplay() {
    aplicarEfeitosVisuais();
    configurarAnimacoes();
    melhorarAcessibilidade();
}

/* ========================================
   EFEITOS VISUAIS
   ======================================== */

function aplicarEfeitosVisuais() {
    const cards = document.querySelectorAll('.film-card');

    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.05}s`;
        card.style.animation = 'fadeInUp 0.6s ease-in-out forwards';
    });

    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.style.animation = 'fadeInUp 0.6s ease-in-out forwards';
    });
}

function configurarAnimacoes() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @keyframes pulse {
            0%, 100% {
                opacity: 1;
            }
            50% {
                opacity: 0.7;
            }
        }

        .film-card {
            animation-fill-mode: both;
        }

        .stat-card {
            animation-fill-mode: both;
        }

        .btn-trailer:active {
            animation: pulse 0.3s ease-in-out;
        }
    `;
    document.head.appendChild(style);
}

/* ========================================
   ACESSIBILIDADE
   ======================================== */

function melhorarAcessibilidade() {
    const buttons = document.querySelectorAll('button');
    buttons.forEach((btn) => {
        if (!btn.hasAttribute('aria-label')) {
            btn.setAttribute('role', 'button');
        }
    });

    const links = document.querySelectorAll('a');
    links.forEach((link) => {
        if (link.hasAttribute('target') && link.getAttribute('target') === '_blank') {
            const label = link.getAttribute('aria-label');
            if (!label) {
                link.setAttribute('aria-label', `${link.textContent} (abre em nova aba)`);
            }
        }
    });

    const images = document.querySelectorAll('img');
    images.forEach((img) => {
        if (!img.hasAttribute('alt')) {
            img.setAttribute('alt', 'Imagem');
        }
    });
}

/* ========================================
   INTEGRAÇÃO COM OBSERVERS
   ======================================== */

function observarCardsAoScroll() {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        },
        {
            threshold: 0.1
        }
    );

    const cards = document.querySelectorAll('.film-card');
    cards.forEach((card) => {
        observer.observe(card);
    });
}

/* ========================================
   FUNÇÕES UTILITÁRIAS
   ======================================== */

function detectarTema() {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.body.dataset.tema = 'escuro';
    } else {
        document.body.dataset.tema = 'claro';
    }
}

/* ========================================
   EXECUÇÃO
   ======================================== */

window.addEventListener('load', () => {
    observarCardsAoScroll();
    detectarTema();
});
