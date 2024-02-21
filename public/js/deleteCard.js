// Скрипт для видалення
document.addEventListener('DOMContentLoaded', function () {
    const messagesContainer = document.getElementById("messagesContainer");

    messagesContainer.addEventListener('click', async function (event) {
        if (event.target.classList.contains('BTN__delete')) {
            const cardContainer = event.target.closest('.message__inner');
            const cardKey = cardContainer.dataset.cardKey;

            // Видалення картки зі сторінки
            cardContainer.remove();

            // Видалення картки з бази даних
            await deleteCard(cardKey);
        }
    });
});

async function deleteCard(cardKey) {
    // Отримання посилання на колекцію "messages"
    const messageCollection = firebase.firestore().collection("messages");

    // Перевірка, чи існує документ з таким ключем перед видаленням
    const doc = await messageCollection.doc(cardKey).get();
    if (doc.exists) {
        // Тут виконується логіка видалення картки з бази даних
        await messageCollection.doc(cardKey).delete();
        console.log("Document successfully deleted!");
    } else {
        console.log("Document not found!");
    }
}
