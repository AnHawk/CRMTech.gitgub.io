let taskCounters = {
    "Високий": 0,
    "Середній": 0,
    "Низький": 0
};

document.addEventListener("DOMContentLoaded", function () {
    const addToDoButton = document.getElementById("addToDo");
    const toDoContainer = document.getElementById("toDo");
    const inProggres = document.getElementById("inProggres");
    const hold = document.getElementById("hold");
    const done = document.getElementById("done");

    function applyCompletedStyling(card, completed) {
        if (completed) {
            card.style.opacity = 0.5;
        } else {
            card.style.opacity = 1;
        }
    }

    function applyArchiveStyling(card, archive) {
        if (archive) {
            card.style.display = "none";
            card.style.visibility = "hidden";
            card.style.position = "absolute";
        } else {
            card.style.display = "block";
            card.style.visibility = "visible";
            card.style.position = "relative";
        }
    }
    

    function resetForm() {
        const todoForm = document.getElementById("todoForm");
        todoForm.querySelector("#title").value = "";
        todoForm.querySelector("#type").value = "Технічні проблеми";
        todoForm.querySelector("#priority").value = "Низький";
        todoForm.querySelector("#department").value = "К1";
        todoForm.querySelector("#datetime").value = "";
        todoForm.querySelector("#description").value = "";
    }

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
            <div class="card__inner data-key="${cardData.key}">
                <div class="card__header">
                <div class="card__footer">
                    <button class="complete-button"><img src="../img/check-mark.png"></button>
                    <button class="archive-button"><img src="../img/archive.png"></button>
                    <div class="card__date">${cardData.datetime}</div>
                </div>
                
                    <div class="card__info">
                        <div class="card__title">${cardData.title}</div>
                        <div class="card__class">
                            <div class="card__type">${cardData.type}</div>
                            <div class="card__priority">${cardData.priority}</div>
                            <div class="card__department">${cardData.department}</div>
                        </div>     
                    </div>
                    
                </div>
                <div class="card__description">
                    <div class="discription__block">${cardData.description}</div>
                </div>
                
            </div>
        `;


        applyCompletedStyling(card, cardData.completed);
        applyArchiveStyling(card, cardData.archive)
        
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

        const archiveButton = card.querySelector(".archive-button");
        archiveButton.addEventListener("click", function () {
            archiveCard(cardData.key);
        });
    
        // Додайте функцію архівації в середину функції addCardToPage
        function archiveCard(key) {
            console.log(`Спроба архівувати картку з ключем: ${key}`);
        
            // Оновлення архівації в Firebase
            database.collection("cards").doc(key).update({
                archive: true
            })
            .then(() => {
                console.log("Картка архівована в Firebase!");
                card.style.display = "none";
            })
            .catch((error) => {
                console.error("Помилка при оновленні документа в Firebase: ", error);
            });
        }
        
        

        // Додаємо карточку в відповідну колонку
        const column = getColumnById(columnId);
        column.appendChild(card);

        
        updateTaskCounters();


        function updateTaskCounters() {
            document.querySelector(".major__pr").innerText = taskCounters["Високий"];
            document.querySelector(".middle__pr").innerText = taskCounters["Середній"];
            document.querySelector(".low-priority.light__pr").innerText = taskCounters["Низький"];
        }
       // Отримуємо дані з LocalStorage при завантаженні сторінки
        window.addEventListener("load", function () {
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                const cardData = JSON.parse(localStorage.getItem(key));
                addCardToPage(cardData, cardData.column);
            }
        });

        // Зберігаємо дані в LocalStorage при додаванні нової картки
        function saveToLocalStorage(cardData) {
            localStorage.setItem(cardData.key, JSON.stringify(cardData));
        }

        // Додаємо обробник для кнопки "Task Complete"
        const completeButton = card.querySelector(".complete-button");
        completeButton.addEventListener("click", function () {
            cardData.completed = !cardData.completed;
            applyCompletedStyling(card, cardData.completed);
            // Отримуємо поточну дату та час завершення
            const completionDate = new Date();
            // Зберігаємо дату та час завершення у форматі, який вам зручний
            const completionDateString = completionDate.toLocaleString();
            // Оновлюємо стиль картки, щоб зробити її полупрозорою
            card.classList.add("done-card");
            // Оновлюємо дані в Firebase
            database.collection("cards").doc(cardData.key).update({
                completed: true,
                completionDate: completionDateString
            })
            .then(function () {
                console.log("Task marked as complete in Firebase!");
                // Оновлюємо локальні лічильники і виводимо їх на сторінці
                updateTaskCounters();
                // Зберігаємо дані в LocalStorage
                saveToLocalStorage(cardData);
            })
            .catch(function (error) {
                console.error("Error updating document in Firebase: ", error);
            });
        });

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
            completed: false, // Нове поле
            archive: false,
            completionDate: "", // Нове поле
            key: "",
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
        resetForm()
    });

    // Додаємо обробники подій для колонок
    const columns = [toDoContainer, inProggres, hold, done];

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