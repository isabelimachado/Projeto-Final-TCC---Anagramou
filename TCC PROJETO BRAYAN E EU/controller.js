import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getFirestore, collection, getDocs, query, limit } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyByESGl7b8-X74bPX3GXpArf5SixfEQ_Ew",
  authDomain: "anagramou.firebaseapp.com",
  projectId: "anagramou",
  storageBucket: "anagramou.firebasestorage.app",
  messagingSenderId: "518755435289",
  appId: "1:518755435289:web:b33e54e698718914323b88",
  measurementId: "G-BBQX4DEE5V"
};

// Inicializa Firebase e Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function carregarPalavraDoDia() {
  const palavradoDiaRef = collection(db, "palavradoDia");
  const q = query(palavradoDiaRef, limit(1));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    document.getElementById("palavra").textContent = "Nenhuma palavra encontrada.";
    return;
  }

  snapshot.forEach(doc => {
    const data = doc.data();
    document.getElementById("palavra").textContent = data.palavra || "Sem palavra";
    
    const ul = document.getElementById("anagramas");
    ul.innerHTML = ""; // limpa lista

    // garante que anagramas é array
    let anagramas = data.anagramas;
    if (!Array.isArray(anagramas)) {
      anagramas = Object.values(anagramas || {});
    }

    anagramas.forEach(a => {
      const li = document.createElement("li");
      li.textContent = a;
      ul.appendChild(li);
    });
  });
}

// Quando a página carregar, busca e exibe os dados
window.addEventListener("DOMContentLoaded", carregarPalavraDoDia);
