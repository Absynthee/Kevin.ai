// view-toggle.js
document.addEventListener('DOMContentLoaded', function() {
    const toggleButton = document.getElementById('view-toggle');
    const mainElement = document.querySelector('main');
    let isMainView = true;

    function toggleView(withTransition = true) {
        if (!mainElement) return; // Guard clause for safety

        if (withTransition) {
            mainElement.classList.add('view-switching');
        }

        const performToggle = () => {
            if (isMainView) {
                // Switch to list view
                mainElement.classList.remove('carousel-view');
                mainElement.classList.add('list-view');
                toggleButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-orbit"><circle cx="12" cy="12" r="3"/><circle cx="19" cy="5" r="2"/><circle cx="5" cy="19" r="2"/><path d="M10.4 21.9a10 10 0 0 0 9.941-15.416"/><path d="M13.5 2.1a10 10 0 0 0-9.841 15.416"/></svg>'; 
                isMainView = false;
            } else {
                // Switch to carousel view
                mainElement.classList.remove('list-view');
                mainElement.classList.add('carousel-view');
                toggleButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-list"><path d="M3 12h.01"/><path d="M3 18h.01"/><path d="M3 6h.01"/><path d="M8 12h13"/><path d="M8 18h13"/><path d="M8 6h13"/></svg>'; 
                isMainView = true;
            }
        };

        if (withTransition) {
            setTimeout(() => {
                performToggle();
                mainElement.classList.remove('view-switching');
            }, 300);
        } else {
            performToggle();
        }
    }

    // Add media query listener
    const mediaQuery = window.matchMedia('(max-width: 550px)');

    // Handler function for viewport changes
    function handleViewportChange(e) {
        console.log('Viewport changed:', e.matches);
        if (e.matches && isMainView) {
            // Switch to list view when viewport is 550px or less
            toggleView(false);
        } else if (!e.matches && !isMainView) {
            // Switch back to carousel view when viewport is more than 550px
            toggleView(false);
        }
    }

    // Add the listener for viewport changes
    mediaQuery.addEventListener('change', handleViewportChange);

    // Initialize state based on current viewport width
    if (mediaQuery.matches) {
        // If viewport is 550px or less, start with list view
        mainElement?.classList.add('list-view');
        isMainView = false;
        toggleButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-orbit"><circle cx="12" cy="12" r="3"/><circle cx="19" cy="5" r="2"/><circle cx="5" cy="19" r="2"/><path d="M10.4 21.9a10 10 0 0 0 9.941-15.416"/><path d="M13.5 2.1a10 10 0 0 0-9.841 15.416"/></svg>';
    } else {
        // If viewport is larger than 550px, start with carousel view
        mainElement?.classList.add('carousel-view');
        isMainView = true;
        toggleButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-list"><path d="M3 12h.01"/><path d="M3 18h.01"/><path d="M3 6h.01"/><path d="M8 12h13"/><path d="M8 18h13"/><path d="M8 6h13"/></svg>';
    }

    // Add click event listener
    toggleButton?.addEventListener('click', function(e) {
        e.preventDefault();
        toggleView(true);
    });
});