// Navegação entre categorias

// Pega todos os itens do menu e categorias
const menuItems = document.querySelectorAll(".menu-item");
const categorias = document.querySelectorAll(".categoria");

// Adiciona clique em cada item do menu
menuItems.forEach((item, indice) => {
    item.addEventListener("click", (e) => {
        e.stopPropagation(); // Impede que o clique se propague
        
        // Se já está selecionado, não faz nada
        if(item.classList.contains("selecionado")) return;
        
        // Muda para a categoria clicada
        alterarCategoriaSelecionada(indice);
    });
});

// Função para mudar a categoria ativa
function alterarCategoriaSelecionada(indice) {
    // Remove seleção do item de menu atual
    const itemSelecionado = document.querySelector(".menu-item.selecionado");
    itemSelecionado?.classList.remove("selecionado");

    // Adiciona seleção no novo item
    menuItems[indice].classList.add("selecionado");

    // Remove categoria visível atual
    const categoriaSelecionada = document.querySelector(".categoria.selecionado");
    categoriaSelecionada?.classList.remove("selecionado");

    // Mostra a nova categoria
    categorias[indice].classList.add("selecionado");
}

// Carrossel de produtos
document.addEventListener('DOMContentLoaded', function() {
    // Pega todos os carrosséis da página
    const carousels = document.querySelectorAll('.carousel-container');
    
    // Configura cada carrossel
    carousels.forEach(container => {
        // Elementos do carrossel
        const carousel = container.querySelector('.carousel');
        const produtos = container.querySelectorAll('.produto-item');
        const prevBtn = container.querySelector('.prev'); // Botão anterior
        const nextBtn = container.querySelector('.next'); // Botão próximo
        
        let currentIndex = 0; // Índice do produto atual
        const totalItems = produtos.length; // Total de produtos

        // Atualiza a posição do carrossel
        function updateCarousel() {
            const produtoHeight = produtos[0].clientHeight; // Altura de um produto
            const offset = -currentIndex * produtoHeight; // Calcula deslocamento
            carousel.style.transform = `translateY(${offset}px)`; // Move carrossel
        }

        // Vai para o produto anterior
        function goToPrev(e) {
            e.stopPropagation(); // Impede outros eventos
            e.preventDefault();
            if (currentIndex > 0) {
                currentIndex--; // Diminui índice
            } else {
                currentIndex = totalItems - 1; // Vai para o último
            }
            updateCarousel();
        }

        // Vai para o próximo produto
        function goToNext(e) {
            e.stopPropagation();
            e.preventDefault();
            if (currentIndex < totalItems - 1) {
                currentIndex++; // Aumenta índice
            } else {
                currentIndex = 0; // Volta para o primeiro
            }
            updateCarousel();
        }

        // Adiciona eventos nos botões
        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', goToPrev);
            nextBtn.addEventListener('click', goToNext);
        }

        // Controle por toque para celular
        let touchStartY = 0; // Posição inicial do toque
        let touchEndY = 0;   // Posição final do toque

        // Registra onde começou o toque
        carousel.addEventListener('touchstart', function(e) {
            touchStartY = e.changedTouches[0].screenY;
        }, {passive: true});

        // Registra onde terminou o toque
        carousel.addEventListener('touchend', function(e) {
            touchEndY = e.changedTouches[0].screenY;
            handleSwipe(); // Verifica se foi um deslize
        }, {passive: true});

        // Processa o deslize
        function handleSwipe() {
            const minSwipeDistance = 50; // Distância mínima
            
            // Deslizou para cima (próximo produto)
            if (touchStartY - touchEndY > minSwipeDistance) {
                goToNext({ preventDefault: () => {} });
            }
            
            // Deslizou para baixo (produto anterior)
            if (touchEndY - touchStartY > minSwipeDistance) {
                goToPrev({ preventDefault: () => {} });
            }
        }

        // Inicializa e atualiza ao redimensionar
        updateCarousel();
        window.addEventListener('resize', updateCarousel);
    });
});

// Controle do cabeçalho móvel (apenas para mobile)
function setupMobileHeader() {
    if (window.innerWidth > 767) return;

    const body = document.body;
    const rodape = document.querySelector('.rodape');
    
    // Cria cabeçalho móvel como cópia do rodapé
    if (rodape) {
        const cabecalhoMobile = rodape.cloneNode(true);
        cabecalhoMobile.classList.remove('rodape');
        cabecalhoMobile.classList.add('cabecalho-mobile');
        document.body.appendChild(cabecalhoMobile);
        rodape.remove();
    }

    const cabecalhoMobile = document.querySelector('.cabecalho-mobile');
    if (!cabecalhoMobile) return;

    let cabecalhoTimeout;
    const menuItems = document.querySelectorAll('.menu-item');

    function showCabecalho() {
        clearTimeout(cabecalhoTimeout);
        body.classList.add('show-cabecalho-mobile');
    }

    function hideCabecalho() {
        body.classList.remove('show-cabecalho-mobile');
    }

    function handleScroll() {
        const scrollPosition = window.scrollY;
        if (scrollPosition <= 100) {
            showCabecalho();
        } else if (!cabecalhoMobile.matches(':hover')) {
            hideCabecalho();
        }
    }

    function handleMouseMove(e) {
        if (e.clientY < 50) {
            showCabecalho();
        }
    }

    function handleCabecalhoLeave() {
        const scrollPosition = window.scrollY;
        if (scrollPosition > 100) {
            cabecalhoTimeout = setTimeout(hideCabecalho, 800);
        }
    }

    // Configura eventos
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    cabecalhoMobile.addEventListener('mouseenter', showCabecalho);
    cabecalhoMobile.addEventListener('mouseleave', handleCabecalhoLeave);
    
    document.addEventListener('click', function(e) {
        if (!cabecalhoMobile.contains(e.target)) {
            hideCabecalho();
        }
    });

    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            setTimeout(hideCabecalho, 100);
        });
    });

    // Mostra inicialmente por 3 segundos
    setTimeout(function() {
        showCabecalho();
        setTimeout(hideCabecalho, 3000);
    }, 2000);
}

// Controle do rodapé (apenas para desktop)
function setupDesktopFooter() {
    if (window.innerWidth <= 767) return;

    const body = document.body;
    const rodape = document.querySelector('.rodape');
    if (!rodape) return;

    let rodapeTimeout;
    const menuItems = document.querySelectorAll('.menu-item');

    function showRodape() {
        clearTimeout(rodapeTimeout);
        body.classList.add('show-rodape');
    }

    function hideRodape() {
        body.classList.remove('show-rodape');
    }

    function handleScroll() {
        const scrollPosition = window.scrollY + window.innerHeight;
        const pageHeight = document.documentElement.scrollHeight;
        if (scrollPosition >= pageHeight - 100) {
            showRodape();
        } else if (!rodape.matches(':hover')) {
            hideRodape();
        }
    }

    function handleMouseMove(e) {
        if (window.innerHeight - e.clientY < 50) {
            showRodape();
        }
    }

    function handleRodapeLeave() {
        const scrollPosition = window.scrollY + window.innerHeight;
        const pageHeight = document.documentElement.scrollHeight;
        if (scrollPosition < pageHeight - 100) {
            rodapeTimeout = setTimeout(hideRodape, 800);
        }
    }

    // Configura eventos
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    rodape.addEventListener('mouseenter', showRodape);
    rodape.addEventListener('mouseleave', handleRodapeLeave);
    
    document.addEventListener('click', function(e) {
        if (!rodape.contains(e.target)) {
            hideRodape();
        }
    });

    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            setTimeout(hideRodape, 100);
        });
    });

    // Mostra inicialmente por 3 segundos
    setTimeout(function() {
        showRodape();
        setTimeout(hideRodape, 90000);
    }, 1000);
}

// Inicialização separada para não interferir com o áudio
document.addEventListener('DOMContentLoaded', function() {
    // Configura o controle de áudio primeiro (mantenha seu código original)
    const audio = document.getElementById('bgMusic');
    let audioStarted = false;

    function startAudio() {
        if (audioStarted) return;
        audio.play().then(() => {
            audioStarted = true;
        }).catch(error => console.log("Erro ao reproduzir:", error));
    }

    document.addEventListener('click', (event) => {
        const isInteractiveElement = (
            event.target.tagName !== 'SCRIPT' && 
            event.target.tagName !== 'META' &&
            !event.target.classList.contains('evitar-audio')
        );
        if (isInteractiveElement) startAudio();
    }, { once: true });

    document.addEventListener('touchstart', startAudio, { once: true, passive: true });

    // Depois configura os elementos de rodapé/cabeçalho
    setupMobileHeader();
    setupDesktopFooter();
});

// Botões de compra
document.querySelectorAll('.btn-comprar').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.stopPropagation(); // Impede outros cliques
        // Pega nome e preço do produto
        const produto = this.closest('.produto-item').querySelector('h3').textContent;
        const preco = this.closest('.produto-item').querySelector('.preco').textContent;
        // Mostra mensagem
        alert(`Você adicionou ${produto} no valor de ${preco} ao carrinho!`);
    });
});

// Script da música

const audio = document.getElementById('bgMusic');
let audioStarted = false;

function startAudio() {
    if (audioStarted) return;
    
    audio.play()
        .then(() => {
            audioStarted = true;
            console.log("Música iniciada!");
        })
        .catch(error => console.log("Erro ao reproduzir:", error));
}

// Captura cliques em QUALQUER elemento (incluindo botões do menu)
document.addEventListener('click', (event) => {
    // Verifica se o clique foi em um elemento interativo (exceto scripts/meta)
    const isInteractiveElement = (
        event.target.tagName !== 'SCRIPT' && 
        event.target.tagName !== 'META' &&
        !event.target.classList.contains('evitar-audio') // Classe opcional para exceções
    );

    if (isInteractiveElement) {
        startAudio();
    }
}, { once: true }); // Executa apenas uma vez

// Alternativa para mobile (toque na tela)
document.addEventListener('touchstart', startAudio, { once: true, passive: true });

document.querySelectorAll('.menu-categorias button').forEach(button => {
    button.addEventListener('click', () => {
        // Seu código existente...
        startAudio(); // Garante que o áudio toque
    });
});

// Botão moeda - Atualizado com confirmação
document.addEventListener('DOMContentLoaded', function() {
    const botaoSocial = document.getElementById('botaoSocial');
    const icones = document.querySelectorAll('.icone-link');
    let currentIndex = 0;
    let rotationInterval;
    let isHovering = false;

    // Inicia a rotação automática
    function startRotation() {
        rotationInterval = setInterval(() => {
            if (!isHovering) {
                rotateIcons();
            }
        }, 2000); // Muda a cada 2 segundos
    }

    // Rotaciona os ícones
    function rotateIcons() {
        // Esconde o ícone atual
        icones[currentIndex].style.opacity = '0';
        icones[currentIndex].style.transform = 'rotateY(180deg)';
        
        // Avança para o próximo ícone
        currentIndex = (currentIndex + 1) % icones.length;
        
        // Mostra o novo ícone
        icones[currentIndex].style.opacity = '1';
        icones[currentIndex].style.transform = 'rotateY(0deg)';
    }

    // Eventos de hover
    botaoSocial.addEventListener('mouseenter', function() {
        isHovering = true;
        clearInterval(rotationInterval);
    });

    botaoSocial.addEventListener('mouseleave', function() {
        isHovering = false;
        startRotation();
    });

    // Clique nos ícones - Atualizado com confirmação
    icones.forEach(icone => {
        icone.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Pega o link e o nome da rede social
            const link = this.getAttribute('data-link');
            const redeSocial = this.querySelector('img').alt;
            
            // Mostra confirmação
            const confirmar = confirm(`Deseja entrar em contato via ${redeSocial}?`);
            
            if (confirmar) {
                window.open(link, '_blank');
            } else {
                location.reload(); // Atualiza a página se o usuário cancelar
            }
        });
    });

    // Inicia a animação
    startRotation();
});
