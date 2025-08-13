import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getFirestore, collection, doc, getDoc, getDocs, query, where } from 'https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js';

const palavraDoDia = document.getElementById("palavraDoDia");
const anagrama1 = document.getElementById("p1");
const anagrama2 = document.getElementById("p2");
const anagrama3 = document.getElementById("p3");
const anagrama4 = document.getElementById("p4");
const anagrama5 = document.getElementById("p5");
const anagrama6 = document.getElementById("p6");

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
    const anagrama6Valor = data.anagrama6;

    palavraDoDia.textContent = palavra;
    anagrama1.textContent = anagrama1Valor;
    anagrama2.textContent = anagrama2Valor;
    anagrama3.textContent = anagrama3Valor;
    anagrama4.textContent = anagrama4Valor;
    anagrama5.textContent = anagrama5Valor;
    anagrama6.textContent = anagrama6Valor;
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
      console.log("Anagrama6: " + anagrama6Valor);
    });

  } catch (error) {
    console.error("Erro ao buscar dados:", error);
  }
}

buscarDados();


async function registrar(email, nome, senha) {
  try {
    const usuariosColecao = collection(db, "usuarios");
    const snapshot = await getDocs(usuariosColecao);

    let maiorId = 0; // pra descobrir a maior quantidade de id q ja tem pra cria um atual
    snapshot.forEach(doc => {
      const idNum = parseInt(doc.id);
      if (!isNaN(idNum) && idNum > maiorId) maiorId = idNum;
    });

    const novoId = (maiorId + 1).toString();

    await setDoc(doc(db, "usuarios", novoId), {
      email: email,
      nome: nome,
      senha: senha,
      tempo: null
    });

    alert("Usuário registrado com sucesso!");
  } catch (err) {
    alert("Erro ao registrar: " + err.message);
  }
}
async function login(email, senha) {
  try {
    const q = query(collection(db, "usuarios"), where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      alert("Usuário não encontrado!");
      return;
    }

    let usuarioEncontrado = false;
    querySnapshot.forEach((doc) => {
      if (doc.data().senha === senha) {
        usuarioEncontrado = true;
      }
    });

    if (usuarioEncontrado) {
      alert("Login realizado com sucesso!");
    } else {
      alert("Senha incorreta!");
    }
  } catch (err) {
    alert("Erro no login: " + err.message);
  }
}

window.EnviarRegistro = function () {
  const email = document.getElementById("emailRegistro").value;
  const nome = document.getElementById("nomeRegistro").value;
  const senha = document.getElementById("senhaRegistro").value;
  registrar(email, nome, senha);
};

window.EnviarLogin = function () {
  const email = document.getElementById("emailLogin").value;
  const senha = document.getElementById("senhaLogin").value;
  login(email, senha);
};

async function carregarRanking() {
  const rankingContainer = document.getElementById("ranking-container");
  rankingContainer.innerHTML = ""; // limpa antes de recarregar

  try {
    // Pega a coleção "usuarios" ordenada por pontuação (se quiser)
    const q = query(collection(db, "usuarios"), orderBy("pontuacao", "desc"));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      const dados = doc.data();

      // Cria div de cada jogador
      const item = document.createElement("div");
      item.classList.add("ranking-item");
      item.innerHTML = `
          <p><strong>Nome:</strong> ${dados.nome || "Sem nome"}</p>
          <p><strong>Time:</strong> ${dados.time || "Sem time"}</p>
        `;
      rankingContainer.appendChild(item);
    });
  } catch (erro) {
    console.error("Erro ao carregar ranking:", erro);
  }
}

