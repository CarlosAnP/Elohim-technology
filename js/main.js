// Espera a que todo el contenido del DOM esté cargado antes de ejecutar el script.
document.addEventListener('DOMContentLoaded', function() {

    // --- LÓGICA PARA EL MENÚ HAMBURGUESA ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function () {
            // Alterna la clase 'active' para mostrar/ocultar el menú
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }


    // --- LÓGICA PARA EL CARRUSEL HERO ---
    const slides = document.querySelectorAll('.carousel-slide');
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    const dotsContainer = document.getElementById('carouselDots');

    // Salir si no hay slides en la página
    if (slides.length === 0) {
        return;
    }

    let currentSlide = 0;
    let autoSlideInterval;

    // Crear los puntos de navegación dinámicamente
    slides.forEach((_, i) => {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        dot.addEventListener('click', () => {
            moveToSlide(i);
        });
        dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.dot');

    // Función principal para mostrar un slide específico
    function moveToSlide(slideIndex) {
        // Ocultar el slide actual
        slides[currentSlide].classList.remove('active-slide');
        dots[currentSlide].classList.remove('active');

        // Actualizar el índice del slide
        currentSlide = slideIndex;

        // Manejar los límites (loop)
        if (currentSlide >= slides.length) {
            currentSlide = 0;
        }
        if (currentSlide < 0) {
            currentSlide = slides.length - 1;
        }

        // Mostrar el nuevo slide
        slides[currentSlide].classList.add('active-slide');
        dots[currentSlide].classList.add('active');

        // Reiniciar el temporizador de auto-avance
        resetAutoSlide();
    }

    // Funciones para los botones de siguiente/anterior
    function changeSlide(n) {
        moveToSlide(currentSlide + n);
    }

    // Función para reiniciar el intervalo de auto-avance
    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        autoSlideInterval = setInterval(() => {
            changeSlide(1); // Avanza al siguiente slide
        }, 5000); // Cambia de imagen cada 5 segundos
    }

    // Asignar eventos a los botones
    if (nextBtn && prevBtn) {
        nextBtn.addEventListener('click', () => changeSlide(1));
        prevBtn.addEventListener('click', () => changeSlide(-1));
    }

    // Iniciar el carrusel
    moveToSlide(0);

    const animatedItems = document.querySelectorAll('.animated-item');

    // Callback para el Intersection Observer
    function animateOnScroll(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Si el elemento entra en el viewport, le añadimos la clase
                entry.target.classList.add('is-visible');
    
            } else {
           
                entry.target.classList.remove('is-visible');
            }
        });
    }

    const observerOptions = {
        root: null, // El viewport es el elemento raíz
        rootMargin: '0px',
        threshold: 0 // El 0% del elemento debe ser visible para disparar la animación
    };

    // Crear el Intersection Observer
    const observer = new IntersectionObserver(animateOnScroll, observerOptions);

    // Observar cada elemento animado
    animatedItems.forEach(item => {
        // Aseguramos que todos los elementos estén ocultos al inicio.
        // Si no lo están, la primera animación no se verá bien.
        item.classList.remove('is-visible'); 
        observer.observe(item);
    });

  const galleryTrack = document.querySelector('.gallery-track');
    const galleryCarousel = document.querySelector('.gallery-carousel');

    if (galleryTrack && galleryCarousel) {
        // Clonar los ítems para un scroll infinito suave si es necesario (ya lo hicimos en HTML)
        // const items = Array.from(galleryTrack.children);
        // items.forEach(item => {
        //     galleryTrack.appendChild(item.cloneNode(true));
        // });

        let shuffleInterval;
        let shuffleActive = false; // Bandera para controlar si el shuffle está activo

        // Función para reordenar los ítems
        function shuffleGallery() {
            if (shuffleActive) return; // Si ya está activo, no hacer nada

            shuffleActive = true;
            galleryTrack.classList.add('shuffling'); // Añadir clase para pausar y efecto visual

            const items = Array.from(galleryTrack.children);
            // Tomamos una porción del array para reordenar y evitar duplicados visibles al inicio
            const firstHalf = items.slice(0, items.length / 2); // Solo reordenamos la primera mitad
            
            // Algoritmo de Fisher-Yates para reordenar
            for (let i = firstHalf.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [firstHalf[i], firstHalf[j]] = [firstHalf[j], firstHalf[i]]; // Intercambio
            }
            
            // Reconstruir el track con la mitad reordenada y la mitad duplicada
            galleryTrack.innerHTML = ''; // Limpiar el track
            firstHalf.forEach(item => galleryTrack.appendChild(item));
            firstHalf.forEach(item => galleryTrack.appendChild(item.cloneNode(true))); // Duplicar para continuidad

            // Tras un breve retraso para que la transición del CSS se vea
            setTimeout(() => {
                galleryTrack.classList.remove('shuffling');
                shuffleActive = false;
            }, 1000); // Duración de la animación + un poco más
        }

        // --- Lógica para el "rearme" al entrar en la vista ---
        const galleryObserverOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1 // Cuando el 10% de la galería es visible
        };

        const galleryObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Si la galería entra en la vista
                    if (!shuffleInterval) { // Solo si no está ya activo
                        shuffleInterval = setInterval(shuffleGallery, 8000); // Rearmar cada 8 segundos
                    }
                } else {
                    // Si la galería sale de la vista
                    if (shuffleInterval) {
                        clearInterval(shuffleInterval);
                        shuffleInterval = null;
                        galleryTrack.classList.remove('shuffling'); // Quitar efecto si se sale
                        shuffleActive = false;
                    }
                }
            });
        }, galleryObserverOptions);

        galleryObserver.observe(galleryCarousel); // Observar el contenedor de la galería

        // Opcional: Detener la animación de auto-scroll en hover
        galleryCarousel.addEventListener('mouseenter', () => {
            galleryTrack.style.animationPlayState = 'paused';
        });
        galleryCarousel.addEventListener('mouseleave', () => {
            galleryTrack.style.animationPlayState = 'running';
        });
    }

});