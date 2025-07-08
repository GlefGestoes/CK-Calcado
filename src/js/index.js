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

// Controle do rodapé
document.addEventListener('DOMContentLoaded', function() {
    const body = document.body;
    const rodape = document.querySelector('.rodape');
    const menuItems = document.querySelectorAll('.menu-item');
    let rodapeTimeout; // Timer para esconder
    const rodapeHideDelay = 800; // Tempo para esconder

    // Mostra/esconde ao rolar
    function handleScroll() {
        const scrollPosition = window.scrollY + window.innerHeight;
        const pageHeight = document.documentElement.scrollHeight;
        
        // Se chegou perto do final, mostra
        if (scrollPosition >= pageHeight - 100) {
            showRodape();
        } else if (!rodape.matches(':hover')) {
            hideRodape(); // Esconde se não estiver com mouse em cima
        }
    }

    // Mostra quando mouse chega perto do rodapé
    function handleMouseMove(e) {
        if (window.innerHeight - e.clientY < 50) {
            showRodape();
        }
    }

    // Mostra o rodapé
    function showRodape() {
        clearTimeout(rodapeTimeout); // Cancela timer de esconder
        body.classList.add('show-rodape');
    }

    // Esconde o rodapé
    function hideRodape() {
        if (body.classList.contains('show-rodape')) {
            body.classList.remove('show-rodape');
        }
    }

    // Esconde depois de um tempo quando mouse sai
    function handleRodapeMouseLeave() {
        const scrollPosition = window.scrollY + window.innerHeight;
        const pageHeight = document.documentElement.scrollHeight;
        
        // Só esconde se não estiver no final
        if (scrollPosition < pageHeight - 100) {
            rodapeTimeout = setTimeout(hideRodape, rodapeHideDelay);
        }
    }

    // Esconde ao clicar fora
    function handleDocumentClick(e) {
        if (!rodape.contains(e.target)) {
            hideRodape();
        }
    }

    // Configura eventos
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    rodape.addEventListener('mouseenter', showRodape);
    rodape.addEventListener('mouseleave', handleRodapeMouseLeave);
    document.addEventListener('click', handleDocumentClick);
    
    // Esconde rodapé ao mudar de categoria
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            setTimeout(hideRodape, 100);
        });
    });

    // Mostra rodapé por 3 segundos ao carregar
    setTimeout(function() {
        showRodape();
        setTimeout(hideRodape, 9000);
    }, 1000);
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
