document.addEventListener('DOMContentLoaded', function() {
    const themeButton = document.getElementById('theme-toggle');
    const root = document.documentElement;
    
    // Check for saved theme preference or default to dark theme
    const currentTheme = localStorage.getItem('theme') || 'dark';
    setTheme(currentTheme);
  
    themeButton.addEventListener('click', () => {
      const newTheme = root.classList.contains('light-theme') ? 'dark' : 'light';
      setTheme(newTheme);
    });
  
    function setTheme(theme) {
      if (theme === 'light') {
        root.classList.add('light-theme');
        themeButton.querySelector('.theme-icon').innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-moon-star"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9"/><path d="M20 3v4"/><path d="M22 5h-4"/></svg>';
      } else {
        root.classList.remove('light-theme');
        themeButton.querySelector('.theme-icon').innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sun"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>';
      }
      localStorage.setItem('theme', theme);
    }
  });
  