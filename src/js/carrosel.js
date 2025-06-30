// Carrossel de Produtos Avançado

// Espera o carregamento da página para executar
document.addEventListener('DOMContentLoaded', function() {
    // Pega todos os carrosséis na página
    const carousels = document.querySelectorAll('.carousel-container');
    
    // Para cada carrossel encontrado
    carousels.forEach(container => {
        // Pega os elementos do carrossel
        const carousel = container.querySelector('.carousel');
        const produtos = container.querySelectorAll('.produto-item');
        const prevBtn = container.querySelector('.prev'); // Botão anterior
        const nextBtn = container.querySelector('.next'); // Botão próximo
        
        // Pega ou cria os indicadores (bolinhas de navegação)
        const indicatorsContainer = container.querySelector('.carousel-indicators') || 
                                 createIndicators(container, produtos.length);
        const indicators = indicatorsContainer.querySelectorAll('.carousel-indicator');
        
        // Variáveis de controle
        let currentIndex = 0; // Índice atual
        let isAnimating = false; // Se está animando
        const animationDuration = 500; // Duração da animação em milissegundos
        const totalItems = produtos.length; // Total de produtos

        // Atualiza os indicadores no início
        updateIndicators();
        
        // Configura o carrossel
        function setupCarousel() {
            // Organiza a ordem dos produtos
            produtos.forEach((produto, index) => {
                produto.style.order = index;
            });
            updateCarousel();
        }

        // Move o carrossel para a posição atual
        function updateCarousel() {
            if (isAnimating) return; // Não faz nada se já estiver animando
            
            isAnimating = true;
            const produtoHeight = produtos[0].offsetHeight; // Altura de um produto
            const offset = -currentIndex * produtoHeight; // Calcula o deslocamento
            
            // Aplica a animação
            carousel.style.transition = `transform ${animationDuration}ms cubic-bezier(0.25, 0.8, 0.25, 1)`;
            carousel.style.transform = `translateY(${offset}px)`;
            
            // Quando terminar a animação
            setTimeout(() => {
                isAnimating = false;
                updateIndicators(); // Atualiza as bolinhas
            }, animationDuration);
        }

        // Atualiza qual bolinha está ativa
        function updateIndicators() {
            indicators.forEach((indicator, index) => {
                if (index === currentIndex) {
                    indicator.classList.add('active'); // Destaca a bolinha atual
                } else {
                    indicator.classList.remove('active');
                }
            });
        }

        // Cria as bolinhas de navegação se não existirem
        function createIndicators(container, count) {
            const indicatorsDiv = document.createElement('div');
            indicatorsDiv.className = 'carousel-indicators';
            
            // Cria uma bolinha para cada produto
            for (let i = 0; i < count; i++) {
                const indicator = document.createElement('div');
                indicator.className = 'carousel-indicator';
                indicator.dataset.index = i;
                // Faz a bolinha clicável
                indicator.addEventListener('click', () => goToIndex(i));
                indicatorsDiv.appendChild(indicator);
            }
            
            container.appendChild(indicatorsDiv);
            return indicatorsDiv;
        }

        // Vai para um produto específico
        function goToIndex(index, e) {
            if (e) {
                e.stopPropagation(); // Evita outros eventos
                e.preventDefault();
            }
            
            // Ajusta os limites (volta pro final se passar do início e vice-versa)
            if (index < 0) index = totalItems - 1;
            if (index >= totalItems) index = 0;
            
            currentIndex = index;
            updateCarousel(); // Atualiza a posição
        }

        // Vai para o produto anterior
        function goToPrev(e) {
            if (e) {
                e.stopPropagation();
                e.preventDefault();
            }
            goToIndex(currentIndex - 1);
        }

        // Vai para o próximo produto
        function goToNext(e) {
            if (e) {
                e.stopPropagation();
                e.preventDefault();
            }
            goToIndex(currentIndex + 1);
        }

        // Configura os botões de navegação
        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', goToPrev);
            nextBtn.addEventListener('click', goToNext);
        }

        // Permite navegar com teclado (setas)
        document.addEventListener('keydown', (e) => {
            // Só funciona se o carrossel estiver visível
            if (document.querySelector('.categoria.selecionado') === container.closest('.categoria')) {
                if (e.key === 'ArrowUp') goToPrev(e);
                if (e.key === 'ArrowDown') goToNext(e);
            }
        });

        // Configura o toque para mobile (deslizar)
        let touchStartY = 0;
        let touchEndY = 0;

        // Registra onde o toque começou
        carousel.addEventListener('touchstart', function(e) {
            touchStartY = e.changedTouches[0].clientY;
        }, {passive: true});

        // Registra onde o toque terminou
        carousel.addEventListener('touchend', function(e) {
            touchEndY = e.changedTouches[0].clientY;
            handleSwipe();
        }, {passive: true});

        // Decide se foi um deslize válido e em qual direção
        function handleSwipe() {
            const minSwipeDistance = 50; // Distância mínima para considerar
            const swipeDistance = touchStartY - touchEndY;
            
            if (Math.abs(swipeDistance) < minSwipeDistance) return;
            
            // Deslizou para cima (próximo)
            if (swipeDistance > minSwipeDistance) {
                goToNext();
            } 
            // Deslizou para baixo (anterior)
            else if (swipeDistance < -minSwipeDistance) {
                goToPrev();
            }
        }

        // Rotação automática (passa os produtos sozinho)
        let autoRotateInterval;
        function startAutoRotate() {
            if (totalItems <= 1) return; // Não precisa se tiver só 1 item
            autoRotateInterval = setInterval(goToNext, 5000); // Passa a cada 5 segundos
        }
        
        // Para a rotação automática
        function stopAutoRotate() {
            clearInterval(autoRotateInterval);
        }
        
        // Pausa quando o mouse está em cima
        container.addEventListener('mouseenter', stopAutoRotate);
        // Continua quando o mouse sai
        container.addEventListener('mouseleave', startAutoRotate);
        
        // Inicia o carrossel
        setupCarousel();
        startAutoRotate();
        
        // Ajusta quando a tela muda de tamanho
        window.addEventListener('resize', () => {
            updateCarousel();
        });
    });

    // Configura os botões de compra
    document.querySelectorAll('.btn-comprar').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            // Pega as informações do produto
            const produto = this.closest('.produto-item');
            const nome = produto.querySelector('h3').textContent;
            const preco = produto.querySelector('.preco').textContent;
            
            // Feedback visual ao clicar
            this.textContent = 'Adicionado!';
            this.style.backgroundColor = '#4CAF50'; // Verde
            
            // Volta ao normal após 1 segundo e mostra mensagem
            setTimeout(() => {
                this.textContent = 'Comprar';
                this.style.backgroundColor = '';
                alert(`${nome} - ${preco}\n\nAdicionado ao carrinho!`);
            }, 1000);
        });
    });
});