
// Main JavaScript for RocVille Media House
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu ul');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }

    // Initialize AOS animations if library is loaded
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            offset: 100
        });
    }

    // Text slider animation
    const textSlider = document.querySelector('.text-slider');
    if (textSlider) {
        const items = textSlider.querySelectorAll('.slider-item');
        let currentIndex = 0;
        
        function showNext() {
            items[currentIndex].style.opacity = '0';
            currentIndex = (currentIndex + 1) % items.length;
            items[currentIndex].style.opacity = '1';
        }
        
        // Hide all items except first
        items.forEach((item, index) => {
            item.style.opacity = index === 0 ? '1' : '0';
            item.style.transition = 'opacity 0.5s ease';
        });
        
        // Start slider
        setInterval(showNext, 3000);
    }

    // Division hover effects
    const divisionItems = document.querySelectorAll('.division-item');
    divisionItems.forEach(item => {
        const color = item.getAttribute('data-color');
        if (color) {
            item.addEventListener('mouseenter', function() {
                this.style.borderColor = color;
                this.style.boxShadow = `0 10px 30px ${color}20`;
            });
            
            item.addEventListener('mouseleave', function() {
                this.style.borderColor = '';
                this.style.boxShadow = '';
            });
        }
    });
});
