// Отримання посилання на колекцію "messages"
  var messagesCollection = database.collection("messages");

  messagesCollection.get().then((querySnapshot) => {
    var numberOfMessages = querySnapshot.size;

    // Оновлення HTML з кількістю повідомлень або приховання/відображення лічильника
    var messageCountElement = document.getElementById("messageCount");

    if (numberOfMessages > 0) {
      messageCountElement.innerHTML = numberOfMessages;
      messageCountElement.style.display = "inline"; // Відображення лічильника
    } else {
      messageCountElement.style.display = "none"; // Приховання лічильника
    }
  });

