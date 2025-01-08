document.addEventListener('DOMContentLoaded', function() {
    const toggleButton = document.getElementById('view-toggle');
    const mainStyle = document.querySelector('link[href="styles/styles.css"]');
    const altStyle = document.querySelector('link[href="styles/alt-list.css"]');
    const mainScript = document.querySelector('script[src="js/scripts.js"]');
    
    let isMainView = true;

        // Add media query listener
        const mediaQuery = window.matchMedia('(max-width: 600px)');

        // Handler function for viewport changes
        function handleViewportChange(e) {
            if (e.matches) {
                // Viewport is 550px or less
                if (isMainView) {
                    toggleView(false); // Switch to list view without transition
                }
            } else {
                // Viewport is more than 550px
                if (!isMainView) {
                    toggleView(false); // Switch back to carousel without transition
                }
            }
        }
    
        // Add the listener for viewport changes
        mediaQuery.addListener(handleViewportChange);
    
        // Initial check
        handleViewportChange(mediaQuery);
    

    // Function to reset carousel descriptions
    function resetCarouselDescriptions() {
        const descriptions = gsap.utils.toArray(".carousel-txt-list .cms-desc");
        // Hide all descriptions
        gsap.set(descriptions, { autoAlpha: 0 });
        // Show only the first description
        gsap.set(descriptions[0], { autoAlpha: 1 });
    }

    // Function to show all descriptions
    function showAllDescriptions() {
        const descriptions = document.querySelectorAll(".carousel-txt-list .cms-desc");
        descriptions.forEach(desc => {
            desc.style.visibility = 'visible';
            desc.style.opacity = '1';
        });
    }

function toggleView(withTransition = true) {
    if (withTransition) {
        document.body.classList.add('view-switching');
    }

    const performToggle = () => {
        if (isMainView) {
            // Switch to alternative view (list)
            mainStyle.disabled = true;
            altStyle.disabled = false;
            
            if (mainScript) {
                mainScript.remove();
            }
            
            // Show all descriptions in list view
            showAllDescriptions();
            
            isMainView = false;
            toggleButton.textContent = '📜';
            
        } else {
            // First hide all descriptions immediately before switching views
            const descriptions = document.querySelectorAll(".carousel-txt-list .cms-desc");
            descriptions.forEach(desc => {
                desc.style.visibility = 'hidden';
                desc.style.opacity = '0';
            });

            // Switch back to main view (carousel)
            mainStyle.disabled = false;
            altStyle.disabled = true;
            
            // Re-add the main script
            const newScript = document.createElement('script');
            newScript.src = 'js/scripts.js';
            newScript.defer = true;
            document.body.appendChild(newScript);
            
            // Wait for script to load then reset descriptions
            newScript.onload = function() {
                setTimeout(resetCarouselDescriptions, 100);
            };
            
            isMainView = true;
            toggleButton.textContent = '📜';
        }
    };

    if (withTransition) {
        setTimeout(() => {
            performToggle();
            document.body.classList.remove('view-switching');
        }, 300);
    } else {
        performToggle();
    }
}

    // Add click event listener
    toggleButton.addEventListener('click', function(e) {
        e.preventDefault();
        // Only allow manual toggle if viewport is more than 550px
        if (!mediaQuery.matches) {
            toggleView(true);
        }
    });

    // Initialize the default state
    altStyle.disabled = true;
    resetCarouselDescriptions();
});
