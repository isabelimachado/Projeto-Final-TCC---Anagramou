    // Import the functions you need from the SDKs you need
    import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
    import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-analytics.js";
    // TODO: Add SDKs for Firebase products that you want to use
    // https://firebase.google.com/docs/web/setup#available-libraries
  
    // Your web app's Firebase configuration
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    const firebaseConfig = {
      apiKey: "AIzaSyByESGl7b8-X74bPX3GXpArf5SixfEQ_Ew",
      authDomain: "anagramou.firebaseapp.com",
      projectId: "anagramou",
      storageBucket: "anagramou.firebasestorage.app",
      messagingSenderId: "518755435289",
      appId: "1:518755435289:web:b33e54e698718914323b88",
      measurementId: "G-BBQX4DEE5V"
    };
  
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const analytics = getAnalytics(app);
