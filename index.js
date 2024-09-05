// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// import './css/style.css'
// import { response } from 'express';
// import { data, error } from 'jquery';
// import * as bootstrap from 'bootstrap';

// document.addEventListener('DOMContentLoaded', () => {
//     fetch('formRent.html')
//     .then(response => {
//       if (!response.ok) {
//         throw new Error('Network response was not ok ' + response.statusText);
//       }
//       return response.text();
//     })
//     .then(data => {
//       document.getElementById('formContainer').innerHTML = data;
//     })
//     .catch(error => console.error('Error loading form:', error));
// })
document.addEventListener('DOMContentLoaded', () => {
    const btns = document.querySelectorAll('.btn');
    const btnFree = document.querySelector('.btn-free');
    // const formContainer = document.querySelector('.form-container');

    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            // formContainer.style.display = 'block';
            console.log('Button clicked');
            const formHTML = `
                <form class="form-rent" action="process_form.php" method="POST">
                    <button class="btn-close" type="button">✕</button>
                    <div class="form-rent__header">
                        заполните контактные данные
                    </div>
                    <input class="inp-name" type="text" name="name" placeholder="Ваше имя" autocomplete="name" required>
                    <div class="popover name-pop"></div>
                    <input class="inp-phone" type="text" name="phone" placeholder="Телефон" autocomplete="tel" required>
                    <div class="popover phone-pop"></div>
                    <select class="foodtruck-model" name="model" required>
                        <option class="foodtruck-model-item" value="" selected disabled hidden>Модель фудтрака</option>
                        <option class="foodtruck-model-item" value="model1">Ораньжевый малыш</option>
                        <option class="foodtruck-model-item" value="model2">Длинный синий</option>
                        <option class="foodtruck-model-item" value="model3">Найт Лайтс</option>
                    </select>
                    <button class="btn foodtrack" type="submit">забронировать</button>
                </form>
            `;
            const formContainer = document.querySelector('.form-container');
            if (formContainer) {
                formContainer.innerHTML = formHTML;
            } else {
                console.error('Form container element not found');
            }
            const nameInput = document.querySelector('.inp-name');
            const phoneInput = document.querySelector('.inp-phone');
            const form = document.querySelector('.form-rent');
            const btnClose = document.querySelector('.btn-close');
            

            const showPopover = (element, message) => {
                const popover = element.nextElementSibling;
                popover.textContent = message;
                popover.style.display = 'block';
                setTimeout(() => {
                    popover.style.display = 'none';
                }, 3000);
            };

            btnClose.addEventListener('click', () => {
                // formContainer.style.display = "none";
                form.style.display = "none";
            });

            nameInput.addEventListener('input', function() {
                const nameRegex = /^[а-яА-ЯёЁa-zA-Z]+$/;
                if (!nameRegex.test(nameInput.value)) {
                    nameInput.classList.add('error');
                    showPopover(nameInput, 'Пожалуйста, введите ваше имя (только буквы).');
                } else {
                    nameInput.classList.remove('error');
                }
            });

            phoneInput.addEventListener('input', function() {
                if (!phoneInput.value.startsWith('+7')) {
                    phoneInput.value = '+7';
                }
                const phoneRegex = /^\+7\d{0,10}$/;
                if (!phoneRegex.test(phoneInput.value)) {
                    phoneInput.classList.add('error');
                    showPopover(phoneInput, 'Пожалуйста, введите корректный номер телефона (начинается с +7 и содержит до 10 цифр).');
                } else {
                    phoneInput.classList.remove('error');
                }
            });

            form.addEventListener('submit', function(event) {
                event.preventDefault();
                let valid = true;
                const nameRegex = /^[а-яА-ЯёЁa-zA-Z]+$/;
                const phoneRegex = /^\+7\d{10}$/;

                if (!nameInput.value.trim() || !nameRegex.test(nameInput.value)) {
                    nameInput.classList.add('error');
                    showPopover(nameInput, 'Пожалуйста, введите ваше имя (только буквы).');
                    valid = false;
                } else {
                    nameInput.classList.remove('error');
                }

                if (!phoneInput.value.trim() || !phoneRegex.test(phoneInput.value)) {
                    phoneInput.classList.add('error');
                    showPopover(phoneInput, 'Пожалуйста, введите корректный номер телефона (начинается с +7 и содержит 10 цифр).');
                    valid = false;
                } else {
                    phoneInput.classList.remove('error');
                }

                if (valid) {
                    alert('Форма успешно отправлена!');
                    nameInput.value = '';
                    phoneInput.value = '';
                    form.querySelector('.foodtruck-model').value = '';
                    form.style.display = "none";
                }
            });
        });
    });

    

    btnFree.addEventListener('click', () => {
        const bookingModels = document.querySelector('.booking-models');
        bookingModels.scrollIntoView({ behavior: 'smooth' });
    });

    
});

  
    
    // const nameInput = document.querySelector('.inp-name');
    // const phoneInput = document.querySelector('.inp-phone');
    // const form = document.querySelector('.form-rent');
    // const btnClose = document.querySelector('.btn-close');
    // const btnFree = document.querySelector('.btn-free');
    

    // const showPopover = (element, message) => {
    //     element.setAttribute('data-bs-content', message);
    //     const popover = bootstrap.Popover.getInstance(element) || new bootstrap.Popover(element, {
    //         trigger: 'manual',
    //         placement: 'right'
    //     });
    //     popover.show();
    //     setTimeout(() => popover.hide(), 3000);
    // };

    // const btns = document.querySelectorAll('.btn');
    // btns.forEach(btn => {
    //     btn.addEventListener('click', (e) => {
    //             fetch('./formRent.html')
    //                 .then(response => response.text())
    //                 .then(data => {
    //                     document.querySelector('form-rent').innerHTML = data;
    //                 })
    //                 .catch(error => console.log('Error', error))
    //     })
    // })

    // btnFree.addEventListener('click', () => {
    //     const bookingModels = document.querySelector('.booking-models');
    //     bookingModels.scrollIntoView({behavior: 'smooth'})
    // })


    // btnClose.addEventListener('click', () => {
    //     form.style.display = "none";  
    // })

    // function updateFormPosition() {
    //     const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    //     form.style.top = `${scrollTop + window.innerHeight / 2}px`;
    // }

    // window.addEventListener('scroll', updateFormPosition);
    // window.addEventListener('resize', updateFormPosition);
    // updateFormPosition();

    // nameInput.addEventListener('input', function() {
    //     const nameRegex = /^[а-яА-ЯёЁa-zA-Z]+$/;
    //     if (!nameRegex.test(nameInput.value)) {
    //         nameInput.classList.add('error');
    //         showPopover(nameInput, 'Пожалуйста, введите ваше имя (только буквы).');
    //     } else {
    //         nameInput.classList.remove('error');
    //         const popover = bootstrap.Popover.getInstance(nameInput);
    //         if (popover) popover.hide();
    //     }
    // });

    // phoneInput.addEventListener('input', function() {
    //     if (!phoneInput.value.startsWith('+7')) {
    //         phoneInput.value = '+7';
    //     }
    //     const phoneRegex = /^\+7\d{0,10}$/;
    //     if (!phoneRegex.test(phoneInput.value)) {
    //         phoneInput.classList.add('error');
    //         showPopover(phoneInput, 'Пожалуйста, введите корректный номер телефона (начинается с +7 и содержит до 10 цифр).');
    //     } else {
    //         phoneInput.classList.remove('error');
    //         const popover = bootstrap.Popover.getInstance(phoneInput);
    //         if (popover) popover.hide();
    //     }
    // });

    // form.addEventListener('submit', function(event) {
    //     event.preventDefault();
    //     let valid = true;
    //     const nameRegex = /^[а-яА-ЯёЁa-zA-Z]+$/;
    //     const phoneRegex = /^\+7\d{10}$/;

    //     if (!nameInput.value.trim() || !nameRegex.test(nameInput.value)) {
    //         nameInput.classList.add('error');
    //         showPopover(nameInput, 'Пожалуйста, введите ваше имя (только буквы).');
    //         valid = false;
    //     } else {
    //         nameInput.classList.remove('error');
    //         const popover = bootstrap.Popover.getInstance(nameInput);
    //         if (popover) popover.hide();
    //     }

    //     if (!phoneInput.value.trim() || !phoneRegex.test(phoneInput.value)) {
    //         phoneInput.classList.add('error');
    //         showPopover(phoneInput, 'Пожалуйста, введите корректный номер телефона (начинается с +7 и содержит 10 цифр).');
    //         valid = false;
    //     } else {
    //         phoneInput.classList.remove('error');
    //         const popover = bootstrap.Popover.getInstance(phoneInput);
    //         if (popover) popover.hide();
    //     }

    //     if (valid) {
    //         const formData = {
    //             name: nameInput.value,
    //             phone: phoneInput.value,
    //             foodtruckModel: form.querySelector('.foodtruck-model').value
    //         };

    //         fetch('/submit-form', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify(formData)
    //         })
    //         .then(response => response.json())
    //         .then(data => {
    //             console.log('Success:', data);
    //             nameInput.value = '';
    //             phoneInput.value = '';
    //             form.querySelector('.foodtruck-model').value = '';
    //             form.style.display = "none";
    //         })
    //         .catch((error) => {
    //             console.error('Error:', error);
    //             alert('Ошибка при отправке формы. Пожалуйста, попробуйте еще раз.');
    //         });
    //     }
    // });
// });
