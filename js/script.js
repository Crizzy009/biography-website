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

// Ticker with Date, Time, and Location
function updateTicker() {
    const tickerElement = document.getElementById('ticker-text');
    
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
        const location = 'Seattle, Washington, USA - Institute for Protein Design';
        
        tickerElement.textContent = `📅 ${date} | 🕐 ${time} | 📍 ${location}`;
    }
    
    updateContent();
    setInterval(updateContent, 1000);
}

// Navigation Links - Change Color on Hover and Click
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Set active link based on current section
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
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
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
