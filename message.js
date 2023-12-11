// Ініціалізація Firebase (замініть на свої дані)
var firebaseConfig = {
    apiKey: "AIzaSyBRsPXwZqwcY4FYW-NttN78lyjg_sDkAiY",
    authDomain: "crm-tech-support.firebaseapp.com",
    projectId: "crm-tech-support",
    storageBucket: "crm-tech-support.appspot.com",
    messagingSenderId: "1036703644603",
    appId: "1:1036703644603:web:5d59ea90b9ab0ff452a29e"
};

firebase.initializeApp(firebaseConfig);

// Отримання посилання на колекцію "message"
const messageCollection = firebase.firestore().collection("messages");

// Отримання контейнера для повідомлень на сторінці
const messagesContainer = document.getElementById("messagesContainer");

// Функція для виведення даних на сторінку
function displayMessages(messages) {
    // Очистити попередні дані в контейнері
    messagesContainer.innerHTML = "";

    // Вивести кожне повідомлення у вигляді div
    messages.forEach(messages => {
        const messageDiv = document.createElement("div");
        messageDiv.textContent = messages.text; // Припускається, що у вашому об'єкті є поле "text"
        messagesContainer.appendChild(messageDiv);
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
});
