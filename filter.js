const filterDropdown = document.getElementById("filterDropdown");
filterDropdown.addEventListener("change", function () {
    const selectedPriority = filterDropdown.value;
    filterCardsByPriority(selectedPriority);
});

function filterCardsByPriority(priority) {
    const cards = document.querySelectorAll(".card");

    cards.forEach((card) => {
        const cardPriorityElement = card.querySelector(".card__priority");
        const cardPriority = cardPriorityElement ? cardPriorityElement.textContent.toLowerCase() : '';

        if (priority === "Всі" || cardPriority === priority.toLowerCase()) {
            card.classList.remove("hidden");
        } else {
            card.classList.add("hidden");
        }
    });
}
