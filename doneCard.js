document.addEventListener("DOMContentLoaded", function () {
    // Функція для перевірки та оновлення напівпрозорості завершених карток
    function checkAndUpdateTransparency() {
        // Отримання всіх карток з Firebase
        database.collection("cards").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const cardData = doc.data();

                // Вивід у консоль
                console.log("Card data:", cardData);

                // Перевірка, чи карта завершена
                if (cardData.completed) {
                    // Отримання елемента карти за ID
                    const cardElement = document.querySelector(`.card[data-key="${doc.id}"]`);

                    // Перевірка, чи елемент карти існує
                    if (cardElement) {
                        // Додавання класу для зроблення карти напівпрозорою
                        cardElement.classList.add("done-card");
                    }
                }
            });
        });
    }

    // Виклик функції при завантаженні сторінки
    checkAndUpdateTransparency();
});
