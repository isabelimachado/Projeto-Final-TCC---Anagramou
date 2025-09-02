import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getFirestore, collection, doc, getDoc, getDocs, query, where, orderBy, setDoc,onSnapshot  } from 'https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword,GoogleAuthProvider,signInWithPopup, signOut, onAuthStateChanged,setPersistence, browserSessionPersistence,inMemoryPersistence,signInWithRedirect } from 'https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js';
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

let checagemJaAcertou = null;
// GLOBAL PRA FACILITAR CHAMAR EM OUTRAS FUNÇÕES
const palavraDoDia = document.getElementById("palavraDoDia");
const anagrama1 = document.getElementById("p1");
const anagrama2 = document.getElementById("p2");
const anagrama3 = document.getElementById("p3");
const anagrama4 = document.getElementById("p4");
const anagrama5 = document.getElementById("p5");
const anagrama6 = document.getElementById("p6");
const listaAnagrama = [anagrama1, anagrama2, anagrama3, anagrama4, anagrama5, anagrama6];
let usuario = null;
// FUNÇÕES QUE EXISTEM PRA FACILITAR TRABALHO
window.FecharJanelaAbrirGaveta = function () {
  document.getElementById("ranking").classList.toggle("aberta");
  document.getElementById("divJogador").classList.toggle("aberta");
}
window.fecharX = function () {
  document.getElementById('Login').classList.add('oculto');
  document.getElementById('Registro').classList.add('oculto');
};
window.mostrarInstrucoes = function() {
    document.getElementById('Instrucoes').classList.remove('oculto');
}

window.fecharInstrucoes = function() {
    document.getElementById('Instrucoes').classList.add('oculto');
}
window.fecharInstrucoes = function() {
    document.getElementById('Instrucoes').classList.add('oculto');
};
window.mostrarPerfil = function() {
    document.getElementById('Login').classList.remove('oculto');
};
window.fecharX = function() {
    document.getElementById('Login').classList.add('oculto');
    document.getElementById('Registro').classList.add('oculto');
};
window.mostrarRegistro = function() {
    document.getElementById('Registro').classList.remove('oculto');
    document.getElementById('Login').classList.add('oculto');
}
window.mostrarRanking = function() {
    document.getElementById("ranking").classList.toggle("aberta");
    document.getElementById("divJogador").classList.toggle("aberta");
}
window.fecharGaveta = function() {
    document.getElementById("ranking").classList.remove("aberta");
    document.getElementById("divJogador").classList.remove("aberta");
}
//////////////////// FLUXO ANAGRAMAS //////////////////////////////
window.buscarDados = async function(tipo){
  let databasePalavra = ""
  let databaseExemplo = ""
  if(tipo == 1){
    databasePalavra = "palavraDoDiaFacil"
    databaseExemplo = "descPalavraFacil"
  } 
  if(tipo == 2) {
    databasePalavra = "palavraDoDiaMedia"
    databaseExemplo = "descPalavraMedia"
  }
  if(tipo == 3) {
    databasePalavra = "palavraDoDiaDificil"
    databaseExemplo = "descPalavraDificil"
  }    
  const hoje = new Date().toISOString().split("T")[0];
  const exemplosDocRef = doc(db, databaseExemplo, hoje);
  const palavrasDocRef = doc(db, databasePalavra, hoje);
  try{
  const snapshotExemplos = await getDoc(exemplosDocRef)
  const snapshotPalavras = await getDoc(palavrasDocRef)

 if(!snapshotExemplos.exists() && !snapshotPalavras.exists() ){
   alert("Favor atualizar!");
   return
  }
    const exemplosData = snapshotExemplos.data();

    const exemplo1 = exemplosData.resumo1;
    const exemplo2 = exemplosData.resumo2;
    const exemplo3 = exemplosData.resumo3;
    const exemplo4 = exemplosData.resumo4;
    const exemplo5 = exemplosData.resumo5;
    const exemplo6 = exemplosData.resumo6;

    const exemplosPalavras= snapshotPalavras.data();

    const palavraPrincipal = exemplosPalavras.palavra;
    const anagrama1 = exemplosPalavras.anagrama1;
    const anagrama2 = exemplosPalavras.anagrama2;
    const anagrama3 = exemplosPalavras.anagrama3;
    const anagrama4 = exemplosPalavras.anagrama4;
    const anagrama5 = exemplosPalavras.anagrama5;
    const anagrama6 = exemplosPalavras.anagrama6;

  console.log(palavraPrincipal,exemplo1,exemplo2,exemplo3,exemplo4,exemplo5,exemplo6)
  console.log(anagrama1,anagrama2,anagrama3,anagrama4,anagrama5,anagrama6)
  MostrarPalavras(palavraPrincipal,anagrama1,anagrama2,anagrama3,anagrama4,anagrama5,anagrama6,exemplo1,exemplo2,exemplo3,exemplo4,exemplo5,exemplo6)
}catch(err){
  console.log("erro ao pegar anagramas e seus sinonimos")
  return ;
}
}

let listaAnagramas = [];
let listaAchou = [];
window.MostrarPalavras = async function(pPrincipal,a1,a2,a3,a4,a5,a6,e1,e2,e3,e4,e5,e6){
  palavraDoDia.textContent = pPrincipal.toUpperCase();
  anagrama1.textContent = e1.toLowerCase()
  anagrama2.textContent = e2.toLowerCase()
  anagrama3.textContent = e3.toLowerCase()
  anagrama4.textContent = e4.toLowerCase()
  anagrama5.textContent = e5.toLowerCase()
  anagrama6.textContent = e6.toLowerCase()

  listaAnagramas.push(a1)
  listaAnagramas.push(a2)
  listaAnagramas.push(a3)
  listaAnagramas.push(a4)
  listaAnagramas.push(a5)
  listaAnagramas.push(a6)
  console.log(listaAnagramas)
}
window.InputResposta = function() {
  const inputField = document.getElementById("input-jogar");
  const input = inputField.value.toLowerCase().trim();
  const idx = listaAnagramas.indexOf(input);

  if (idx !== -1) { 
    if (!listaAchou.includes(input)) {
      listaAchou.push(input);
      const pos = idx + 1; 
      const x = document.getElementById(`p${pos}`);
      const y = document.getElementById(`campos${pos}`);
      y.style.backgroundColor = "#0df940ff"
      y.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.25), 4px 4px 0px #0df940ff";
      x.textContent = input;
      x.style.animationName = "AnimPulando";
      y.style.animationName = "aoAcertar";
    } else {
      console.log("Já foi incluso!");
    }
  } else {
    alert("Resposta incorreta seu burro do!");
  }
  inputField.value = "";
};
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("input-jogar").addEventListener("keydown", function(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      InputResposta();
    }
  });
});
document.addEventListener("DOMContentLoaded", () => { 
    const input = document.getElementById("input-jogar");
    const tempo = document.getElementById("timeDisplay");
    let intervalo = null;
    let timer = 0;
    input.addEventListener("focus", () => {
        if (!intervalo) {
            intervalo = setInterval(() => {
                const min = Math.floor(timer / 60);
                const sec = timer % 60;
                tempo.textContent = `${min}:${sec < 10 ? '0' : ''}${sec}`;
                timer++;
                if (listaAchou.length === 6) {
                  checagemJaAcertou = true;
                  salvarResultado(tempo.textContent,checagemJaAcertou)
                    clearInterval(intervalo);
                    intervalo = null;
                }
            }, 1000);
        }
    });
});
///////////////////////////////////////////////////////////////////////
async function MostrarDados() {
  try {
    const usuariosRef = collection(db, "usuarios");
    const q = query(usuariosRef, orderBy("tempo", "asc")); 
    const querySnapshot = await getDocs(q);
    let posicao = 1; //variavel pra mostra posicao do jogador

    querySnapshot.forEach(doc => {
      const infos = doc.data();

      const divPlayer = document.createElement("div");
      divPlayer.id = "divJogador"; //div que fica o fundo com nome e tempo do jogador

      const posicaoSpan = document.createElement("span");
      posicaoSpan.className = "jogador-posicao"; //span pra mostra a posicao 
      
      if (posicao === 1) posicaoSpan.classList.add("primeiro"); //se tiver na posicao 1 vai adicionar na classe 1 e assim por diante
      else if (posicao === 2) posicaoSpan.classList.add("segundo");
      else if (posicao === 3) posicaoSpan.classList.add("terceiro");
      
      posicaoSpan.textContent = posicao; //coloca o conteudo da posicao dentro do span
      //aqui eh so informaçoes do jogador: tempo posicao e ome
      const infoDiv = document.createElement("div");

      const pNome = document.createElement("p");
      pNome.className = "jogador-nome";
      pNome.textContent = infos.nome;

      const pTempo = document.createElement("p");
      pTempo.className = "jogador-tempo";
      pTempo.textContent = infos.tempo;

      const containerFoto = document.createElement("div");
      containerFoto.style.width = "125px";
      containerFoto.style.height = "100px";
      containerFoto.style.borderRadius = "60px"
      containerFoto.style.position = "absolute";  
      containerFoto.style.right = "2px"; 

      const imagensAleatorias = ["imagensAleatorias/gatodandojoia.jpeg", "imagensAleatorias/imagempadrao.webp", "imagensAleatorias/sillycat.webp"]
      const fotoURL = infos.foto || imagensAleatorias[Math.floor(Math.random() * imagensAleatorias.length)];
      const pFoto = document.createElement("img");
      pFoto.src = fotoURL;
      pFoto.className = "foto-ranking"

      infoDiv.appendChild(pNome);
      infoDiv.appendChild(pTempo);
      
      divPlayer.appendChild(posicaoSpan);
      divPlayer.appendChild(infoDiv);
      divPlayer.appendChild(containerFoto)

      containerFoto.appendChild(pFoto)
      document.getElementById("ranking").appendChild(divPlayer);

      posicao++; // sempre vai ter mais posicoes
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
    let docSnap = await getDoc(docRef);
    let dados;

    if(!docSnap.exists()){
      await setDoc(docRef,{
        nome: user.displayName,
        email: user.email,
        foto: user.photoURL,
        tempo: document.getElementById("timeDisplay").textContent
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

function sair(){
  signOut(auth).then(() => {
    window.location.reload();
  })
}

auth.onAuthStateChanged(async (user) => {
  usuario = user;
  console.log(user);
  if (usuario) {
    document.getElementById("botao-iconeID").removeAttribute("onclick");
    document.getElementById("iconeEntrar").className = "fa-solid fa-arrow-right-from-bracket";
    document.getElementById("botao-iconeID").addEventListener("click", sair);
    criarProprioPlacar(user.email);

    const docRef = doc(db, "usuarios", user.uid);
    const docSnap = await getDoc(docRef);
    
  }
});
async function salvarResultado(guardarTempo,JaAcertou){
  if (!usuario) {
    console.log("Chamando janela pra registro!");
    mostrarPerfil();
    return;
  }
  const ref = doc(db, "usuarios",usuario.uid);
  try {
    await setDoc(ref, {
      tempo: guardarTempo,
      jaAcertouHoje : JaAcertou
    }, {merge: true});
    console.log("Atualizado!");
  } catch (err) {
    console.error("Erro ao atualizar:", err);
  }
}
window.addEventListener("beforeunload", () => {
  signOut(auth);
});
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