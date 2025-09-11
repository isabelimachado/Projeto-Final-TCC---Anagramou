import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getFirestore, collection, doc, getDoc, getDocs, query, where, orderBy, setDoc, onSnapshot } from 'https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, setPersistence, browserSessionPersistence, inMemoryPersistence, signInWithRedirect } from 'https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js';
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

let listaSinonimos =[];
let listaAnagramas = [];
let listaAchou = [];

let checagemJaAcertou = null;
let desistiu = false
let usuario = null;
let pontos = ""
// GLOBAL PRA FACILITAR CHAMAR EM OUTRAS FUNÇÕES
const palavraDoDia = document.getElementById("palavraDoDia");
const anagrama1 = document.getElementById("p1");
const anagrama2 = document.getElementById("p2");
const anagrama3 = document.getElementById("p3");
const anagrama4 = document.getElementById("p4");
const anagrama5 = document.getElementById("p5");
const anagrama6 = document.getElementById("p6");

if (window.location.pathname === "/index.html") {
  console.log("index.");
  pontos = "pontosFaceis"
}
if (window.location.pathname === "/anagramaMedio.html") {
  console.log("medio.");
  pontos = "pontosMedios"
}
if (window.location.pathname === "/anagramaDificil.html") {
  console.log("dificil.");
  pontos = "pontosDificies"
}

// FUNÇÕES QUE EXISTEM PRA FACILITAR TRABALHO
window.FecharJanelaAbrirGaveta = function () {
  document.getElementById("ranking").classList.toggle("aberta");
  document.getElementById("divJogador").classList.toggle("aberta");
}
window.fecharX = function () {
  document.getElementById('Login').classList.add('oculto');
  document.getElementById('Registro').classList.add('oculto');
};
window.mostrarInstrucoes = function () {
  document.getElementById('Instrucoes').classList.remove('oculto');
}
window.fecharInstrucoes = function () {
  document.getElementById('Instrucoes').classList.add('oculto');
}
window.fecharInstrucoes = function () {
  document.getElementById('Instrucoes').classList.add('oculto');
};
window.mostrarPerfil = function () {
  document.getElementById('Login').classList.remove('oculto');
};
window.fecharX = function () {
  document.getElementById('Login').classList.add('oculto');
  document.getElementById('Registro').classList.add('oculto');
};
window.mostrarRegistro = function () {
  document.getElementById('Registro').classList.remove('oculto');
  document.getElementById('Login').classList.add('oculto');
}
window.mostrarRanking = function () {
  document.getElementById("ranking").classList.toggle("aberta");
  document.getElementById("divJogador").classList.toggle("aberta");
}
window.fecharGaveta = function () {
  document.getElementById("ranking").classList.remove("aberta");
  document.getElementById("divJogador").classList.remove("aberta");
}
window.jogarConfetes = function () {
  const emotes = ["🎉", "🏆", "🎊"];
  for (let i = 0; i < 75; i++) {
    const emote = document.createElement("div");
    emote.textContent = emotes[Math.floor(Math.random() * emotes.length)];
    emote.style.position = "fixed";
    emote.style.left = Math.random() * 100 + "vw";
    emote.style.top = "-50px";
    emote.style.fontSize = "2rem";
    emote.style.animation = `cair ${2 + Math.random() * 3}s linear forwards`;
    document.body.appendChild(emote);

    setTimeout(() => emote.remove(), 5000);
  }
}
window.retornarPalavras = function () {
  document.getElementById("campos1").style.display = "flex";
  document.getElementById("campos2").style.display = "flex";
  document.getElementById("campos3").style.display = "flex";
  document.getElementById("campos4").style.display = "flex";
  document.getElementById("campos5").style.display = "flex";
  document.getElementById("campos6").style.display = "flex";
  const container = document.getElementById("divdobrayan");
  container.style.animationName = "aoAcertar";
}
//////////////////// FLUXO ANAGRAMAS //////////////////////////////
window.buscarDados = async function (tipo) {
  let databasePalavra = ""
  let databaseExemplo = ""
  if (tipo == 1) {
    databasePalavra = "palavraDoDiaFacil"
    databaseExemplo = "descPalavraFacil"
  }
  if (tipo == 2) {
    databasePalavra = "palavraDoDiaMedia"
    databaseExemplo = "descPalavraMedia"
  }
  if (tipo == 3) {
    databasePalavra = "palavraDoDiaDificil"
    databaseExemplo = "descPalavraDificil"
  }
  const hoje = new Date().toISOString().split("T")[0];
  const exemplosDocRef = doc(db, databaseExemplo, hoje);
  const palavrasDocRef = doc(db, databasePalavra, hoje);
  try {
    const snapshotExemplos = await getDoc(exemplosDocRef)
    const snapshotPalavras = await getDoc(palavrasDocRef)

    if (!snapshotExemplos.exists() && !snapshotPalavras.exists()) {
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

    const exemplosPalavras = snapshotPalavras.data();

    const palavraPrincipal = exemplosPalavras.palavra;
    const anagrama1 = exemplosPalavras.anagrama1;
    const anagrama2 = exemplosPalavras.anagrama2;
    const anagrama3 = exemplosPalavras.anagrama3;
    const anagrama4 = exemplosPalavras.anagrama4;
    const anagrama5 = exemplosPalavras.anagrama5;
    const anagrama6 = exemplosPalavras.anagrama6;
    MostrarPalavras(palavraPrincipal, anagrama1, anagrama2, anagrama3, anagrama4, anagrama5, anagrama6, exemplo1, exemplo2, exemplo3, exemplo4, exemplo5, exemplo6)
  } catch (err) {
    console.log("erro ao pegar anagramas e seus sinonimos")
    return;
  }
}
window.MostrarPalavras = async function (pPrincipal, a1, a2, a3, a4, a5, a6, e1, e2, e3, e4, e5, e6) {
  palavraDoDia.textContent = pPrincipal.toUpperCase();
/*   anagrama1.textContent = e1.toLowerCase()
  anagrama2.textContent = e2.toLowerCase()
  anagrama3.textContent = e3.toLowerCase()
  anagrama4.textContent = e4.toLowerCase()
  anagrama5.textContent = e5.toLowerCase()
  anagrama6.textContent = e6.toLowerCase() */
  
  listaSinonimos.push(e1)
  listaSinonimos.push(e2)
  listaSinonimos.push(e3)
  listaSinonimos.push(e4)
  listaSinonimos.push(e5)
  listaSinonimos.push(e6)

  listaAnagramas.push(a1)
  listaAnagramas.push(a2)
  listaAnagramas.push(a3)
  listaAnagramas.push(a4)
  listaAnagramas.push(a5)
  listaAnagramas.push(a6)
  console.log("Lista dos anagramas:"+listaAnagramas)
  console.log("Lista dos sinonimos:"+listaSinonimos)
}
window.desistir = function(){
  desistiu = true;
  for(let i = 0; i < 6 ; i++){
    const y = document.getElementById(`campos${1 + i}`);
    if(y.style.backgroundColor !== "rgb(13, 249, 64)"){
      document.getElementById(`p${i + 1}`).textContent = listaAnagramas[i].toLowerCase();
        y.style.backgroundColor = "#ff4545bf";
        y.style.animationName = "aoDesistir"
        y.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.25), 4px 4px 0px #ff4545bf";
    }
  }
}
window.InputResposta = function() {
  if(desistiu){
    document.getElementById("input-jogar").addEventListener("mousedown", function(e) {
      this.disabled = true;
    });
    return}
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
    console.log("Resposta incorreta !");
  }
  inputField.value = "";
};
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("input-jogar").addEventListener("keydown", function (e) {
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
          let container = document.getElementById("divdobrayan");
          if(container){
            console.log("existe")
          }else{
            console.log("nao existe")
          }
          container.style.animationName = "aoAcertar";
          document.getElementById("campos1").style.display = "none";
          document.getElementById("campos2").style.display = "none";
          document.getElementById("campos3").style.display = "none";
          document.getElementById("campos4").style.display = "none";
          document.getElementById("campos5").style.display = "none";
          document.getElementById("campos6").style.display = "none";
          jogarConfetes();
          const novo = document.createElement("span")
          container.appendChild(novo)
          novo.classList.add("novoclasse");
          novo.textContent = "✨PARABÉNS✨"
          setTimeout(() => retornarPalavras(), 2000);
          setTimeout(() => container.removeChild(novo), 2000)
          setTimeout(() => salvarResultado(tempo.textContent, checagemJaAcertou, pontos), 4000);
          clearInterval(intervalo);
          intervalo = null;
        }
      }, 1000);
    }
  });
});
///////////////////////////////////////////////////////////////////////
window.MostrarDados = async function (id) { // função do ranking
  let colecao = ""
  switch (id) {
    case 1:
      colecao = "pontosFaceis"
      break;
    case 2:
      colecao = "pontosMedio"
      break;
    case 3:
      colecao = "pontosDificil"
      break;
  }
  try {
    const usuariosRef = collection(db, "usuarios");
    const q = query(usuariosRef, orderBy(colecao, "desc"));
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
      if(posicao === 1) {
        posicaoSpan.textContent = "🥇"
      }
      else if(posicao === 2) {
        posicaoSpan.textContent = "🥈"
      }
      else if(posicao === 3) {
        posicaoSpan.textContent = "🥉"
      }else{
        posicaoSpan.textContent = posicao;
      }
      //coloca o conteudo da posicao dentro do span
      //aqui eh so informaçoes do jogador: tempo posicao e ome
      const infoDiv = document.createElement("div");

      const pNome = document.createElement("p");
      pNome.className = "jogador-nome";
      pNome.textContent = infos.nome;

      const pTempo = document.createElement("p");
      pTempo.className = "jogador-tempo";
      pTempo.textContent = "Pontos: "+infos[colecao];

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
      divPlayer.style.backgroundColor = "#fff";

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
/* email, nome, senha, tempo,seAcertou,totalPontos,1 */
async function registro(email, nome, senha, tempo, seAcertou, totalPontos,id) {     
  const mensagemErro = document.getElementById("mensagemErroRegistro");
  mensagemErro.textContent = "";
  mensagemErro.classList.remove("ativo");
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
    const user = userCredential.user;
    if(id === 1){
      await setDoc(doc(db, "usuarios", user.uid), { 
      nome : nome ,
      tempo : tempo,
      email : email,
      seAcertou: seAcertou,
      pontosFaceis : totalPontos
      });      
    }
    if(id === 2){
      await setDoc(doc(db, "usuarios", user.uid), { 
      nome : nome ,
      tempo : tempo,
      email : email,
      seAcertou: seAcertou,
      pontosMedios : totalPontos
      });      
    }
    if(id === 3){
      await setDoc(doc(db, "usuarios", user.uid), { 
      nome : nome ,
      tempo : tempo,
      email : email,
      seAcertou: seAcertou,
      pontosDificies : totalPontos
      });      
    }

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

window.LoginGoogle = async function () {
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

    if (!docSnap.exists()) {
      await setDoc(docRef, {
        nome: user.displayName,
        email: user.email,
        foto: user.photoURL,
        tempo: document.getElementById("timeDisplay").textContent,
        seAcertou: checagemJaAcertou
      });
      docSnap = await getDoc(docRef)
    }

    dados = docSnap.data();
    criarProprioPlacar(user.email);
    fecharX();
    FecharJanelaAbrirGaveta();
    alert("Bem vindo!," + user.displayName)
    return dados;

  } catch (err) {
    console.error("Erro ao logar:", err);
    throw err;
  }
}
function sair() {
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
  }
});

async function salvarResultado(guardarTempo, JaAcertou, id) {
  if (!usuario) {
    console.log("Chamando janela pra registro!");
    mostrarPerfil();
    return;
  }
  
  let totalPontos = 0
  const tempo = document.getElementById("timeDisplay").textContent;
  const [min, sec] = tempo.split(":").map(Number)
  const totalSegundos = min * 60 + sec
  const auxPontos = totalPontos
  if(!desistiu && listaAchou.length === 6){
    totalPontos = auxPontos * (listaAchou.length * 1000) - (totalSegundos * 0.25); 
  }else if(desistiu && listaAchou.length >=1){
    totalPontos = auxPontos * (listaAchou.length * 1000) - (totalSegundos * 0.25);
  }else{
    console.log("Desistiu e não colocou nada!")
  }
  const ref = doc(db, "usuarios", usuario.uid);
  try {
    if(id === "pontosFaceis"){
       await setDoc(ref, {
      tempo: guardarTempo,
      jaAcertouHoje: JaAcertou,
      pontosFaceis: totalPontos
      }, { merge: true });
      console.log("Atualizado!");
    }
    if(id === "pontosMedios"){
      await setDoc(ref, {
     tempo: guardarTempo,
     jaAcertouHoje: JaAcertou,
     pontosFaceis: totalPontos
     }, { merge: true });
     console.log("Atualizado!");
   }
   if(id === "pontosDificies"){
    await setDoc(ref, {
   tempo: guardarTempo,
   jaAcertouHoje: JaAcertou,
   pontosFaceis: totalPontos
   }, { merge: true });
   console.log("Atualizado!");
 }
  } catch (err) {
    console.error("Erro ao atualizar:", err);
  }
}

window.addEventListener("beforeunload", () => {
  signOut(auth);
});

window.EnviarRegistro = function (id) {
  const email = document.getElementById("emailRegistro").value;
  const nome = document.getElementById("nomeRegistro").value;
  const senha = document.getElementById("senhaRegistro").value;
  const tempo = document.getElementById("timeDisplay").textContent;
  const seAcertou = checagemJaAcertou;
  let totalPontos = 0
  const [min, sec] = tempo.split(":").map(Number)
  const totalSegundos = min * 60 + sec
  const auxPontos = totalPontos
  if(!desistiu && listaAchou.length === 6){
    totalPontos = auxPontos * (listaAchou.length * 1000) - (totalSegundos * 0.25); 
  }else if(desistiu && listaAchou.length >=1){
    totalPontos = auxPontos * (listaAchou.length * 1000) - (totalSegundos * 0.25);
  }else{
    console.log("Desistiu e não colocou nada!")
  }
  registro(email, nome, senha, tempo,seAcertou,totalPontos,id);
};

window.EnviarLogin = function () {
  const email = document.getElementById("emailLogin").value;
  const senha = document.getElementById("senhaLogin").value;
  login(email, senha);
};
window.dica = function(){
  let lista = [1, 2, 3, 4, 5, 6];
  let camposVazios = lista.filter(i => {
    const elementoAleatorio = document.getElementById(`p${i}`);
    return elementoAleatorio && elementoAleatorio.textContent === "";
  });
  if (camposVazios.length === 0) {
    alert("As dicas já foram usadas!");
    return;
  }
  const randomIndice = camposVazios[Math.floor(Math.random() * camposVazios.length)];
  const campo = document.getElementById(`p${randomIndice}`);
  campo.textContent = listaSinonimos[randomIndice - 1].toLowerCase();
  campo.style.animationName = "aoAcertar"
}