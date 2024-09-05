

// const getData = async () => {
//     try {
//         const response = await fetch('getData.php');
//         const data = await response.json();
//         return data;
//     } catch (error) {
//         console.error('Error fetching data:', error);
//     }
// };

const data = {
    0 : {id: '0', square: '10', name: 'Orange baby'},
    1 : {id: '1', square: '10', name: 'Orange baby'},
    2 : {id: '1', square: '10', name: 'Orange baby'},
    3 : {id: '1', square: '10', name: 'Orange baby'},
    4 : {id: '1', square: '10', name: 'Orange baby'},
    5 : {id: '1', square: '15', name: 'Orange baby'},
}


const btn__calendar = document.querySelector('.btn__calendar-example');
console.log(btn__calendar)
btn__calendar.addEventListener('click', () => {
    fetch('getData.php')
        .then(response => response.json())
        .then(data => {
            console.log(data)

            console.log(data)
            // Получаем все чекбоксы
            const checkboxes = document.querySelectorAll('.foodtrack-size-item__checkbox');
            console.log(checkboxes);

            // Создаем массив для хранения выбранных значений
            const selectedSizes = [];

            // Проходим по каждому чекбоксу и проверяем, если он выбран, добавляем его значение в массив
            checkboxes.forEach(function(checkbox) {
                if (checkbox.checked) {
                    selectedSizes.push(checkbox.id);
                    console.log('Selected sizes:', selectedSizes);
                }
            });

            // Проверяем данные из массива data на соответствие выбранным размерам
            const matchingData = data.filter(item => selectedSizes.includes(item.square));
            console.log('Matching data:', matchingData);

    });

    
    // Получаем все элементы cards-item
    const cardsItems = document.querySelectorAll('.cards-item');

    // Проходим по каждому элементу cards-item и проверяем его классы
    cardsItems.forEach(function(card) {

        // Проверяем, есть ли у элемента класс из выбранных размеров
        const cardSizeClass = Array.from(card.classList).find(cls => cls.startsWith('size-'));
        
        if (selectedSizes.includes(cardSizeClass)) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });

    // // Получаем элемент, в который будем выводить список вариантов
    // const optionsList = document.getElementById('options-list');
    
    // // Очищаем предыдущий список вариантов
    // optionsList.innerHTML = '';
    
    // // Если выбрано хотя бы одно значение, выводим варианты
    // if (selectedSizes.length > 0) {
    //     selectedSizes.forEach(function(size) {
    //         const optionItem = document.createElement('div');
    //         optionItem.textContent = `Варианты для ${size.replace('size-', '')} м2`;
    //         optionsList.appendChild(optionItem);
    //     });
    // } else {
    //     // Если ни один чекбокс не выбран, показываем сообщение
    //     optionsList.textContent = 'Нет выбранных вариантов';
    // }
});