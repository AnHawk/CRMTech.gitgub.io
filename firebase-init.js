// firebase-init.js
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
