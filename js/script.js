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

async function getLocationInfo() {
    return new Promise(async (resolve) => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    try {
                        const response = await fetch(
                            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`,
                            {
                                headers: {
                                    'User-Agent': 'ProteinDesignWebsite/1.0'
                                }
                            }
                        );
                        
                        if (!response.ok) {
                            throw new Error('Geocoding failed');
                        }
                        
                        const data = await response.json();
                        
                        const city = data.address.city || 
                                   data.address.town || 
                                   data.address.village || 
                                   data.address.county ||
                                   'Unknown City';
                        const country = data.address.country || 'Unknown Country';
                        
                        resolve(`${city}, ${country}`);
                    } catch (error) {
                        console.warn('Reverse geocoding failed:', error);
                        tryIPLocation(resolve);
                    }
                },
                (error) => {
                    console.warn('Geolocation denied or failed:', error.message);
                    tryIPLocation(resolve);
                },
                {
                    enableHighAccuracy: false,
                    timeout: 5000,
                    maximumAge: 300000
                }
            );
        } else {
            console.warn('Geolocation not supported');
            tryIPLocation(resolve);
        }
    });
}

async function tryIPLocation(resolve) {
    try {
        const response = await fetch('https://ipapi.co/json/');
        
        if (!response.ok) {
            throw new Error('IP geolocation failed');
        }
        
        const data = await response.json();
        
        if (data.city && data.country_name) {
            resolve(`${data.city}, ${data.country_name}`);
        } else {
            resolve('Seattle, Washington, USA - Institute for Protein Design');
        }
    } catch (error) {
        console.warn('IP geolocation failed:', error);
        resolve('Seattle, Washington, USA - Institute for Protein Design');
    }
}

async function updateTicker() {
    const tickerElement = document.getElementById('ticker-text');
    
    tickerElement.textContent = '🔄 Loading location...';
    
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

function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            navLinks.forEach(l => {
                l.classList.remove('active');
                l.style.animation = 'fadeOut 0.3s ease';
            });
            
            this.classList.add('active');
            this.style.animation = 'fadeIn 0.3s ease';
        });
        
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

document.addEventListener('DOMContentLoaded', function() {
    initVisitorCounter();
    updateTicker();
    initNavigation();
});