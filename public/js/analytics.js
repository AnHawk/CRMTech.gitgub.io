document.addEventListener("DOMContentLoaded", function () {

    const completionCount = {
        completed: 0,
        active: 0
    };

    function calculateAverageDuration(cards) {
        let totalDuration = 0;
        let completedCount = 0;
    
        cards.forEach((card) => {
            if (typeof card.completed !== 'undefined' && card.datetime && card.completionDate) {
                const startTime = moment(card.datetime, ["YYYY-MM-DDTHH:mm", "DD.MM.YYYY, HH:mm:ss"]);
                const endTime = moment(card.completionDate, ["YYYY-MM-DDTHH:mm", "DD.MM.YYYY, HH:mm:ss"]);
    
                if (startTime.isValid() && endTime.isValid() && endTime.isSameOrAfter(startTime)) {
                    const duration = endTime.diff(startTime);
                    totalDuration += duration;
                    completedCount++;
                } else {
                    console.error("Помилка у форматі дати/часу для картки або endTime менший за startTime:", card);
                }
            } else {
                console.error("Некоректні дані для картки:", card);
            }
        });
    
        if (completedCount > 0) {
            const averageDuration = totalDuration / completedCount;
            const averageDurationHours = moment.duration(averageDuration).asHours();
    
            document.getElementById("resultContainer").innerHTML = `Середнє значення часу виконання задачі (у годинах): ${averageDurationHours.toFixed(2)}`;
        } else {
            console.warn("Немає завершених задач або некоректних дат для обчислення середнього часу.");
        }
    }
    
    

    function displayCompletionChart(completionCount) {
        const completionChartCanvas = document.getElementById("completionChart").getContext("2d");

        new Chart(completionChartCanvas, {
            type: "doughnut",
            data: {
                labels: ["Завершені", "Активні"],
                datasets: [{
                    data: [completionCount.completed, completionCount.active],
                    backgroundColor: ["#4CAF50", "#FF6384"],
                }]
            },
            options: {
                title: {
                    display: true,
                    text: "Аналітика завершених та активних задач"
                }
            }
        });
    }

    function displayPriorityChart(priorityCounters) {
        const priorityChartCanvas = document.getElementById("priorityChart").getContext("2d");

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

    function displayTimelineChart(cards) {
        const timelineChartCanvas = document.getElementById("timelineChart").getContext("2d");
    
        const chartData = cards.map(card => {
            const startTime = moment(card.datetime, "YYYY-MM-DDTHH:mm");
            const endTime = moment(card.completionDate, "DD.MM.YYYY, HH:mm:ss");
    
            // Перевірка, чи отримані коректні об'єкти moment та чи endTime більший або рівний startTime
            if (startTime.isValid() && endTime.isValid() && endTime.isSameOrAfter(startTime)) {
                const durationInHours = moment.duration(endTime.diff(startTime)).asHours();
                return { x: card.title, y: durationInHours };
            } else {
                console.error("Помилка у форматі дати/часу для картки або endTime менший за startTime:", card);
                return null;
            }
        }).filter(data => data !== null);
    
        new Chart(timelineChartCanvas, {
            type: "bar",
            data: {
                labels: chartData.map(data => data.x),
                datasets: [{
                    label: "Години виконання",
                    data: chartData.map(data => data.y),
                    backgroundColor: "rgba(75, 192, 192, 0.2)",
                    borderColor: "rgba(75, 192, 192, 1)",
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: "Години"
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: "Задачі"
                        }
                    }
                },
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }
    


    function getCardDataForAnalytics(callbackPriority, callbackColumn, callbackCompletion, callbackDuration, callbackTimeline) {
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

        const cards = [];

        database.collection("cards").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const cardData = doc.data();
                priorityCounters[cardData.priority]++;
                columnCounters[cardData.column]++;

                if (cardData.completed) {
                    completionCount.completed++;
                } else {
                    completionCount.active++;
                }

                cards.push(cardData);
            });

            callbackPriority(priorityCounters);
            callbackColumn(columnCounters);
            callbackCompletion(completionCount);
            callbackDuration(cards);
            callbackTimeline(cards);
        });
    }

    // Викликаємо функцію отримання даних для аналітики
    getCardDataForAnalytics(displayPriorityChart, displayColumnChart, displayCompletionChart, calculateAverageDuration, displayTimelineChart);
});
