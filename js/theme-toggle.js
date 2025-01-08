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
        themeButton.querySelector('.theme-icon').textContent = '🌙';
      } else {
        root.classList.remove('light-theme');
        themeButton.querySelector('.theme-icon').textContent = '☀️';
      }
      localStorage.setItem('theme', theme);
    }
  });
  