const priorityFilter = document.getElementById("priorityFilter");
const departmentFilter = document.getElementById("departmentFilter");
const typeFilter = document.getElementById("typeFilter");

priorityFilter.addEventListener("change", applyFilters);
departmentFilter.addEventListener("change", applyFilters);
typeFilter.addEventListener("change", applyFilters);

function applyFilters() {
    console.log("Applying filters...");
    const selectedPriority = priorityFilter.value;
    const selectedDepartment = departmentFilter.value;
    const selectedType = typeFilter.value;

    filterCards(selectedPriority, selectedDepartment, selectedType);
}

function filterCards(priority, department, type) {
    const cards = document.querySelectorAll(".card__inner");

    cards.forEach((card) => {
        const cardPriorityElement = card.querySelector(".card__priority");
        const cardDepartmentElement = card.querySelector(".card__department");
        const cardTypeElement = card.querySelector(".card__type");

        const cardPriority = cardPriorityElement ? cardPriorityElement.textContent.toLowerCase() : '';
        const cardDepartment = cardDepartmentElement ? cardDepartmentElement.textContent.toLowerCase() : '';
        const cardType = cardTypeElement ? cardTypeElement.textContent.toLowerCase() : '';

        const matchPriority = priority === "Всі" || cardPriority === priority.toLowerCase();
        const matchDepartment = department === "Всі" || cardDepartment === department.toLowerCase();
        const matchType = type === "Всі" || cardType === type.toLowerCase();

        if (matchPriority && matchDepartment && matchType) {
            card.classList.remove("hidden");
        } else {
            card.classList.add("hidden");
        }
    });
}

