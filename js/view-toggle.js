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
        mediaQuery.addEventListener('change', handleViewportChange);
    
        // Initial check
        handleViewportChange(mediaQuery);
    

// Function to reset carousel descriptions
function resetCarouselDescriptions() {
    const descriptions = gsap.utils.toArray(".carousel-txt-list .cms-desc");
    const items = gsap.utils.toArray(".quote-list .quote-item");
    
    // Hide all descriptions
    gsap.set(descriptions, { autoAlpha: 0 });
    
    // Find the active item's index
    const activeIndex = items.findIndex(item => item.classList.contains('active'));
    
    // If there is an active item, show its corresponding description
    console.log("Active index:", activeIndex);
    // Otherwise fallback to the first description
    const indexToShow = activeIndex !== -1 ? activeIndex : 0;
    gsap.set(descriptions[indexToShow], { autoAlpha: 1 });
}

    // Function to show all descriptions
    function showAllDescriptions() {
        const descriptions = document.querySelectorAll(".carousel-txt-list .cms-desc");
        descriptions.forEach(desc => {
            desc.style.visibility = 'visible';
            desc.style.opacity = '1';
        });
    }

    function removeShowFullClass() {
        document.querySelectorAll(".project-desc").forEach((el) => {
            el.classList.remove("show-full");
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
                document.body.classList.add('list-view-active');
                document.body.classList.remove('carousel-view-active');
                
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
                document.body.classList.add('carousel-view-active');
                document.body.classList.remove('list-view-active');
                
                // Remove show-full class from all project-desc elements
                removeShowFullClass();
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
