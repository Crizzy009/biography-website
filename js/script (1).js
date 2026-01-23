// Visitor Counter
function initVisitorCounter() {
    let visitCount = localStorage.getItem('visitCount');
    if (!visitCount) {
        visitCount = 1;
    } else {
        visitCount = parseInt(visitCount) + 1;
    }
    localStorage.setItem('visitCount', visitCount);
    document.getElementById('visitor-number').textContent = visitCount;
}

// Geolocation function
async function getLocationInfo() {
    return new Promise((resolve) => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    try {
                        // Use reverse geocoding API to get location name
                        const response = await fetch(
                            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`
                        );
                        const data = await response.json();
                        
                        const city = data.address.city || data.address.town || data.address.village || 'Unknown';
                        const country = data.address.country || 'Unknown';
                        
                        resolve(`${city}, ${country}`);
                    } catch (error) {
                        resolve('Location unavailable');
                    }
                },
                () => {
                    // Default location if geolocation is denied
                    resolve('Seattle, Washington, USA - Institute for Protein Design');
                }
            );
        } else {
            resolve('Seattle, Washington, USA - Institute for Protein Design');
        }
    });
}

// Ticker with Date, Time, and Geolocation
async function updateTicker() {
    const tickerElement = document.getElementById('ticker-text');
    const location = await getLocationInfo();
    
    function updateContent() {
        const now = new Date();
        const date = now.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        const time = now.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });
        
        tickerElement.textContent = `📅 ${date} | 🕐 ${time} | 📍 ${location}`;
    }
    
    updateContent();
    setInterval(updateContent, 1000);
}

// Navigation Links with fade effects
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        // Click event - change color and add active class
        link.addEventListener('click', function(e) {
            // Remove active from all links
            navLinks.forEach(l => {
                l.classList.remove('active');
                l.style.animation = 'fadeOut 0.3s ease';
            });
            
            // Add active to clicked link
            this.classList.add('active');
            this.style.animation = 'fadeIn 0.3s ease';
        });
        
        // Hover effects with fade
        link.addEventListener('mouseenter', function() {
            if (!this.classList.contains('active')) {
                this.style.animation = 'fadeIn 0.3s ease';
            }
        });
        
        link.addEventListener('mouseleave', function() {
            if (!this.classList.contains('active')) {
                this.style.animation = 'fadeOut 0.3s ease';
            }
        });
    });
    
    // Set active link based on current section while scrolling
    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('section');
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollY >= sectionTop - 300) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            link.style.animation = 'fadeOut 0.3s ease';
            
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
                link.style.animation = 'fadeIn 0.3s ease';
            }
        });
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initVisitorCounter();
    updateTicker();
    initNavigation();
});