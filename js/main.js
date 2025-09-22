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

});