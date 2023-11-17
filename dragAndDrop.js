// dragAndDrop.js

document.addEventListener("DOMContentLoaded", function () {
    const addToDoButton = document.getElementById("addToDo");
    const toDoContainer = document.getElementById("toDo");
    const inProggres = document.getElementById("inProggres");
    const hold = document.getElementById("hold");
    const done = document.getElementById("done");

    addToDoButton.addEventListener("click", function () {
        const title = document.getElementById("title").value;
        const type = document.getElementById("type").value;
        const priority = document.getElementById("priority").value;
        const department = document.getElementById("department").value;
        const datetime = document.getElementById("datetime").value;
        const description = document.getElementById("description").value;

        const card = createCard(title, department, priority, datetime, description);

        // Додаємо обробники подій для новоствореної карточки
        card.addEventListener("dragstart", function (e) {
            let selected = e.target;

            inProggres.addEventListener("dragover", function (e) {
                e.preventDefault();
            });
            inProggres.addEventListener("drop", function (e) {
                inProggres.appendChild(selected);
                selected = null;
            });

            hold.addEventListener("dragover", function (e) {
                e.preventDefault();
            });
            hold.addEventListener("drop", function (e) {
                hold.appendChild(selected);
                selected = null;
            });

            done.addEventListener("dragover", function (e) {
                e.preventDefault();
            });
            done.addEventListener("drop", function (e) {
                done.appendChild(selected);
                selected = null;
            });
        });

        toDoContainer.appendChild(card);

        // Очищаємо форму
        todoForm.reset();
    });
});
