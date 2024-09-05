document.addEventListener("DOMContentLoaded", function() {
    const mobileButton = document.querySelector('.top-panel-mobile');
    const menuIcon = document.querySelector('.menu-icon');
    const topPanelMenu = document.querySelector('.top-panel-menu');
    const main = document.querySelector('main');

    mobileButton.addEventListener('click', function() {
        // Переключаем активный класс
        mobileButton.classList.toggle('active');
        
        // Меняем изображение иконки
        if (mobileButton.classList.contains('active')) {
            menuIcon.src = './images/main/close.svg';
            topPanelMenu.style.display = 'flex';
            main.style.display = 'none';
        } else {
            menuIcon.src = './images/main/menu.svg';
            topPanelMenu.style.display = 'none';
            main.style.display = 'flex';    
        }
    });
});