document.addEventListener('DOMContentLoaded', () => {
    let selectedDates = [];

    // Функция для получения всех дат до сегодняшнего дня
    function getPastDates() {
        const today = new Date();
        const datesToDisable = [];
        
        for (let date = new Date('2000-01-01'); date <= today; date.setDate(date.getDate() + 1)) {
            datesToDisable.push(new Date(date).toLocaleDateString('en-CA')); // Используем локальный формат
        }
        
        return datesToDisable;
    }

    // Инициализация календаря с поддержкой диапазона дат
    const calendar = flatpickr("#calendar-rent", {
        dateFormat: "Y-m-d",
        inline: true,
        mode: "range",  // Включаем выбор диапазона дат
        disable: getPastDates(),    // Заблокированные даты - прошедшие даты
        onChange: function(dates, dateStr, instance) {
            selectedDates = dates.map(date => date.toLocaleDateString('en-CA')); // Используем локальный формат
        }
    });

    // Функция для проверки доступности фудтраков по выбранным датам
    function checkAvailableTrucks(startDate, endDate) {
        
        fetch(`checkAvailableTrucks.php?start_date=${startDate}&end_date=${endDate}`)
            .then(response => response.json())
            .then(data => {
                const trucks = document.querySelectorAll('.cards-item');
                const unavailableTruckIds = data.unavailableTrucks.map(id => id.toString());

                trucks.forEach(truck => {
                    const truckId = truck.dataset.id.toString();
                    if (unavailableTruckIds.includes(truckId)) {
                        truck.style.display = 'none';
                    } else {
                        truck.style.display = 'flex';
                    }
                });
            })
            .catch(error => console.error('Ошибка при проверке доступности фудтраков:', error));
    }

    // Обработчик клика на кнопку "Показать доступные фудтраки"
    document.querySelector('.btn.show-trucks').addEventListener('click', () => {
        if (selectedDates.length < 1 || selectedDates.length > 2) {
            alert("Пожалуйста, выберите диапазон дат.");
            return;
        }

        const startDate = new Date(selectedDates[0]).toISOString().split('T')[0];
        const endDate = selectedDates.length === 2 ? new Date(selectedDates[1]).toISOString().split('T')[0] : startDate;

        checkAvailableTrucks(startDate, endDate);
    });

    // Привязка обработчика событий к кнопкам добавления в корзину
        document.querySelectorAll('.btn.foodtrack').forEach(button => {
            button.addEventListener('click', () => {
                console.log('add')
                const card = button.closest('.cards-item');
                const name = card.dataset.name;
                const price = parseFloat(card.dataset.price);
                const startDate = selectedDates.length > 0 ? new Date(selectedDates[0]).toISOString().split('T')[0] : null;
                const endDate = selectedDates.length === 2 ? new Date(selectedDates[1]).toISOString().split('T')[0] : startDate;
    
                addToCart(name, price, startDate, endDate);
            });
        });

    // Получаем корзину из localStorage или создаем пустую
    function getCart() {
        const cart = localStorage.getItem('cart');
        return cart ? JSON.parse(cart) : [];
    }

    // Сохраняем корзину в localStorage
    function saveCart(cart) {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    // Добавляем товар в корзину
    function addToCart(name, price = null, startDate = null, endDate = null) {
        const cart = getCart();
        const existingItem = cart.find(item => item.name === name && item.startDate === startDate && item.endDate === endDate);
        
        if (existingItem) {
            existingItem.quantity += 1;
            existingItem.daysCount = calculateDaysCount(startDate, endDate);
        } else {
            const daysCount = calculateDaysCount(startDate, endDate);
            cart.push({ name, price, quantity: 1, startDate, endDate, daysCount });
        }
        
        saveCart(cart);
        updateCartDisplay();
    }

    // Функция для вычисления количества дней в диапазоне
    function calculateDaysCount(startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const timeDiff = end - start;
        return Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1; // +1, чтобы включить конечный день
    }

    // Обновляем отображение корзины
    function updateCartDisplay() {
        const cartCountElement = document.getElementById('cart-count');
        
        if (!cartCountElement) return;

        const cart = getCart();
        let totalItems = 0;

        cart.forEach(item => {
            totalItems += item.quantity;
        });

        cartCountElement.textContent = totalItems;  // Обновляем количество товаров в корзине
    }

    const toggleCartButton = document.getElementById('toggle-cart');

    if (toggleCartButton) {
        toggleCartButton.addEventListener('click', () => {
            window.location.href = 'order.html';
        });
    }
    updateCartDisplay();

    
});
