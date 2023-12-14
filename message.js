// Ініціалізація Firebase (замініть на свої дані)
// var firebaseConfig = {
//     apiKey: "AIzaSyBRsPXwZqwcY4FYW-NttN78lyjg_sDkAiY",
//     authDomain: "crm-tech-support.firebaseapp.com",
//     projectId: "crm-tech-support",
//     storageBucket: "crm-tech-support.appspot.com",
//     messagingSenderId: "1036703644603",
//     appId: "1:1036703644603:web:5d59ea90b9ab0ff452a29e"
// };

// firebase.initializeApp(firebaseConfig);

// Отримання посилання на колекцію "message"
const messageCollection = firebase.firestore().collection("messages");

// Отримання контейнера для повідомлень на сторінці
const messagesContainer = document.getElementById("messagesContainer");

// Функція для виведення даних на сторінку
function displayMessages(messages) {
    // Очистити попередні дані в контейнері
    messagesContainer.innerHTML = "";

    // Вивести кожне повідомлення у вигляді div
    messages.forEach(messageData => {
        const message = document.createElement("div");
        message.classList.add("message__inner");
        message.innerHTML = `
            <div class="message__content">
                <div class="message__hero">
                    <div class="message__sender">${messageData.user_name}</div>
                    <div class="message__text">${messageData.message}</div>
                </div>
                <div class="message__footer">
                    <button data-modal-btn="my_modal3" class="mainPage_hero_BTN">+</button>
                </div>
            </div>
        `;
        messagesContainer.appendChild(message);
    });
}

// Отримати дані з колекції "message" та викликати функцію виведення
messageCollection.get().then((querySnapshot) => {
    const messages = [];
    querySnapshot.forEach((doc) => {
        const messageData = doc.data();
        messages.push(messageData);
    });

    displayMessages(messages);

    // Додаємо обробник події для кожної кнопки "Add Task"
    const addTaskButtons = document.querySelectorAll('.mainPage_hero_BTN');
    addTaskButtons.forEach((addTaskButton, index) => {
        addTaskButton.addEventListener('click', function () {
            // Знаходимо модальне вікно за допомогою атрибута 'data-modal-window'
            const modalName = addTaskButton.getAttribute('data-modal-btn');
            const modal = document.querySelector("*[data-modal-window='" + modalName + "']");
            modal.style.display = "block";

            // Знаходимо <textarea> та підставляємо значення messageData.message
            const descriptionTextarea = modal.querySelector('#description');
            if (descriptionTextarea) {
                // Перевіряємо, чи індекс знайдений та чи існує відповідний об'єкт в масиві messages
                if (messages[index]) {
                    descriptionTextarea.value = messages[index].message;
                }
            }

            // Додаємо обробник для закриття модального вікна при кліку на кнопку "close"
            const close = modal.querySelector(".close_modal_window");
            close.addEventListener('click', function () {
                closeModal(modal);
            });

            // ... (інші обробники подій для модального вікна)
        });
    });
}).catch((error) => {
    console.error("Error getting documents: ", error);
});

// Додано обробник події для DOMContentLoaded
document.addEventListener('DOMContentLoaded', function () {
    const addToDoButton = document.getElementById('addToDo');
    addToDoButton.addEventListener('click', async function () {
        const title = document.getElementById('title').value;
        const type = document.getElementById('type').value;
        const priority = document.getElementById('priority').value;
        const department = document.getElementById('department').value;
        const datetime = document.getElementById('datetime').value;
        const description = document.getElementById('description').value;

        // Генеруємо унікальний ключ (id)
        const key = database.collection("cards").doc().id;

        const cardData = {
            title,
            type,
            priority,
            department,
            datetime,
            description,
            column: "toDo",
            completed: false,
            completionDate: "",
            key, // Додаємо ключ до об'єкта
        };

        // Додаємо документ до колекції "cards" і використовуємо ключ як id
        await database.collection("cards").doc(key).set(cardData);

        // Оновлюємо картку на сторінці з використанням нового ключа
        // const card = addCardToPage(cardData);
        // messagesContainer.appendChild(card);

        const modal = document.querySelector("*[data-modal-window='my_modal3']");
        closeModal(modal);
    });
});



// // Функція для додавання картки з ключем
// function addCardToPage(cardData) {
//     const card = document.createElement("div");
//     card.className = "card";
//     card.setAttribute("data-key", cardData.key); // Додаємо ключ до атрибуту 'data-key'
//     card.innerHTML = `
//         <div class="card__inner" data-key="${cardData.key}">
//             <div class="card__header">
//                 <div class="card__footer">
//                     <button class="complete-button">Complete</button>
//                     <div class="card__date">${cardData.datetime}</div>
//                 </div>
//                 <div class="card__info">
//                     <div class="card__title">${cardData.title}</div>
//                     <div class="card__class">
//                         <div class="card__type">${cardData.type}</div>
//                         <div class="card__priority">${cardData.priority}</div>
//                         <div class="card__department">${cardData.department}</div>
//                     </div>     
//                 </div>
//             </div>
//             <div class="card__description">
//                 <div class="discription__block">${cardData.description}</div>
//             </div>
//         </div>
//     `;

//     return card;
// }

// Отримання посилання на колекцію "cards"
const cardsCollection = firebase.firestore().collection("cards");

cardsCollection.get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        const cardData = doc.data();
        // Додаємо ключ до об'єкта cardData
        cardData.key = doc.id;
        // Додаємо картку до сторінки
        // const card = addCardToPage(cardData);
        // messagesContainer.appendChild(card);
    });
}).catch((error) => {
    console.error("Error getting documents: ", error);
});
