document.addEventListener('DOMContentLoaded', () => {
    updateCartSummary(); // Изначальная отрисовка корзины

    // Добавляем обработчик событий для кнопок "Удалить" после обновления корзины
    document.querySelector('#cart-summary').addEventListener('click', (event) => {
        if (event.target.classList.contains('btn-remove')) {
            const index = event.target.dataset.index;
            removeFromCart(index);
        }
    });
});

function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function removeFromCart(index) {
    const cart = getCart();
    cart.splice(index, 1); // Удаляем элемент из массива корзины
    saveCart(cart); // Сохраняем обновленную корзину
    updateCartSummary(); // Обновляем отображение корзины
}

// Функция для обновления отображения корзины
function updateCartSummary() {
    const cart = getCart();
    const cartSummary = document.getElementById('cart-summary');
    console.log("Обновляем корзину, текущее содержимое:", cart);

    cartSummary.innerHTML = ''; // Очищаем текущий контент
    let total = 0;

    if (cart.length === 0) {
        console.log("Корзина пуста");
        cartSummary.textContent = 'Ваша корзина пуста';
        return;
    }

    cart.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';

        // Проверяем, есть ли даты аренды
        const rentalDates = item.startDate && item.endDate 
            ? `<span class="item-dates">Аренда: с ${item.startDate} по ${item.endDate}</span>` 
            : '';

        itemElement.innerHTML = `
            <div class="cart-item__info">
                <span class="item-name">${item.name}</span> - ${item.quantity} шт. x ${item.price}₽
                ${rentalDates}
            </div>
            <button class="btn-remove" data-index="${index}">&#10006;</button>
        `;
        cartSummary.appendChild(itemElement);
        total += item.quantity * item.price;
    });

    const totalElement = document.createElement('div');
    totalElement.className = 'cart-total';
    totalElement.textContent = `Общая сумма: ${total}₽`;
    cartSummary.appendChild(totalElement);

    // Функция для отправки заказа
    function sendOrder(name, phone, paymentMethod, address) {
        const orderDetails = {
            name: name,
            phone: phone,
            paymentMethod: paymentMethod,
            address: address,
            items: getCart(),
            total: document.getElementById('cart-summary').textContent
        };

        fetch('send_order.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderDetails)
        })
        .then(response => response.text())  // Измените на response.text(), чтобы посмотреть текстовый ответ
        .then(text => {
            console.log('Ответ сервера:', text);  // Посмотрите, что вернул сервер
            const data = JSON.parse(text);  // Преобразуйте текст в JSON
            if (data.status === 'success') {
                alert('Заказ успешно отправлен!');
                localStorage.removeItem('cart');
                cartSummary.innerHTML = '';
                document.getElementById('checkout-form').reset(); // Сброс формы
            } else {
                alert('Ошибка при отправке заказа');
            }
        })
        .catch(error => {
            console.error('Ошибка:', error);
            alert('Ошибка при отправке заказа');
        });
    }

    // Обработчик отправки формы
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Предотвращаем стандартное поведение формы
            
            const name = document.getElementById('name').value;
            const phone = document.getElementById('phone').value;
            const paymentMethod = document.getElementById('payment-method').value;
            const address = document.getElementById('address').value;

            if (name && phone) { // Проверяем обязательные поля
                sendOrder(name, phone, paymentMethod, address);
            } else {
                alert('Пожалуйста, заполните все обязательные поля.');
            }
        });
    }
}
