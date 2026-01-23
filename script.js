/* ==========================================
   JOYERIA GILBERT - JAVASCRIPT
   Funcionalidad e interactividad de la página
   ========================================== */

// ==========================================
// SMOOTH SCROLLING
// Navegación suave entre secciones
// ==========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ==========================================
// INTERSECTION OBSERVER
// Animaciones al hacer scroll
// ==========================================
const observerOptions = {
    threshold: 0.1, // Activar cuando el 10% del elemento sea visible
    rootMargin: '0px 0px -100px 0px' // Margen inferior para activación temprana
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Elemento visible, activar animación
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Aplicar observer a todos los elementos animables
const animatedElements = document.querySelectorAll(
    '.product-card, .feature-card, .service-item, .testimonial, .gallery-item'
);

animatedElements.forEach(el => {
    // Estado inicial: invisible y desplazado
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.8s ease';
    
    // Observar el elemento
    observer.observe(el);
});

// ==========================================
// HEADER SHADOW ON SCROLL
// Efecto de sombra al hacer scroll
// ==========================================
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    
    if (window.scrollY > 50) {
        // Scroll detectado: sombra más pronunciada
        header.style.boxShadow = '0 5px 30px rgba(0, 0, 0, 0.12)';
    } else {
        // Top de página: sombra suave
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.08)';
    }
});

// ==========================================
// OPCIONAL: LOG PARA DEBUGGING
// Descomentar si necesitas debug
// ==========================================
// console.log('Joyería Gilbert - JavaScript cargado correctamente ✓');
