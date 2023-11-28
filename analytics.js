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

    // Отримуємо дані з Firebase та викликаємо функції для відображення кругових діаграм
    getCardDataForAnalytics(displayPriorityChart, displayColumnChart);

    function getCardDataForAnalytics(callbackPriority, callbackColumn) {
        const priorityCounters = {
            "Високий": 0,
            "Середній": 0,
            "Низький": 0
        };

        const columnCounters = {
            "toDo": 0,
            "inProggres": 0,
            "hold": 0,
            "done": 0
        };

        database.collection("cards").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const cardData = doc.data();
                priorityCounters[cardData.priority]++;
                columnCounters[cardData.column]++;
            });

            callbackPriority(priorityCounters);
            callbackColumn(columnCounters);
        });
    }

    function displayPriorityChart(priorityCounters) {
        const priorityChartCanvas = document.getElementById("priorityChart").getContext("2d");

        // Створюємо кругову діаграму для пріоритетів
        new Chart(priorityChartCanvas, {
            type: "doughnut",
            data: {
                labels: Object.keys(priorityCounters),
                datasets: [{
                    data: Object.values(priorityCounters),
                    backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
                }]
            },
            options: {
                title: {
                    display: true,
                    text: "Аналітика карток за пріорітетами"
                }
            }
        });
    }

    function displayColumnChart(columnCounters) {
        const columnChartCanvas = document.getElementById("columnChart").getContext("2d");

        // Створюємо кругову діаграму для колонок
        new Chart(columnChartCanvas, {
            type: "doughnut",
            data: {
                labels: Object.keys(columnCounters),
                datasets: [{
                    data: Object.values(columnCounters),
                    backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50"],
                }]
            },
            options: {
                title: {
                    display: true,
                    text: "Аналітика карток за колонками"
                }
            }
        });
    }
});