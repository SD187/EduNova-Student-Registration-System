// Index page JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('EduNova Index page initializing...');

    // Get the register button
    const registerBtn = document.querySelector('.register-btn');

    // Load the current registration link
    loadRegistrationLink();

    async function loadRegistrationLink() {
        try {
            const response = await fetch('http://127.0.0.1:5000/api/public/registration-link');
            
            if (response.ok) {
                const data = await response.json();
                
                if (data.available && data.link && registerBtn) {
                    // Update the register button with the current link
                    registerBtn.href = data.link;
                    registerBtn.textContent = 'Register';
                    console.log('Registration link loaded:', data.link);
                } else {
                    // Use fallback link or show unavailable message
                    if (registerBtn) {
                        registerBtn.href = '#';
                        registerBtn.textContent = 'Registration Unavailable';
                        registerBtn.style.opacity = '0.6';
                        registerBtn.style.cursor = 'not-allowed';
                        registerBtn.onclick = function(e) {
                            e.preventDefault();
                            alert('Registration form is currently unavailable. Please check back later.');
                        };
                    }
                }
            } else {
                // Use fallback link
                console.log('Using fallback registration link');
                if (registerBtn) {
                    registerBtn.href = 'https://docs.google.com/forms/d/e/1FAIpQLSdA9WPnUbHGIwBcamlSjF8LSrgtKkm901eAmQFrIRgso2kkFg/viewform?usp=sharing&ouid=111762946238639356705';
                }
            }

        } catch (error) {
            console.error('Error loading registration link:', error);
            // Use fallback link on error
            if (registerBtn) {
                registerBtn.href = 'https://docs.google.com/forms/d/e/1FAIpQLSdA9WPnUbHGIwBcamlSjF8LSrgtKkm901eAmQFrIRgso2kkFg/viewform?usp=sharing&ouid=111762946238639356705';
            }
        }
    }

    // Add smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Only handle internal links
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // Add animation to the hero section
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        heroSection.style.opacity = '0';
        heroSection.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            heroSection.style.transition = 'all 0.8s ease-out';
            heroSection.style.opacity = '1';
            heroSection.style.transform = 'translateY(0)';
        }, 100);
    }

    // Add hover effects to the register button
    if (registerBtn) {
        registerBtn.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        registerBtn.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    }

    console.log('✅ EduNova Index page initialized successfully!');
});
