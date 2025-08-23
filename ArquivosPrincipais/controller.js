import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getFirestore, collection, doc, getDoc, getDocs, query, where, orderBy, setDoc, } from 'https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js';
// FUNÇÃO DA PALAVRA DO DIA//
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
const auth = getAuth(app)

const palavraDoDia = document.getElementById("palavraDoDia");
const anagrama1 = document.getElementById("p1");
const anagrama2 = document.getElementById("p2");
const anagrama3 = document.getElementById("p3");
const anagrama4 = document.getElementById("p4");
const anagrama5 = document.getElementById("p5");
const anagrama6 = document.getElementById("p6");

//
let usuarioEncontrado = false;
//
// FUNÇÕES QUE EXISTEM PRA FACILITAR TRABALHO
window.FecharJanelaAbrirGaveta = function () {
  document.getElementById("ranking").classList.toggle("aberta");
  document.getElementById("divJogador").classList.toggle("aberta");
}
window.fecharX = function () {
  document.getElementById('Login').classList.add('oculto');
  document.getElementById('Registro').classList.add('oculto');
};
//
window.buscarDadosFacil = async function () {
  const hoje = new Date().toISOString().split('T')[0];
  const docRef = doc(db, "palavraDoDiaFacil", hoje);

  try {
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      palavraDoDia.textContent = "Nada";
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

    palavraDoDia.textContent = palavra.toUpperCase();
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
    })
  } catch (error) {
    console.error("Erro ao buscar dados:", error);
  }
}

window.buscarDadosMedio = async function () {
  const hoje = new Date().toISOString().split('T')[0];
  const docRef = doc(db, "palavraDoDiaMedia", hoje);

  try {
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      palavraDoDia.textContent = "nada";
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

    palavraDoDia.textContent = palavra.toUpperCase();
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
    })
  } catch (error) {
    console.error("Erro ao buscar dados:", error);
  }
}

window.buscarDadosDificil = async function () {
  const hoje = new Date().toISOString().split('T')[0];
  const docRef = doc(db, "palavraDoDiaDificil", hoje);

  try {
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      palavraDoDia.textContent = "nada";
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

    palavraDoDia.textContent = palavra.toUpperCase();
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
    })
  } catch (error) {
    console.error("Erro ao buscar dados:", error);
  }
}

async function MostrarDados() {
  try {
    const usuariosRef = collection(db, "usuarios");
    const q = query(usuariosRef, orderBy("tempo", "asc")); // decrescente
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach(doc => {
      const infos = doc.data();

      // cria div e elementos
      const divPlayer = document.createElement("div");
      divPlayer.id = "divJogador";

      const pNome = document.createElement("p");
      pNome.textContent = infos.nome;

      const pTempo = document.createElement("p");
      pTempo.textContent = infos.tempo;

      divPlayer.appendChild(pNome);
      divPlayer.appendChild(pTempo);

      document.getElementById("ranking").appendChild(divPlayer);
    });
  } catch (err) {
    console.error("Achei nada!!", err);
  }
}
MostrarDados();

async function criarProprioPlacar(email) {
  try {
    const pesquisa = query(collection(db, "usuarios"), where("email", "==", email));
    const snapshot = await getDocs(pesquisa);
    snapshot.forEach(doc => {
      const dados = doc.data();
      const nome = dados.nome;
      const tempo = dados.tempo;
      const divPlayer = document.createElement("div");
      divPlayer.id = "divJogador";
      divPlayer.style.backgroundColor = "#15ff00ff";

      const pNome = document.createElement("p");
      pNome.textContent = "SEU RECORDE:\n" + nome;
      pNome.style.whiteSpace = "pre-line";

      const pTempo = document.createElement("p");
      pTempo.textContent = tempo;

      divPlayer.appendChild(pNome);
      divPlayer.appendChild(pTempo);

      document.getElementById("ranking").appendChild(divPlayer);
    })
  } catch (error) {
    console.log("erro")
  }
}

export function errorFirebase(code) {
  switch (code) {
    case 'auth/invalid-email':
      return 'O email está em um formato inválido.';
    case 'auth/user-not-found':
      return 'Usuário não encontrado. Verifique o email.';
    case 'auth/invalid-credential':
      return 'Senha incorreta. Tente novamente.';
    case 'auth/email-already-in-use':
      return 'Este email já está em uso.';
    case 'auth/weak-password':
      return 'A senha precisa ter pelo menos 6 caracteres.';
    case 'auth/too-many-requests':
      return 'Muitas tentativas. Tente novamente mais tarde.';
    case 'auth/missing-password':
      return 'Digite a senha.';
    default:
      return `Erro ao autenticar: ${code}`;
  }
}

async function registro(email, nome, senha, tempo) {
  const mensagemErro = document.getElementById("mensagemErroRegistro");
  mensagemErro.textContent = "";
  mensagemErro.classList.remove("ativo");

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
    const user = userCredential.user;
    await setDoc(doc(db, "usuarios", user.uid), { nome, tempo, email });

    mensagemErro.textContent = "Usuário registrado com sucesso!";
    mensagemErro.style.backgroundColor = "#52c41a"; // verde sucesso
    mensagemErro.classList.add("ativo");

  } catch (error) {
    const msg = errorFirebase(error.code);
    mensagemErro.textContent = msg;
    mensagemErro.classList.add("ativo");
    console.log("Erro no registro: " + msg);
  }

  setTimeout(() => {
    mensagemErro.classList.remove("ativo");
    mensagemErro.textContent = "";
  }, 4000);
}

async function login(email, senha) {
  const mensagemErro = document.getElementById("mensagemErroLogin");
  mensagemErro.textContent = "";
  mensagemErro.classList.remove("ativo");

  try {
    const auth = getAuth();
    const userCredential = await signInWithEmailAndPassword(auth, email, senha);
    const user = userCredential.user;

    const docRef = doc(db, "usuarios", user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const dados = docSnap.data();
      criarProprioPlacar(email);
      fecharX();
      FecharJanelaAbrirGaveta();

      mensagemErro.style.backgroundColor = "#52c41a"; // verde sucesso
      mensagemErro.textContent = `Bem-vindo, ${dados.nome}!`;
      mensagemErro.classList.add("ativo"); //isso se der certo login

      setTimeout(() => {
        mensagemErro.classList.remove("ativo");
      }, 3000); //tempo da mensagem sumir

      return dados;
    }
  } catch (error) {
    const msg = errorFirebase(error.code);
    mensagemErro.textContent = msg;
    mensagemErro.classList.add("ativo");
    console.log("Erro no login: " + msg);
  }
}


window.EnviarRegistro = function () {
  const email = document.getElementById("emailRegistro").value;
  const nome = document.getElementById("nomeRegistro").value;
  const senha = document.getElementById("senhaRegistro").value;
  const tempo = document.getElementById("timeDisplay").textContent;
  registro(email, nome, senha, tempo);
};

window.EnviarLogin = function () {
  const email = document.getElementById("emailLogin").value;
  const senha = document.getElementById("senhaLogin").value;
  login(email, senha);
};

