import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getFirestore, collection, doc, getDoc, getDocs, query, where, orderBy, setDoc, } from 'https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword,GoogleAuthProvider,signInWithPopup, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js';
// IA GEMINI
const API_KEY = "AIzaSyCMozEyqIb-VR62uMWtylxYpzNtTPxrzzQ"; 
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
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
const provider = new GoogleAuthProvider();

// GLOBAL PRA FACILITAR CHAMAR EM OUTRAS FUNÇÕES
const palavraDoDia = document.getElementById("palavraDoDia");
const anagrama1 = document.getElementById("p1");
const anagrama2 = document.getElementById("p2");
const anagrama3 = document.getElementById("p3");
const anagrama4 = document.getElementById("p4");
const anagrama5 = document.getElementById("p5");
const anagrama6 = document.getElementById("p6");
const listaAnagrama = [anagrama1, anagrama2, anagrama3, anagrama4, anagrama5, anagrama6];
// FUNÇÕES QUE EXISTEM PRA FACILITAR TRABALHO
window.FecharJanelaAbrirGaveta = function () {
  document.getElementById("ranking").classList.toggle("aberta");
  document.getElementById("divJogador").classList.toggle("aberta");
}
window.fecharX = function () {
  document.getElementById('Login').classList.add('oculto');
  document.getElementById('Registro').classList.add('oculto');
};
//////////////////// FLUXO ANAGRAMAS //////////////////////////////
window.buscarDadosFacil = async function(){

}








///////////////////////////////////////////////////////////////////////
async function MostrarDados() {
  try {
    const usuariosRef = collection(db, "usuarios");
    const q = query(usuariosRef, orderBy("tempo", "asc")); 
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
///////////// AUTENTICAÇÃO//////////////
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


window.LoginGoogle = async function(){
  auth.languageCode = 'pt';
   try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    console.log("Nome:", user.displayName);
    console.log("Email:", user.email);
    console.log("Foto:", user.photoURL);
    
    const docRef = doc(db, "usuarios", user.uid);
    const docSnap = await getDoc(docRef);
    let dados;

    if(!docSnap.exists()){
      await setDoc(docRef,{
        nome: user.displayName,
        email: user.email,
        foto: user.photoURL,
      });
      docSnap = await getDoc(docRef)
    }
  
    dados = docSnap.data();
    criarProprioPlacar(user.email); 
    fecharX();                        
    FecharJanelaAbrirGaveta();
    alert("Bem vindo!,"+user.displayName)
    return dados;

  } catch (err) {
    console.error("Erro ao logar:", err);
    throw err;
  }
}
//////////
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


