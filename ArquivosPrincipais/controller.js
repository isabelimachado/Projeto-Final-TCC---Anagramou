import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getFirestore, collection, doc, getDoc, getDocs, query, where } from 'https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js';

const palavraDoDia = document.getElementById("palavraDoDia");
const anagrama1 = document.getElementById("p1");
const anagrama2 = document.getElementById("p2");
const anagrama3 = document.getElementById("p3");
const anagrama4 = document.getElementById("p4");
const anagrama5 = document.getElementById("p5");

const firebaseConfig = {
  apiKey: "AIzaSyByESGl7b8-X74bPX3GXpArf5SixfEQ_Ew",
  authDomain: "anagramou.firebaseapp.com",
  projectId: "anagramou",
  storageBucket: "anagramou.firebasestorage.app",
  messagingSenderId: "518755435289",
  appId: "1:518755435289:web:b33e54e698718914323b88",
  measurementId: "G-BBQX4DEE5V"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function buscarDados() {
  const hoje = new Date().toISOString().split('T')[0];
  const docRef = doc(db, "palavraDoDia", hoje);

  try {
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      palavraDoDia.textContent = "Não atualizado ainda!";
      return;
    }

    const data = docSnap.data();
    const palavra = data.palavra;
    const anagrama1Valor = data.anagrama1;
    const anagrama2Valor = data.anagrama2;
    const anagrama3Valor = data.anagrama3;
    const anagrama4Valor = data.anagrama4;
    const anagrama5Valor = data.anagrama5;

    palavraDoDia.textContent = palavra;
    anagrama1.textContent = anagrama1Valor;
    anagrama2.textContent = anagrama2Valor;
    anagrama3.textContent = anagrama3Valor;
    anagrama4.textContent = anagrama4Valor;
    anagrama5.textContent = anagrama5Valor;

    const pesquisa = query(
      collection(db, "ANAGRAMOU!"),
      where("palavraDoDia", "==", palavra)
    );

    const querySnapshot = await getDocs(pesquisa);

    querySnapshot.forEach((doc) => {
      const dados = doc.data();
      const palavra = dados.palavra;
      console.log("Palavra do dia:" + palavra);

      console.log("Anagrama1: " + anagrama1Valor);
      console.log("Anagrama2: " + anagrama2Valor);
      console.log("Anagrama3: " + anagrama3Valor);
      console.log("Anagrama4: " + anagrama4Valor);
      console.log("Anagrama5: " + anagrama5Valor);
    });

  } catch (error) {
    console.error("Erro ao buscar dados:", error);
  }
}

buscarDados();
