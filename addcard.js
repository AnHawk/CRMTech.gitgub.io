let taskCounters = {
    "Високий": 0,
    "Середній": 0,
    "Низький": 0
};

document.addEventListener("DOMContentLoaded", function () {
    // Ініціалізація Firebase
    var firebaseConfig = {
        apiKey: "AIzaSyBRsPXwZqwcY4FYW-NttN78lyjg_sDkAiY",
        authDomain: "crm-tech-support.firebaseapp.com",
        projectId: "crm-tech-support",
        storageBucket: "crm-tech-support.appspot.com",
        messagingSenderId: "1036703644603",
        appId: "1:1036703644603:web:5d59ea90b9ab0ff452a29e"
    };
    firebase.initializeApp(firebaseConfig);
    const database = firebase.firestore();

    const addToDoButton = document.getElementById("addToDo");
    const toDoContainer = document.getElementById("toDo");
    const inProggres = document.getElementById("inProggres");
    const hold = document.getElementById("hold");
    const done = document.getElementById("done");

    // Функція для створення та додавання карточки на сторінку
    function addCardToPage(cardData, columnId) {
        const card = document.createElement("div");
        card.className = "card", "hidden";
        card.draggable = true;

        // Встановлюємо колір картки відповідно до пріоритету
        if (cardData.priority === "Низький") {
            card.classList.add("low-priority");
            taskCounters["Низький"]++;
        } else if (cardData.priority === "Середній") {
            card.classList.add("medium-priority");
            taskCounters["Середній"]++;
        } else if (cardData.priority === "Високий") {
            card.classList.add("high-priority");
            taskCounters["Високий"]++;
        }
    

        card.innerHTML = `
            <div class="card__inner">
                <div class="card__header">
                    <div class="card__info">
                        <div class="card__title">${cardData.title}</div>
                        <div class="card__class">
                            <div class="card__type">${cardData.type}</div>
                            <div class="card__priority">${cardData.priority}</div>
                            <div class="card__department">${cardData.department}</div>
                        </div>     
                    </div>
                    <div class="card__date">${cardData.datetime}</div>
                </div>
                <div class="card__description">
                    <div class="discription__block">${cardData.description}</div>
                </div>
            </div>
        `;

        // Додаємо обробники подій для новоствореної карточки
        card.addEventListener("dragstart", function (e) {
            card.addEventListener("dragstart", function (e) {
            let selected = e.target;

            inProggres.addEventListener("dragover", function (e) {
                e.preventDefault();
            });
            inProggres.addEventListener("drop", function (e) {
                inProggres.appendChild(selected);
                selected = null;
                // Оновлюємо LocalStorage зі статусом та пріоритетом картки
                cardData.column = "inProggres";
                localStorage.setItem(cardData.key, JSON.stringify(cardData));
                card.classList.remove("done-card");
            });

            hold.addEventListener("dragover", function (e) {
                e.preventDefault();
            });
            hold.addEventListener("drop", function (e) {
                hold.appendChild(selected);
                selected = null;
                // Оновлюємо LocalStorage зі статусом та пріоритетом картки
                cardData.column = "hold";
                localStorage.setItem(cardData.key, JSON.stringify(cardData));
                card.classList.remove("done-card");
            });

            done.addEventListener("dragover", function (e) {
                e.preventDefault();
            });
            done.addEventListener("drop", function (e) {
                done.appendChild(selected);
                selected = null;
                // Оновлюємо LocalStorage зі статусом та пріоритетом картки
                cardData.column = "done";
                localStorage.setItem(cardData.key, JSON.stringify(cardData));
                // Змінюємо стиль картки, щоб зробити її полупрозорою
                card.classList.add("done-card");
            });
            toDoContainer.addEventListener("dragover", function (e) {
                e.preventDefault();
            });
            toDoContainer.addEventListener("drop", function (e) {
                toDoContainer.appendChild(selected);
                selected = null;
                // Оновлюємо LocalStorage зі статусом та пріоритетом картки
                cardData.column = "toDo";
                localStorage.setItem(cardData.key, JSON.stringify(cardData));
                card.classList.remove("done-card");
            });
        });
            e.dataTransfer.setData("text/plain", cardData.key);
        });

        card.addEventListener("dragend", function () {
            // Видаляємо дані з LocalStorage після завершення перетягування
            if (localStorage.getItem(cardData.key)) {
                localStorage.removeItem(cardData.key);
            }

            // Оновлюємо дані в Firebase
            database.collection("cards").doc(cardData.key).set(cardData)
                .then(function () {
                    console.log("Document successfully updated in Firebase!");
                })
                .catch(function (error) {
                    console.error("Error updating document in Firebase: ", error);
                });
        });

        // Додаємо карточку в відповідну колонку
        const column = getColumnById(columnId);
        column.appendChild(card);

        updateTaskCounters();

        function updateTaskCounters() {
            document.querySelector(".major__pr").innerText = taskCounters["Високий"];
            document.querySelector(".middle__pr").innerText = taskCounters["Середній"];
            document.querySelector(".low-priority.light__pr").innerText = taskCounters["Низький"];
        }
    }

    // Функція для отримання елемента колонки за ідентифікатором
    function getColumnById(columnId) {
        switch (columnId) {
            case "inProggres":
                return inProggres;
            case "hold":
                return hold;
            case "done":
                return done;
            default:
                return toDoContainer;
        }
    }

    // Отримуємо дані з Firebase при завантаженні сторінки
    database.collection("cards").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const cardData = doc.data();
            addCardToPage(cardData, cardData.column);
        });
    });

    addToDoButton.addEventListener("click", function () {
        const todoForm = document.getElementById("todoForm");

        const title = document.getElementById("title").value;
        const type = document.getElementById("type").value;
        const priority = document.getElementById("priority").value;
        const department = document.getElementById("department").value;
        const datetime = document.getElementById("datetime").value;
        const description = document.getElementById("description").value;

        const cardData = {
            title,
            type,
            priority,
            department,
            datetime,
            description,
            column: "toDo", // Початкова колонка
        };

        // Додаємо карточку в Firebase
        database.collection("cards").add(cardData)
            .then(function (docRef) {
                cardData.key = docRef.id;
                addCardToPage(cardData, cardData.column);
                console.log("Document successfully written to Firebase!");
            })
            .catch(function (error) {
                console.error("Error writing document to Firebase: ", error);
            });

        todoForm.reset();
    });

    // Додаємо обробники подій для колонок
    const columns = [toDoContainer, inProgress, hold, done];

    columns.forEach((column) => {
        column.addEventListener("dragover", function (e) {
            e.preventDefault();
        });

        column.addEventListener("drop", function (e) {
            e.preventDefault();
            const cardKey = e.dataTransfer.getData("text/plain");
            const cardElement = document.querySelector(`.card[data-key="${cardKey}"]`);

            // Отримуємо дані картки з Firebase та оновлюємо колонку
            database.collection("cards").doc(cardKey).get().then((doc) => {
                const cardData = doc.data();
                const newColumn = column.id;
                const oldColumn = cardData.column;

                // Перевіряємо, чи змінився статус колонки
                if (newColumn !== oldColumn) {
                    // Видаляємо картку зі старої колонки
                    const oldColumnElement = getColumnById(oldColumn);
                    oldColumnElement.removeChild(cardElement);

                    // Оновлюємо дані картки та додаємо до нової колонки
                    cardData.column = newColumn;
                    database.collection("cards").doc(cardKey).set(cardData).then(() => {
                        addCardToPage(cardData, newColumn);
                    });
                }
            });
        });
    });
});


