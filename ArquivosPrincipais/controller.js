// Chamada do firebase e APIs relacionadas:
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getFirestore, collection, doc, getDoc, query, where, orderBy, setDoc, onSnapshot,deleteDoc  } from 'https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js';
import { createUserWithEmailAndPassword, deleteUser, getAuth, onAuthStateChanged, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signOut,sendPasswordResetEmail  } from 'https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js';

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
let globalUser = null
const provider = new GoogleAuthProvider();


/////////////////////////////////////////////////////////////

//////////////-VARIAVEIS E FUNÇÕES GLOBAIS-////////////
let tipoPonto = ""
let destinoPontosPagina = ""
let paginaAtual = ""
let databaseAtual = ""
let databaseSinonimos = ""
let usuarioDesistiu = false
let timer = 0
let contadordicas = 0
let jaRegistrou = false

const imagensAleatorias = [
  "imagensAleatorias/gatodandojoia.jpeg",
  "imagensAleatorias/cachorroSalsicha.jpg",
  "imagensAleatorias/sillycat.webp",
  "imagensAleatorias/cachorroSorridente.jpg",
  "imagensAleatorias/cachorroengraçado.avif",
  "imagensAleatorias/gatoLinguarudo.jpg",
  "imagensAleatorias/gatoEngracado.jpg"
]

// dia de hoje
const hoje = new Date();
const diaAtual = new Intl.DateTimeFormat('pt-BR').format(hoje).replace(/\//g, '-');

const botoes = document.querySelectorAll(".botao-dificuldade");

if (window.location.pathname.includes("index.html") || window.location.pathname === "/") {
  tipoPonto = "pontosFaceis"
  destinoPontosPagina = "JaAcertouHojeFacil"
  paginaAtual = "facil"
  databaseAtual = "palavraDoDiaFacil"
  databaseSinonimos = "descPalavraFacil"
  botoes[0].style.backgroundColor = "#b8b6b6"
}
if (window.location.pathname.includes("anagramaMedio.html")) {
  tipoPonto = "pontosMedios"
  destinoPontosPagina = "JaAcertouHojeMedio"
  paginaAtual = "medio"
  databaseAtual = "palavraDoDiaMedia"
  databaseSinonimos = "descPalavraMedia"
  botoes[1].style.backgroundColor = "#b8b6b6"
}
if (window.location.pathname.includes("anagramaDificil.html")) {
  tipoPonto = "pontosDificies"
  destinoPontosPagina = "JaAcertouHojeDificil"
  paginaAtual = "dificil"
  databaseAtual = "palavraDoDiaDificil"
  databaseSinonimos = "descPalavraDificil"
  botoes[2].style.backgroundColor = "#b8b6b6"
}

let listaVariaveis = [tipoPonto, destinoPontosPagina, paginaAtual, databaseAtual, databaseSinonimos, diaAtual]

window.variaveisAtuais = function () {
  for (let i = 0; i < listaVariaveis.length; i++) {
    console.log("variavel:" + (listaVariaveis[i]))
  }
}

let casosInteracaoUsuario = 0

window.apertarBotao = function (parametro) {
  casosInteracaoUsuario = parametro
  mudarEstado()
}

window.mudarEstado = function () {
  switch (casosInteracaoUsuario) {
    case 1: // FecharJanelaAbrirGaveta
      document.getElementById("ranking").classList.toggle("aberta")
      document.getElementById("divJogador").classList.toggle("aberta")
      break;
    case 2: // fecharX
      document.getElementById('Login').classList.add('oculto');
      document.getElementById('Registro').classList.add('oculto');
      break;
    case 3: // mostrarInstrucoes
      document.getElementById('Instrucoes').classList.remove('oculto');
      break;
    case 4: // fecharInstrucoes
      document.getElementById('Instrucoes').classList.add('oculto');
      break;
    case 5: // mostrarPerfil
      document.getElementById('Login').classList.remove('oculto');
      break;
    case 6: // mostrarRegistro
      document.getElementById('Registro').classList.remove('oculto');
      document.getElementById('Login').classList.add('oculto');
      break;
    case 7: // mostrarRanking
      document.getElementById("ranking").classList.toggle("aberta");
      break;
    case 8: // fecharGaveta
      document.getElementById("ranking").classList.remove("aberta");
      break;
    case 9: //abrirPlacarProprio
      if(!globalUser){ mostrarMensagem("Faça login para acessar o placar!",1); return}
      document.getElementById("placarProprio").classList.add("aberto");
      break;
    case 10: // fecharPlacarProprio
      document.getElementById("placarProprio").classList.remove("aberto");
      break;
    case 11: // abrir modal
      document.getElementById("modalImagens").classList.add("ativo")
      break
    case 12: // fechar modal
      document.getElementById("modalImagens").classList.remove("ativo")
      break
    case 13:
      document.getElementById("confirmardeletar").classList.add("ativo");
      break;
    case 14:
      document.getElementById("confirmardeletar").classList.remove("ativo");
      break;
    case 15:
      document.getElementById("confirmardeletar").classList.add("ativo"); // abrir confirmação
      break
    case 16:
      document.getElementById("confirmardeletar").classList.remove("ativo"); // fechar confirmação
      break
    default:
      console.log("Nada ocorreu ainda!")
  }
}
////////////////////////////////////////////

///// FUNÇÕES IMPORTANTES PARA FLUXO DO JOGO //////
let listaAnagramas = []
let listaSinonimos = []
let listaAchou = []

window.buscarDados = async function () { // feito
  const refSinonimos = doc(db, databaseSinonimos, diaAtual);
  const refPalavras = doc(db, databaseAtual, diaAtual);
  const snapSin = await getDoc(refSinonimos)
  const snapPalavras = await getDoc(refPalavras)
  try {
    if (!snapSin.exists() && !snapPalavras.exists()) {
      alert("O backend ainda não foi rodado!")
      return
    }
    const exemplosInfo = snapSin.data()
    const palavrasInfo = snapPalavras.data()

    const palavraPrincipal = palavrasInfo.palavra;

    const exemplo1 = exemplosInfo.resumo1;
    const exemplo2 = exemplosInfo.resumo2;
    const exemplo3 = exemplosInfo.resumo3;
    const exemplo4 = exemplosInfo.resumo4;
    const exemplo5 = exemplosInfo.resumo5;
    const exemplo6 = exemplosInfo.resumo6;

    const anagrama1 = palavrasInfo.anagrama1;
    const anagrama2 = palavrasInfo.anagrama2;
    const anagrama3 = palavrasInfo.anagrama3;
    const anagrama4 = palavrasInfo.anagrama4;
    const anagrama5 = palavrasInfo.anagrama5;
    const anagrama6 = palavrasInfo.anagrama6;

    MostrarPalavras(palavraPrincipal, anagrama1, anagrama2, anagrama3, anagrama4, anagrama5, anagrama6, exemplo1, exemplo2, exemplo3, exemplo4, exemplo5, exemplo6)
  } catch (err) {
    console.log("Algum erro aconteceu ao tentar pegar palavras e seus sinônimos" + "Erro:" + err)
  }
}

window.MostrarPalavras = function (pPrincipal, a1, a2, a3, a4, a5, a6, e1, e2, e3, e4, e5, e6) { // feito
  document.getElementById("palavraDoDia").textContent = pPrincipal
  listaAnagramas = [a1, a2, a3, a4, a5, a6]
  listaSinonimos = [e1, e2, e3, e4, e5, e6]
  console.log("Palavra principal:" + pPrincipal)
  console.log("Lista de anagramas:" + listaAnagramas)
  console.log("Lista de sinônimos:" + listaSinonimos)
}

window.InputResposta = function () {  // feito
  const campodeInput = document.getElementById("input-jogar");
  const input = campodeInput.value.toLowerCase().trim();
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
      mostrarMensagem("Já foi incluso!",1)
    }
  } else {
    console.log("Resposta incorreta !");
  }
  campodeInput.value = "";
}

window.tempoFunc = function () {
  const tempo = document.getElementById("timeDisplay")
  const min = Math.floor(timer / 60);
  const sec = timer % 60
  tempo.textContent = `${min}:${sec < 10 ? '0' : ''}${sec}`;
  timer += 1
  calcularPontos(timer)
  return timer
}

const camposComDica = new Set();

window.dica = function () {
  let listadecampos = [1, 2, 3, 4, 5, 6];
  let camposVazios = listadecampos.filter(i => {
    const elementoAleatorio = document.getElementById(`p${i}`);
    return elementoAleatorio && elementoAleatorio.textContent === "";
  });
  
  if (camposVazios.length === 0) {
    mostrarMensagem("As dicas já foram usadas!!",2)
    return;
  }
  
  const randomIndice = camposVazios[Math.floor(Math.random() * camposVazios.length)];
  const campo = document.getElementById(`p${randomIndice}`);
  campo.textContent = listaSinonimos[randomIndice - 1].toLowerCase();
  campo.style.animationName = "aoAcertar";
  
  camposComDica.add(campo);
  
  contadordicas += 1;
  
  aplicarEstilosDica(campo);
  campo.parentElement.style.animationName = "aoPedirDica";
}

function aplicarEstilosDica(campo) {
  const temaAtual = document.body.getAttribute('data-theme');
  
  if (temaAtual === 'dark') {
    campo.parentElement.style.backgroundColor = '#6e6e6eff';
    campo.parentElement.querySelector('span').style.color = 'white';
    campo.parentElement.style.boxShadow = '';
  } else {
    campo.parentElement.style.backgroundColor = '#e9b8edff';
    campo.parentElement.querySelector('span').style.color = '';
    campo.parentElement.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.25), 4px 4px 0px #e9b8edff";
  }
}

const observadorTema = new MutationObserver(() => {
  camposComDica.forEach(campo => {
    aplicarEstilosDica(campo);
  });
});

observadorTema.observe(document.body, {
  attributes: true,
  attributeFilter: ['data-theme']
});

window.desistir = function () { // feito
  usuarioDesistiu = true;
  mostrarMensagem("Mais sorte na próxima!",1)
  for (let i = 0; i < 6; i++) {
    const y = document.getElementById(`campos${1 + i}`);
    if (y.style.backgroundColor !== "rgb(13, 249, 64)") {
      document.getElementById(`p${i + 1}`).textContent = listaAnagramas[i].toLowerCase();
      y.style.backgroundColor = "#ff4545bf";
      y.style.animationName = "aoDesistir"
      y.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.25), 4px 4px 0px #ff4545bf";
    }
  }
}
//////////////////////////////////////

/////// FUNÇÃO DE RANKING ////////

window.MostrarDados = async function () { // sinceramente que função insuportavel
  const rankingDiv = document.getElementById("ranking");
  try {
    const usuariosDoc = collection(db, "usuarios")
    const pesquisa = query(usuariosDoc, orderBy(tipoPonto, "desc"))
    onSnapshot(pesquisa, (pesquisaSnapshot) => {
      document.querySelectorAll("#divJogador").forEach(div => div.remove());
      // guarda numa lista e dps compara ali no sort 
      let usuarios = []
      pesquisaSnapshot.forEach(doc => {
        const infos = doc.data();
        if (!infos[tipoPonto] || infos[tipoPonto] <= 0) return;
        usuarios.push(infos);
      });

      usuarios.sort((a, b) => b[tipoPonto] - a[tipoPonto]);

      let posicao = 1
      usuarios.forEach(infos => {
        const divPlayer = document.createElement("div");
       divPlayer.id = "divJogador"
        const posicaoSpan = document.createElement("span");
        posicaoSpan.className = "jogador-posicao";
        if (posicao === 1) posicaoSpan.classList.add("primeiro");
        else if (posicao === 2) posicaoSpan.classList.add("segundo");
        else if (posicao === 3) posicaoSpan.classList.add("terceiro");
        if (posicao === 1) {
          posicaoSpan.textContent = "🥇"
        }
        else if (posicao === 2) {
          posicaoSpan.textContent = "🥈"
        }
        else if (posicao === 3) {
          posicaoSpan.textContent = "🥉"
        } else {
          posicaoSpan.textContent = posicao;
        }
        const infoDiv = document.createElement("div");

        const pNome = document.createElement("p");
        pNome.className = "jogador-nome";
        pNome.textContent = infos.nome;

        const pTempo = document.createElement("p");
        pTempo.className = "jogador-tempo";
        pTempo.textContent = "Pontos: " + Math.round(infos[tipoPonto])

        const containerFoto = document.createElement("div");
        containerFoto.style.width = "125px";
        containerFoto.style.height = "120px";
        containerFoto.style.borderRadius = "50px"
        containerFoto.style.position = "absolute";
        containerFoto.style.right = "2px";

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
        rankingDiv.appendChild(divPlayer);
        posicao++;
        const placarAuxiliar = document.getElementById("placarAuxiliar");
        rankingDiv.insertBefore(divPlayer, placarAuxiliar)
      })
    })
  } catch (err) {
    console.log("Erro ao mostrar qualquer tipo de pontuação!")
  }
}

window.calcularPontos = function (tempo) {
  let totalPontos = 0
  totalPontos = listaAchou.length * 1000 - (tempo * 0.25) - contadordicas * 50;
  if (totalPontos < 0) {
    totalPontos = 0
  }
  document.getElementById("pointsDisplay").textContent = Math.round(totalPontos)
}
/////////////////////////////////////


//////// TODO EVENT LISTENER /////

// click input
document.addEventListener("DOMContentLoaded", () => { // feito
  document.getElementById("input-jogar").addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      e.preventDefault(); // nao deixa recarregar o codigo
      InputResposta();
    }
  });
});
//tempo
document.addEventListener("DOMContentLoaded", () => { // feito
  const input = document.getElementById("input-jogar")
  let intervalo = null
  input.addEventListener("focus", () => {
    if (!intervalo) {
      intervalo = setInterval(() => {
        tempoFunc()
        if (listaAchou.length === 6 || usuarioDesistiu) {
          document.getElementById("input-jogar").style.display = "none"
          document.getElementById("botaoResposta").style.display = "none"
          funcEnfeites();
          setTimeout(() => salvarResultado(), 10)
          clearInterval(intervalo)
          intervalo = null
          return
        }
      }, 1000)
    }
  })
})

window.addEventListener('DOMContentLoaded', () => { // é pra adicionar listener no inicio, facilita pra mim :)
  const imagens = document.querySelectorAll('#imagemSelect');
  imagens.forEach(img => {
    img.addEventListener('click', (event) => {
      const srcDaImagem = event.target.src;
      console.log('link da imagem:', srcDaImagem);
      mudarImagem(srcDaImagem)
    });
  });
});

document.addEventListener('click', function (event) {
  const instrucoes = document.getElementById('Instrucoes');

  setTimeout(() => {
    if (instrucoes && !instrucoes.classList.contains('oculto')) {
      const conteudo = instrucoes.querySelector('.conteudo-instrucoes');
      const botaoInstrucoes = event.target.closest('.botao-icone');
      if (conteudo && !conteudo.contains(event.target) && !botaoInstrucoes) {
        instrucoes.classList.add('oculto');
      }
    }
  }, 10);
});

///////////////////////////////////////////////

/////////// FUNCAO ENFEITES ///////////////
window.jogarConfetes = function () { // feito
  const emotes = ["🎉", "🏆", "🎊"];
  for (let i = 0; i < 150; i++) {
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

window.retornarPalavras = function () { // feito
  document.getElementById("campos1").style.display = "flex";
  document.getElementById("campos2").style.display = "flex";
  document.getElementById("campos3").style.display = "flex";
  document.getElementById("campos4").style.display = "flex";
  document.getElementById("campos5").style.display = "flex";
  document.getElementById("campos6").style.display = "flex";
  const container = document.getElementById("divdobrayan");
  container.style.animationName = "containerGanhar";
}

window.funcEnfeites = function () { // feito
  if (usuarioDesistiu) return
  document.getElementById("input-jogar").style.display = "none"

  ///// aqui serve pra fazer os efeitos atuais /////
  let container = document.getElementById("divdobrayan");
  const novo = document.createElement("img")
  novo.style.width = "200px"
  novo.style.height = "200px"
  container.appendChild(novo)
  novo.src = "logo.ico"
  container.style.animationName = "aoAcertar";
  //////////////////////////////////////

  for (let i = 1; i < 7; i++) {
    document.getElementById(`campos${i}`).style.display = "none"
  }

  jogarConfetes()
  setTimeout(() => retornarPalavras(), 2000)
  setTimeout(() => container.removeChild(novo), 2000)
}
/////////////////////////////////////////////////

/////   FUNÇÕES HAVER COM USUARIOS ///////

window.mostrarMensagem = function(texto, tipoResultado){
  const divCriar = document.createElement("div")
  const textoDentro = document.createElement("span")
  
  divCriar.id = "mensagemContainer"
  textoDentro.className ="mensagemResultado"
  divCriar.style.display = "inline"
  
  textoDentro.textContent = texto
  document.body.appendChild(divCriar)
  divCriar.appendChild(textoDentro)

    
  if(tipoResultado === 1){
    divCriar.style.backgroundColor = "#ff2c2c" // erro
  }
  else if(tipoResultado === 2){
    divCriar.style.backgroundColor = "#00ff77" // sucesso
  }
  else{ console.log("erro")}

  setTimeout(() => {
    divCriar.classList.add("adicionar")
  },3000)
  setTimeout(() => {
    divCriar.style.display = "none"
    textoDentro.textContent = "placeTexto"
    divCriar.classList.remove("adicionar")
  },5000)
}

window.registro = async function (email, nome, senha, tempo, totalPontos) {
  let acertouTudo = null;
  setTimeout(() => jaRegistrou = false ,2500)
  if (listaAchou.length === 6 || usuarioDesistiu) acertouTudo = true;
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
    const user = userCredential.user;

    switch (paginaAtual) {
      case "facil":
        await setDoc(doc(db, "usuarios", user.uid), {
          nome: nome,
          tempoFacil: tempo,
          email: email,
          JaAcertouHojeFacil: acertouTudo,
          foto: "",
          pontosFaceis: totalPontos,
          criadoEm: diaAtual
        });
        break;
      case "medio":
        await setDoc(doc(db, "usuarios", user.uid), {
          nome: nome,
          tempoMediio: tempo,
          email: email,
          foto: "",
          JaAcertouHojeMedio: acertouTudo,
          pontosMedios: totalPontos,
          criadoEm: diaAtual
        });
        break;
      case "dificil":
        await setDoc(doc(db, "usuarios", user.uid), {
          nome: nome,
          tempoDificil: tempo,
          email: email,
          JaAcertouHojeDificil: acertouTudo,
          pontosDificies: totalPontos,
          criadoEm: diaAtual
        });
        break;
    }
    mostrarMensagem("Entrando...",2)
    setTimeout(() => window.location.reload(), 1000);
  } catch (err) {
    mostrarMensagem("Erro ao registrar!!",1)
    console.log(err)
  }
}

window.login = async function (email, senha) {
  try {
    const auth = getAuth();
    const userCredential = await signInWithEmailAndPassword(auth, email, senha);
    const user = userCredential.user;
    const docRef = doc(db, "usuarios", user.uid);
    const docSnap = await getDoc(docRef);
    let dados = null;
    if (docSnap.exists()) {
      dados = docSnap.data();
    }
    mostrarMensagem("Entrando...",2)
    setTimeout(() => window.location.reload() ,1000)
    return dados;
  } catch (err) {
    console.log("Erro ao fazer login: " + err);
    mostrarMensagem("Erro ao logar!!",1)

  }
}

window.LoginGoogle = async function () {
  auth.languageCode = 'pt';
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    const docRef = doc(db, "usuarios", user.uid);
    let docSnapShot = await getDoc(docRef);

    if (!docSnapShot.exists()) {
      const diaAtualAux = new Date().toLocaleDateString('pt-BR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });

      await setDoc(docRef, {
        nome: user.displayName,
        email: user.email,
        foto: user.photoURL,
        tempo: document.getElementById("timeDisplay").textContent,
        criadoEm: diaAtualAux
      });

      docSnapShot = await getDoc(docRef);
    }

    const dados = docSnapShot.data();
    console.log(dados);
    setTimeout(() => window.location.reload(), 100)
  } catch (err) {
    mostrarMensagem("Erro ao logar/registrar com Google!!",1)
    console.log("Erro ao tentar autenticar com Google:", err);
  }
}

window.EnviarLogin = function () {
  const email = document.getElementById("emailLogin").value;
  const senha = document.getElementById("senhaLogin").value;
  login(email, senha);
}

window.EnviarRegistro = function () {
  if(!jaRegistrou){
    console.log("mandando email....")
    mostrarMensagem("Espere...",2)
    jaRegistrou = true
    const email = document.getElementById("emailRegistro").value;
    const nome = document.getElementById("nomeRegistro").value;
    const senha = document.getElementById("senhaRegistro").value;
    const tempo = document.getElementById("timeDisplay").textContent;
    const pontos = document.getElementById("pointsDisplay").textContent;
    registro(email, nome, senha, tempo, pontos);
  }
  else{
    console.log("para de manda registro!")
  }
}

window.salvarResultado = async function () {
  if(!globalUser) setTimeout(() => apertarBotao(6), 2000)
  if (globalUser) {
    const ref = doc(db, "usuarios", globalUser);
    try {
      const snapshot = await getDoc(ref);
      if (!snapshot.exists) {
        return;
      }
      const dados = snapshot.data();
      if (paginaAtual == "facil" && dados.JaAcertouHojeFacil) { return }
      if (paginaAtual == "medio" && dados.JaAcertouHojeMedio) {  return }
      if (paginaAtual == "dificil" && dados.JaAcertouHojeDificil) {  return }

      switch (paginaAtual) {
        case "facil":
          await setDoc(ref, {
            tempoFacil: document.getElementById("timeDisplay").textContent,
            JaAcertouHojeFacil: true,
            pontosFaceis: document.getElementById("pointsDisplay").textContent
          }, { merge: true });
          break;
        case "medio":
          await setDoc(ref, {
            tempoMedio: document.getElementById("timeDisplay").textContent,
            JaAcertouHojeMedio: true,
            pontosMedios: document.getElementById("pointsDisplay").textContent
          }, { merge: true });
          break;
        case "dificil":
          await setDoc(ref, {
            tempoDificil: document.getElementById("timeDisplay").textContent,
            JaAcertouHojeDificil: true,
            pontosDificies: document.getElementById("pointsDisplay").textContent
          }, { merge: true });
          break;
      }
      mostrarMensagem("Foi salvo os resultados!",2)
    } catch (err) {
      console.log("Erro ao salvar resultado/ ERRO:" +err);
    }
  }
}

window.trocarIcone = function () {
  document.getElementById("botao-iconeID").removeAttribute("onclick");
  document.getElementById("iconeEntrar").className = "fa-solid fa-arrow-right-from-bracket";
  document.getElementById("botao-iconeID").addEventListener("click", sairDaConta);
  document.getElementById("placarAuxiliar").style.display = "flex";
}

window.sairDaConta = async function () {
  let sair = false
  signOut(auth).then(() => {
    if(!sair){
      sair = true
      setTimeout(() => window.location.reload(), 1000);
    }
    
  }).catch(() => {
  });
}

window.revelarAnagramas = async function () {
  if (!globalUser) { console.log("ninguem logado!"); return }
  let alterarAnagramas = false
  try {
    const usuario = doc(db, "usuarios", globalUser)
    const snap = await getDoc(usuario)
    const dados = snap.data()
    switch (destinoPontosPagina) {
      case "JaAcertouHojeFacil":
        if (dados.JaAcertouHojeFacil) {
          alterarAnagramas = true
        }
        break
      case "JaAcertouHojeMedio":
        if (dados.JaAcertouHojeMedio) {
          alterarAnagramas = true
        }
        break
      case "JaAcertouHojeDificil":
        if (dados.JaAcertouHojeDificil) {
          alterarAnagramas = true
        }
        break
      default:
        console.log("Ou está variavel nao ta setada ou deu erro!")
    }
    if (alterarAnagramas) {
      jogarConfetes()
      for (let i = 0; i < 6; i++) {
        const y = document.getElementById(`campos${1 + i}`);
        document.getElementById(`p${i + 1}`).textContent = listaAnagramas[i]
        y.style.backgroundColor = "#0df940ff";
        y.style.animationName = "aoAcertar"
        y.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.25), 4px 4px 0px #0df940ff";
      }
      if (paginaAtual === "facil") { document.getElementById("pointsDisplay").textContent = dados.pontosFaceis; document.getElementById("timeDisplay").textContent = "🎉" }
      if (paginaAtual === "medio") { document.getElementById("pointsDisplay").textContent = dados.pontosMedios; document.getElementById("timeDisplay").textContent = "🎉" }
      if (paginaAtual === "dificil") { document.getElementById("pointsDisplay").textContent = dados.pontosDificies; document.getElementById("timeDisplay").textContent = "🎉" }
      document.getElementById("input-jogar").style.display = "none"
      document.getElementById("botaoResposta").style.display = "none"
      mostrarMensagem("🎉Uhu!🎉",2)
    } else {
      console.log("Não vira os anagramas!")
    }
  } catch (err) {
    console.log("Algum erro aconteceu ao tentar revelar anagramas! -- ERRO:" + err)
  }
}

window.arrumarPerfil = async function () {
  try {
    const auxiliarUser = doc(db, "usuarios", globalUser)
    const auxiliar = await getDoc(auxiliarUser)
    const dados = auxiliar.data()
    console.log(dados)
    if (!dados.pontosFaceis) {
      await setDoc(auxiliarUser, {
        pontosFaceis: 0,
        tempoFacil : 0
      }, { merge: true })
    }
    if (!dados.pontosMedios) {
      await setDoc(auxiliarUser, {
        pontosMedios: 0,
        tempoMedio: 0
      }, { merge: true })
    }
    if (!dados.pontosDificies) {
      await setDoc(auxiliarUser, {
        pontosDificies: 0,
        tempoDificil : 0
      }, { merge: true })
    }
    const usuario = doc(db, "usuarios", globalUser)
    const espera = await getDoc(usuario)
    onSnapshot(usuario, (espera) => {
      const dados = espera.data()

      // variaveis
      const nome = dados.nome
      
      const tempoFacil = dados.tempoFacil
      const tempoMedio = dados.tempoMedio
      const tempoDificil = dados.tempoDificil
      
      const membroDesde = dados.criadoEm

      const pontoFacil = dados.pontosFaceis
      const pontoMedio = dados.pontosMedios
      const pontoDificil = dados.pontosDificies

      // so pra checar se a foto existe no banco
      let foto = null
      if (!dados.foto) { foto = imagensAleatorias[Math.floor(Math.random() * imagensAleatorias.length)]; }
      else { foto = dados.foto }

      document.getElementById("nomeUsuario").textContent = nome

      const tempos = document.querySelectorAll("#tempoHoje");
      tempos[0].textContent = "Tempo Fácil: " + tempoFacil;
      tempos[1].textContent = "Tempo Médio: " + tempoMedio;
      tempos[2].textContent = "Tempo Difícil: " + tempoDificil;

      document.getElementById("dataInscricao").textContent = "Membro desde: " + membroDesde
      

      document.getElementById("pontosFacilPlacar").textContent = "Pontos Fáceis: " + pontoFacil
      document.getElementById("pontosMedioPlacar").textContent = "Pontos Médios: " + pontoMedio
      document.getElementById("pontosDificilPlacar").textContent = "Pontos Díficies: " + pontoDificil

      document.getElementById("fotoUsuario").src = foto
    })
  } catch (err) {
    console.log("Erro ao arrumar perfil -- Erro:" + err)
  }
}

window.mudarImagem = async function (link) {
  try {
    const usuario = doc(db, "usuarios", globalUser)
    await setDoc(usuario, {
      foto: link
    }, { merge: true })
    alert("Sua foto foi atualizada!")
  } catch (err) {
    console.log("Erro ao mudar imagem ------- ERRO:" + err)
  }
}

window.confirmarAlteracoes = async function () {
  let tipoCaso = 0
  const inputNome = document.querySelector(".input-nome").value
  const inputURL = document.querySelector(".input-url").value

  if (inputNome === "" && inputURL === "") {
    alert("Não tem nada nesses campos!")
    return
  } else if (inputNome != "" && inputURL === "") {
    console.log("Apenas o campo input ta preenchido")
    tipoCaso = 1
  }
  else if (inputNome === "" && inputURL != "") {
    console.log("Apenas o campo url ta preenchido")
    if (inputURL.includes("jpeg") || inputURL.includes("png") || inputURL.includes("webp") || inputURL.includes("jpg")) {
      console.log("Formato valido!")
    } else {
      mostrarMensagem("Nada digitado",1)
      return
    }
    tipoCaso = 2
  } else {
    if (inputURL.includes("jpeg") || inputURL.includes("png") || inputURL.includes("webp") || inputURL.includes("jpg")) {
      console.log("Formato valido!")
    } else {
      mostrarMensagem("Inválido",1)
      return
    }
    console.log("os dois tao preenchidos!")
    tipoCaso = 3
  }
  try {
    const usuario = doc(db, "usuarios", globalUser)
    switch (tipoCaso) {
      case 1:
        await setDoc(usuario, {
          nome: inputNome
        }, { merge: true })
        alert("Mudou nome com sucesso!")
        break
      case 2:
        await setDoc(usuario, {
          foto: inputURL
        }, { merge: true })
        alert("Mudou foto com sucesso!")
        break
      case 3:
        await setDoc(usuario, {
          nome: inputNome,
          foto: inputURL
        }, { merge: true })
        alert("Mudou foto e nome com sucesso!")
        break
      default:
        console.log("Erro")
        break
    }
  } catch (err) {
    console.log("Algum erro ocorreu ao trocar imagem ou nome(ou ambos) ---- ERRO:" + err)
  }
}

window.deletarConta = async function () {
  if (!globalUser) {
    alert("Algum erro ocorreu");
    return;
  }
  const user = auth.currentUser
  try {
      await deleteUser(user).then(() => {
      deleteDoc(doc(db,"usuarios",globalUser))
      mostrarMensagem("Volte sempre!",2)
      setTimeout(() => window.location.reload() ,2000)
    }).catch((error) => {
      console.log("Erro ao deletar // ERRO:"+error)
    });
    
  } catch (err) {
    console.log("Erro ao deletar conta:"+err);
  }
};

window.redefinirSenha = async function (){
  const email = document.getElementById("emailLogin").value
  if(email === ""){
    console.log("Nada escrito")
    return
  }
  console.log(email)
  try{
      sendPasswordResetEmail(auth, email)
  .then(() => {
    console.log("enviado!")
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    // ..
  });
  }catch(err){
    console.log("Erro Redefinir senha:"+err)
  }
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    globalUser = user.uid;
    console.log("pessoa logada:" + globalUser)
    apertarBotao(4)
    trocarIcone()
    arrumarPerfil()
    setTimeout(() => revelarAnagramas(), 1000)
  }
  else {
    console.log("ninguem logado!")
  }
})

///////////////////////////////////////////////