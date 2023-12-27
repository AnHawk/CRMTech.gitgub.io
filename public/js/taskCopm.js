// taskComplete.js

function handleTaskComplete(cardData, card) {
    const completionDate = new Date();
    const completionDateString = completionDate.toLocaleString();
    card.classList.add("done-card");
    
    database.collection("cards").doc(cardData.key).update({
        completed: true,
        completionDate: completionDateString
    })
    .then(function () {
        console.log("Task marked as complete in Firebase!");
        updateTaskCounters();
    })
    .catch(function (error) {
        console.error("Error updating document in Firebase: ", error);
    });
}
