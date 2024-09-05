document.addEventListener('DOMContentLoaded', () => {
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
    function addToCart(name, price = null) {
        const cart = getCart();
        const existingItem = cart.find(item => item.name === name);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ name, price, quantity: 1 });
        }
        saveCart(cart);
        updateCartDisplay();
    }

    // Обновляем отображение корзины
    function updateCartDisplay() {
        const cartItemsContainer = document.getElementById('cart-items');
        const cartCountElement = document.getElementById('cart-count');
        
        if (!cartItemsContainer || !cartCountElement) return;

        const cart = getCart();
        cartItemsContainer.innerHTML = '';
        let totalItems = 0;
        let totalPrice = 0;
        
        cart.forEach(item => {
            const itemElement = document.createElement('li');
            itemElement.textContent = item.price ? 
                `${item.name} - ${item.quantity} x ${item.price}₽` : 
                `${item.name} - ${item.quantity} шт.`;
            cartItemsContainer.appendChild(itemElement);
            if (item.price) totalPrice += item.price * item.quantity;
            totalItems += item.quantity;
        });

        document.getElementById('cart-total').textContent = totalPrice;
        cartCountElement.textContent = totalItems;
    }

    // Обработчик для товаров с ценой
    document.querySelectorAll('.btn.goods-card').forEach(button => {
        button.addEventListener('click', (event) => {
            const item = event.target.closest('.cards-item');
            const name = item.dataset.name;
            const price = parseFloat(item.dataset.price);
            addToCart(name, price);
        });
    });

    // Обработчик для фудтраков без цены
    document.querySelectorAll('.btn.foodtrack').forEach(button => {
        button.addEventListener('click', (event) => {
            const item = event.target.closest('.cards-item');
            const name = item.dataset.name;
            addToCart(name);
        });
    });

    // Обработчик клика по кнопке "Очистить"
    const clearButton = document.querySelector('.btn.clear');
    if (clearButton) {
        clearButton.addEventListener('click', () => {
            localStorage.removeItem('cart'); // Удаляем корзину из localStorage
            updateCartDisplay(); // Обновляем отображение корзины
        });
    }

    // Обработчик для перехода на страницу заказа
    const toggleCartButton = document.getElementById('toggle-cart');
    if (toggleCartButton) {
        toggleCartButton.addEventListener('click', () => {
            window.location.href = 'order.html';
        });
    }

    // Инициализация отображения корзины при загрузке страницы
    updateCartDisplay();
});
