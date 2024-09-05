    document.addEventListener('DOMContentLoaded', () => {
        let selectedTruckId = null;
        let selectedTruckPrice = 25000;

        // Инициализация календаря с поддержкой диапазона дат
        const calendar = flatpickr("#calendar-rent", {
            dateFormat: "Y-m-d",
            inline: true,
            mode: "range",  // Включаем выбор диапазона дат
            disable: [],    // Сюда будут подгружены забронированные и прошедшие даты
            onChange: function(selectedDates, dateStr, instance) {
                if (selectedTruckId) {
                    console.log(`Selected dates: ${dateStr} for truck ID: ${selectedTruckId}`);
                }
            }
        });

        // Функция для обновления заблокированных дат на календаре
        function updateCalendarDisabledDates(truckId) {
            fetch(`rentFoodtrack.php?truck_id=${truckId}`)
                .then(response => response.json())
                .then(data => {
                    console.log('Data received from server:', data);

                    const { bookedDates } = data;
                    
                    const formatDate = dateStr => new Date(dateStr).toISOString().split('T')[0];
                    const today = new Date().toISOString().split('T')[0];

                    const datesToDisable = [];
                    bookedDates.forEach(date => {
                        datesToDisable.push(formatDate(date));
                    });

                    // Блокируем прошедшие даты (включая сегодняшний день до текущего времени)
                    for (let date = new Date('2000-01-01'); date <= new Date(today); date.setDate(date.getDate() + 1)) {
                        datesToDisable.push(new Date(date).toISOString().split('T')[0]);
                    }

                    const uniqueDatesToDisable = [...new Set(datesToDisable)];
                    calendar.set('disable', uniqueDatesToDisable);
                    calendar.redraw();
                })
                .catch(error => console.error('Ошибка при загрузке дат:', error));
        }

        document.querySelectorAll('.btn.foodtrack').forEach(button => {
            button.addEventListener('click', function(event) {
                const item = event.target.closest('.cards-item');
                const btnConfirmBooking = document.querySelector('.btn.confirm-booking');
                btnConfirmBooking.style.display = 'block';
                selectedTruckId = item.dataset.id;
                selectedTruckPrice = parseFloat(item.dataset.price) || 25000;  // Получаем цену из dataset

                // Обновляем заблокированные даты при выборе фудтрака
                updateCalendarDisabledDates(selectedTruckId);
            });
        });

        // Обработка клика на кнопку "Подтвердить бронирование"
        document.querySelector('.btn.confirm-booking').addEventListener('click', function() {
            const selectedDates = calendar.selectedDates;

            if (selectedDates.length < 1 || selectedDates.length > 2) {
                alert("Пожалуйста, выберите диапазон дат для бронирования.");
                return;
            }

            // Получаем начальную и конечную дату диапазона и устанавливаем корректное время
            const startDate = new Date(selectedDates[0]);
            const endDate = selectedDates.length === 2 ? new Date(selectedDates[1]) : new Date(startDate);

            // Устанавливаем время на начало дня для startDate и на конец дня для endDate
            // не понял почему так, но работает
            startDate.setHours(23, 59, 59, 999);
            endDate.setHours(23, 59, 59, 999);

            // Форматируем даты в строку
            const formattedStartDate = startDate.toISOString().split('T')[0];
            const formattedEndDate = endDate.toISOString().split('T')[0];

            // Вычисляем количество дней
            const diffTime = Math.abs(endDate - startDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 чтобы включить последний день

            // Вычисляем общую стоимость
            const totalPrice = diffDays * selectedTruckPrice;

            console.log(`Sending start date: ${formattedStartDate}, end date: ${formattedEndDate}`);
            console.log(`Total price: ${totalPrice}`);

            // Добавляем бронирование в корзину
            addToCart(`Фудтрак ${selectedTruckId} с ${formattedStartDate} по ${formattedEndDate}`, totalPrice);

            // Отправляем данные бронирования на сервер
            fetch('rentFoodtrack.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    truck_id: selectedTruckId,
                    start_date: formattedStartDate,
                    end_date: formattedEndDate
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert("Бронирование успешно!");

                    // Обновляем заблокированные даты после успешного бронирования
                    updateCalendarDisabledDates(selectedTruckId);
                } else {
                    alert("Ошибка бронирования: " + (data.error || "Неизвестная ошибка"));
                }
            })
            .catch(error => console.error('Ошибка при бронировании:', error));
        });

        // Добавляем товар в корзину
        function addToCart(name, price) {
            const cart = getCart();
            const existingItem = cart.find(item => item.name === name);
            if (existingItem) {
                existingItem.quantity++;
                existingItem.price += price;
            } else {
                cart.push({ name, price, quantity: 1 });
            }
            saveCart(cart);
            updateCartDisplay();
        }

        // Получаем корзину из localStorage или создаем пустую
        function getCart() {
            const cart = localStorage.getItem('cart');
            return cart ? JSON.parse(cart) : [];
        }

        // Сохраняем корзину в localStorage
        function saveCart(cart) {
            localStorage.setItem('cart', JSON.stringify(cart));
        }

        // Обновляем отображение корзины
        function updateCartDisplay() {
            const cart = getCart();
            const cartCountElement = document.getElementById('cart-count');
            const cartItemsContainer = document.getElementById('cart-items');
            if (!cartItemsContainer) return;  // Если корзина не найдена на странице, ничего не делаем
            cartItemsContainer.innerHTML = '';
            let total = 0;
            cart.forEach(item => {
                const itemElement = document.createElement('li');
                itemElement.textContent = `${item.name} - ${item.quantity} x ${item.price}₽`;
                cartItemsContainer.appendChild(itemElement);
                total += item.price;
            });
            document.getElementById('cart-total').textContent = total;
        }

        // Отправка заказа
        function sendOrder(name, phone) {
            const orderDetails = {
                name: name,
                phone: phone,
                items: getCart(),
                total: document.getElementById('cart-total').textContent
            };

            console.log(orderDetails)
            
            fetch('send_order.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderDetails)
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    alert('Заказ успешно отправлен!');
                    localStorage.removeItem('cart');
                    updateCartDisplay();
                    document.getElementById('order-form').style.display = 'none';
                } else {
                    alert('Ошибка при отправке заказа');
                }
            })
            .catch(error => {
                console.error('Ошибка:', error);
                alert('Ошибка при отправке заказа');
            });
        }

                // Обработчик клика по кнопке "Заказать"
            // const orderButton = document.getElementById('order-button');
            // if (orderButton) {
            //     orderButton.addEventListener('click', () => {
            //         const orderForm = document.getElementById('order-form');
            //         orderForm.style.display = 'block';
            //     });
            // }

            // Обработчик отправки формы заказа
            const orderForm = document.getElementById('order-form');
            if (orderForm) {
                orderForm.querySelector('form').addEventListener('submit', (event) => {
                    event.preventDefault();
                    const name = document.getElementById('name').value;
                    const phone = document.getElementById('phone').value;
                    sendOrder(name, phone);
                });
            }

        // Обработчик клика по кнопке "Очистить"
        const clearButton = document.querySelector('.btn.clear');
        if (clearButton) {
            clearButton.addEventListener('click', () => {
                localStorage.removeItem('cart'); // Удаляем корзину из localStorage
                updateCartDisplay(); // Обновляем отображение корзины
            });
        }
        
            // Обработчик для сворачивания/разворачивания корзины
            const cart = document.getElementById('cart');
            const toggleCartButton = document.getElementById('toggle-cart');
            const collapseCartButton = document.getElementById('collapse-cart');
        
            // Свернуть корзину и показать круглую кнопку
            collapseCartButton.addEventListener('click', () => {
                cart.classList.add('collapsed');
                toggleCartButton.classList.add('show');
            });
        
            // Развернуть корзину и скрыть круглую кнопку
            toggleCartButton.addEventListener('click', () => {
                cart.classList.remove('collapsed');
                toggleCartButton.classList.remove('show');
            });
        
            const orderButton = document.getElementById('order-button');
            if (orderButton) {
                orderButton.addEventListener('click', () => {
                    window.location.href = 'order.html';
                });
            }

        // Инициализация корзины при загрузке страницы
        updateCartDisplay();  // Переместил сюда, чтобы корзина всегда отображалась правильно при загрузке страницы
    });

