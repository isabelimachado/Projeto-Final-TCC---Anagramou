// Chamada do firebase e APIs relacionadas:
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getFirestore, collection, doc, getDoc, getDocs, query, where, orderBy, setDoc, onSnapshot } from 'https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js';
import { createUserWithEmailAndPassword, deleteUser, getAuth, onAuthStateChanged, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signOut } from 'https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js';

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
const diaAtual = new Intl.DateTimeFormat('pt-BR')
  .format(hoje)
  .replace(/\//g, '-');

if (window.location.pathname.includes("index.html") || window.location.pathname === "/") {
  tipoPonto = "pontosFaceis"
  destinoPontosPagina = "JaAcertouHojeFacil"
  paginaAtual = "facil"
  databaseAtual = "palavraDoDiaFacil"
  databaseSinonimos = "descPalavraFacil"
}
if (window.location.pathname.includes("anagramaMedio.html")) {
  tipoPonto = "pontosMedios"
  destinoPontosPagina = "JaAcertouHojeMedio"
  paginaAtual = "medio"
  databaseAtual = "palavraDoDiaMedia"
  databaseSinonimos = "descPalavraMedia"
}
if (window.location.pathname.includes("anagramaDificil.html")) {
  tipoPonto = "pontosDificies"
  destinoPontosPagina = "JaAcertouHojeDificil"
  paginaAtual = "dificil"
  databaseAtual = "palavraDoDiaDificil"
  databaseSinonimos = "descPalavraDificil"
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
      document.getElementById("divJogador").classList.toggle("aberta");
      break;
    case 8: // fecharGaveta
      document.getElementById("ranking").classList.remove("aberta");
      document.getElementById("divJogador").classList.remove("aberta");
      break;
    case 9: //abrirPlacarProprio
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

window.dica = function () { // feito
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
  const temaAtual = document.body.getAttribute('data-theme');
  contadordicas += 1
  if (temaAtual === 'dark') {
    campo.parentElement.style.backgroundColor = '#6e6e6eff';
    campo.parentElement.querySelector('span').style.color = 'white';
  } else {
    campo.parentElement.style.backgroundColor = '#e9b8edff';
    campo.parentElement.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.25), 4px 4px 0px #e9b8edff";
  } campo.parentElement.style.animationName = "aoPedirDica"
}

window.desistir = function () { // feito
  usuarioDesistiu = true;
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
        divPlayer.id = "divJogador";
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
        containerFoto.style.height = "100px";
        containerFoto.style.borderRadius = "60px"
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

window.mostrarMensagem = function (texto, tipo = "sucesso") {
  const msg = document.getElementById("mensagem"); //div q vai mudar

  msg.innerHTML = `${texto}`;

  msg.className = tipo === "erro" ? "mensagem-erro" : "mensagem-sucesso";

  msg.style.display = "block";
  msg.style.opacity = "1";

  clearTimeout(window.msgTimeout);
  window.msgTimeout = setTimeout(() => fecharAlerta(), 5000);
}


window.registro = async function (email, nome, senha, tempo, totalPontos) {
  let acertouTudo = null;
  if (listaAchou.length === 6) acertouTudo = true;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
    const user = userCredential.user;

    switch (paginaAtual) {
      case "facil":
        await setDoc(doc(db, "usuarios", user.uid), {
          nome: nome,
          tempo: tempo,
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
          tempo: tempo,
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
          tempo: tempo,
          email: email,
          JaAcertouHojeDificil: acertouTudo,
          pontosDificies: totalPontos,
          criadoEm: diaAtual
        });
        break;
    }

    mostrarMensagem("Registro realizado com sucesso!", "sucesso");

  } catch (err) {
    mostrarMensagem("Erro ao registrar: " + (errorFirebase(err.code) || "Verifique os dados e tente novamente."), "erro");
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

    mostrarMensagem("Login realizado com sucesso!", "sucesso");
    return dados;

  } catch (err) {
    console.log("Erro ao fazer login: " + err);
    mostrarMensagem(errorFirebase(err.code) || "Erro ao fazer login.", "erro");
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
      const diaAtual = new Date().toLocaleDateString('pt-BR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });

      await setDoc(docRef, {
        nome: user.displayName,
        email: user.email,
        foto: user.photoURL,
        tempo: document.getElementById("timeDisplay").textContent,
        criadoEm: diaAtual
      });

      docSnapShot = await getDoc(docRef);
    }

    const dados = docSnapShot.data();
    console.log(dados);
    mostrarMensagem("Bem-vindo, " + user.displayName + "!", "sucesso");

  } catch (err) {
    console.log("Erro ao tentar autenticar com Google:", err);
    mostrarMensagem("Erro ao autenticar com Google.", "erro");
  }
}

window.EnviarLogin = function () {
  const email = document.getElementById("emailLogin").value;
  const senha = document.getElementById("senhaLogin").value;
  login(email, senha);
}

window.EnviarRegistro = function () {
  const email = document.getElementById("emailRegistro").value;
  const nome = document.getElementById("nomeRegistro").value;
  const senha = document.getElementById("senhaRegistro").value;
  const tempo = document.getElementById("timeDisplay").textContent;
  const pontos = document.getElementById("pointsDisplay").textContent;
  registro(email, nome, senha, tempo, pontos);
}

window.salvarResultado = async function () {
  if (globalUser) {
    const ref = doc(db, "usuarios", globalUser);
    try {
      const snapshot = await getDoc(ref);
      if (!snapshot.exists) {
        mostrarMensagem("Este usuário ainda não possui dados salvos.", "erro");
        return;
      }

      const dados = snapshot.data();
      if (paginaAtual == "facil" && dados.JaAcertouHojeFacil) { return }
      if (paginaAtual == "medio" && dados.JaAcertouHojeMedio) { return }
      if (paginaAtual == "dificil" && dados.JaAcertouHojeDificil) { return }

      switch (paginaAtual) {
        case "facil":
          await setDoc(ref, {
            tempo: document.getElementById("timeDisplay").textContent,
            JaAcertouHojeFacil: true,
            pontosFaceis: document.getElementById("pointsDisplay").textContent
          }, { merge: true });
          mostrarMensagem("Progresso fácil atualizado!", "sucesso");
          break;
        case "medio":
          await setDoc(ref, {
            tempo: null,
            JaAcertouHojeMedio: true,
            pontosMedios: document.getElementById("pointsDisplay").textContent
          }, { merge: true });
          mostrarMensagem("Progresso médio atualizado!", "sucesso");
          break;
        case "dificil":
          await setDoc(ref, {
            tempo: document.getElementById("timeDisplay").textContent,
            JaAcertouHojeDificil: true,
            pontosDificies: document.getElementById("pointsDisplay").textContent
          }, { merge: true });
          mostrarMensagem("Progresso difícil atualizado!", "sucesso");
          break;
      }
    } catch (err) {
      console.log("Erro ao salvar resultado/ ERRO:" + err);
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
  signOut(auth).then(() => {
    mostrarMensagem("Você saiu da conta.", "sucesso");
    setTimeout(() => window.location.reload(), 2000);
  }).catch(() => {
    mostrarMensagem("Erro ao sair da conta.", "erro");
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
      if (paginaAtual === "medio") { document.getElementById("pointsDisplay").textContent = dados.pontosFaceis; document.getElementById("timeDisplay").textContent = "🎉" }
      if (paginaAtual === "dificil") { document.getElementById("pointsDisplay").textContent = dados.pontosFaceis; document.getElementById("timeDisplay").textContent = "🎉" }
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
        pontosFaceis: 0
      }, { merge: true })
    }
    if (!dados.pontosMedios) {
      await setDoc(auxiliarUser, {
        pontosMedios: 0
      }, { merge: true })
    }
    if (!dados.pontosDificies) {
      await setDoc(auxiliarUser, {
        pontosDificies: 0
      }, { merge: true })
    }
    const usuario = doc(db, "usuarios", globalUser)
    const espera = await getDoc(usuario)
    onSnapshot(usuario, (espera) => {
      const dados = espera.data()

      // variaveis
      const nome = dados.nome
      const tempo = dados.tempo
      const membroDesde = dados.criadoEm

      const pontoFacil = dados.pontosFaceis
      const pontoMedio = dados.pontosMedios
      const pontoDificil = dados.pontosDificies

      // so pra checar se a foto existe no banco
      let foto = null
      if (!dados.foto) { foto = imagensAleatorias[Math.floor(Math.random() * imagensAleatorias.length)]; }
      else { foto = dados.foto }

      document.getElementById("nomeUsuario").textContent = nome
      document.getElementById("tempoHoje").textContent = "Tempo Hoje: " + tempo
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
      console.log("Invalido")
      return
    }
    tipoCaso = 2
  } else {
    if (inputURL.includes("jpeg") || inputURL.includes("png") || inputURL.includes("webp") || inputURL.includes("jpg")) {
      console.log("Formato valido!")
    } else {
      console.log("Invalido")
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
function abrirConfirmacao() {
  document.getElementById("confirmardeletar").classList.add("ativo");
}

function fecharConfirmacao() {
  document.getElementById("confirmardeletar").classList.remove("ativo");
}

window.deletarConta = async function () {
  fecharConfirmacao();

  if (!globalUser) {
    alert("Algum erro ocorreu");
    return;
  }

  const msg = document.getElementById("mensagemDeletar");
  msg.textContent = "Deletando conta...";

  try {
    await deleteUser(globalUser);
    msg.textContent = "Conta deletada com sucesso";
    sairDaConta();
  } catch (error) {
    console.error("Erro ao deletar conta:", error);
    msg.textContent = "Erro ao deletar conta";
  }
};

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

////////////////////////////////////////////////

///////////// ERROS DO FIREBASE /////////////

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


////////// CODIGO VELHO ///////////
/* 
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getFirestore, collection, doc, getDoc, getDocs, query, where, orderBy, setDoc, onSnapshot } from 'https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signOut } from 'https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js';
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

let listaSinonimos = [];
let listaAnagramas = [];
let listaAchou = [];

let checagemJaAcertou = false;
let desistiu = false
let usuario = null;
let pontos = ""
let paginaPontos = ""
let placarJaCriado = false;
// GLOBAL PRA FACILITAR CHAMAR EM OUTRAS FUNÇÕES
const palavraDoDia = document.getElementById("palavraDoDia");
const anagrama1 = document.getElementById("p1");
const anagrama2 = document.getElementById("p2");
const anagrama3 = document.getElementById("p3");
const anagrama4 = document.getElementById("p4");
const anagrama5 = document.getElementById("p5");
const anagrama6 = document.getElementById("p6");
const hoje = new Date().toISOString().split("T")[0];
if (window.location.pathname === "/index.html") {
  console.log("index.");
  pontos = "pontosFaceis"
  paginaPontos = "JaAcertouHojeFacil"
}
if (window.location.pathname === "/anagramaMedio.html") {
  console.log("medio.");
  pontos = "pontosMedios"
  paginaPontos = "JaAcertouHojeMedio"
}
if (window.location.pathname === "/anagramaDificil.html") {
  console.log("dificil.");
  pontos = "pontosDificies"
  paginaPontos = "JaAcertouHojeDificil"
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
window.abrirPlacarProprio = function () {
  document.getElementById("placarProprio").classList.add("aberto");
};
window.fecharPlacarProprio = function () {
  document.getElementById("placarProprio").classList.remove("aberto");
};
window.jogarConfetes = function () {
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
window.retornarPalavras = function () {
  document.getElementById("campos1").style.display = "flex";
  document.getElementById("campos2").style.display = "flex";
  document.getElementById("campos3").style.display = "flex";
  document.getElementById("campos4").style.display = "flex";
  document.getElementById("campos5").style.display = "flex";
  document.getElementById("campos6").style.display = "flex";
  const container = document.getElementById("divdobrayan");
  console.log(container.style.animationName)
  container.style.animationName = "containerGanhar";
  console.log(container.style.animationName)
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
  console.log("Lista dos anagramas:" + listaAnagramas)
  console.log("Lista dos sinonimos:" + listaSinonimos)
}

window.desistir = function () {
  desistiu = true;
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

window.revelarTudo = async function (email) {
  console.log(email)
  try {
    const pesquisa = query(
      collection(db, "usuarios"),
      where("email", "==", email),
      where(paginaPontos, "==", true)
    );
    const snapshot = await getDocs(pesquisa);
    if (snapshot.empty) {
      console.log("essa pessoa nao acertou tudo hoje ainda")
      return
    }
    console.log("Acertou tudo hoje")
    // revelar anagramas
    for (let i = 0; i < 6; i++) {
      const y = document.getElementById(`campos${1 + i}`);
      document.getElementById(`p${i + 1}`).textContent = listaAnagramas[i].toLowerCase();
      y.style.backgroundColor = "#0df940ff";
      y.style.animationName = "aoAcertar"
      y.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.25), 4px 4px 0px #0df940ff";
    }
  }
  catch (err) {
    console.log("🎉erro ao mostrar tudo!🎉")
  }
}

window.InputResposta = function () {
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
        if (checagemJaAcertou) {
          clearInterval(intervalo);
          intervalo = null;
          return
        }
        timer++;
        if (listaAchou.length === 6 && checagemJaAcertou == false || desistiu) {
          document.getElementById("input-jogar").style.display = "none"
          checagemJaAcertou = true;
          let container = document.getElementById("divdobrayan");
          console.log(desistiu);
          container.style.animationName = "aoAcertar";
          document.getElementById("campos1").style.display = "none";
          document.getElementById("campos2").style.display = "none";
          document.getElementById("campos3").style.display = "none";
          document.getElementById("campos4").style.display = "none";
          document.getElementById("campos5").style.display = "none";
          document.getElementById("campos6").style.display = "none";
          jogarConfetes();
          const novo = document.createElement("img")
          novo.style.width = "200px"
          novo.style.height = "200px"
          container.appendChild(novo)
          novo.src = "logo.ico"
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
      colecao = "pontosMedios"
      break;
    case 3:
      colecao = "pontosDificies"
      break;
  }
  try {
    const usuariosRef = collection(db, "usuarios");
    const q = query(usuariosRef, orderBy(colecao, "desc"));
    const querySnapshot = await getDocs(q);
    let posicao = 1; //variavel pra mostra posicao do jogador
    const retorno  = onSnapshot(usuariosRef,(querySnapshot) =>{
      const ranking = document.getElementById("ranking").innerHTML = ""
      querySnapshot.forEach(doc => {
        const infos = doc.data();
        if (infos[colecao] <= 0) {
          return
        }
        const divPlayer = document.createElement("div");
        divPlayer.id = "divJogador"; //div que fica o fundo com nome e tempo do jogador
  
        const posicaoSpan = document.createElement("span");
        posicaoSpan.className = "jogador-posicao"; //span pra mostra a posicao 
        if (posicao === 1) posicaoSpan.classList.add("primeiro"); //se tiver na posicao 1 vai adicionar na classe 1 e assim por diante
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
        //coloca o conteudo da posicao dentro do span
        //aqui eh so informaçoes do jogador: tempo posicao e nome
        const infoDiv = document.createElement("div");
  
        const pNome = document.createElement("p");
        pNome.className = "jogador-nome";
        pNome.textContent = infos.nome;
  
        const pTempo = document.createElement("p");
        pTempo.className = "jogador-tempo";
        pTempo.textContent = "Pontos: " + Math.round(infos[colecao])
  
        const containerFoto = document.createElement("div");
        containerFoto.style.width = "125px";
        containerFoto.style.height = "100px";
        containerFoto.style.borderRadius = "60px"
        containerFoto.style.position = "absolute";
        containerFoto.style.right = "2px";
  
        const imagensAleatorias = ["imagensAleatorias/gatodandojoia.jpeg", "imagensAleatorias/cachorroSalsicha.jpg", "imagensAleatorias/sillycat.webp", "imagensAleatorias/cachorroSorridente.jpg", "imagensAleatorias/cachorroengraçado.avif", "imagensAleatorias/gatoLinguarudo.jpg", "imagensAleatorias/gatoEngracado.jpg"]
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
    });
  } catch (err) {
    console.error("Achei nada!!", err);
  }
}

async function criarPlacarProprio(email) {
  document.getElementById("placarAuxiliar").style.display = "flex";
  try {
    const pesquisa = query(collection(db, "usuarios"), where("email", "==", email));
    const snapshot = await getDocs(pesquisa);
    const imagensAleatorias = ["imagensAleatorias/gatodandojoia.jpeg", "imagensAleatorias/cachorroSalsicha.jpg", "imagensAleatorias/sillycat.webp", "imagensAleatorias/cachorroSorridente.jpg", "imagensAleatorias/cachorroengraçado.avif", "imagensAleatorias/gatoLinguarudo.jpg", "imagensAleatorias/gatoEngracado.jpg"]
    snapshot.forEach(doc => {
      const dados = doc.data();
      const fotoURL = dados.foto || imagensAleatorias[Math.floor(Math.random() * imagensAleatorias.length)];
      document.getElementById("nomeUsuario").textContent = "Nome: " + dados.nome
      document.getElementById("dataInscricao").textContent = "Membro desde: " + dados.criadoEm || hoje
      document.getElementById("tempoHoje").textContent = "Tempo Hoje: " + dados.tempo
      document.getElementById("pontosFacilPlacar").textContent = "Pontos Fácil: " + dados.pontosFaceis
      document.getElementById("pontosMedioPlacar").textContent = "Pontos Médio: " + dados.pontosMedios
      document.getElementById("pontosDificilPlacar").textContent = "Pontos Difícil: " + dados.pontosDificies
      document.getElementById("foto").src = fotoURL
    });

  } catch (error) {
    console.log("Erro ao criar placar próprio:", error);
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
async function registro(email, nome, senha, tempo, seAcertou, totalPontos, id) {
  const mensagemErro = document.getElementById("mensagemErroRegistro");
  mensagemErro.textContent = "";
  mensagemErro.classList.remove("ativo");
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
    const user = userCredential.user;
    if (id === 1) {
      await setDoc(doc(db, "usuarios", user.uid), {
        nome: nome,
        tempo: tempo,
        email: email,
        JaAcertouHojeFacil: seAcertou,
        pontosFaceis: totalPontos,
        criadoEm: hoje
      });
    }
    if (id === 2) {
      await setDoc(doc(db, "usuarios", user.uid), {
        nome: nome,
        tempo: tempo,
        email: email,
        JaAcertouHojeMedio: seAcertou,
        pontosMedios: totalPontos,
        criadoEm: hoje
      });
    }
    if (id === 3) {
      await setDoc(doc(db, "usuarios", user.uid), {
        nome: nome,
        tempo: tempo,
        email: email,
        JaAcertouHojeDificil: seAcertou,
        pontosDificies: totalPontos,
        criadoEm: hoje
      });
    }

    mensagemErro.textContent = "Usuário registrado com sucesso!";
    mensagemErro.style.backgroundColor = "#52c41a"; // verde sucesso
    mensagemErro.classList.add("ativo");

    setTimeout(() => {
      mensagemErro.classList.remove("ativo");
      mensagemErro.textContent = "";
      mensagemErro.style.backgroundColor = "";
    }, 6000);


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
  const mensagemErro = document.getElementById("mensagem");
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
      FecharJanelaAbrirGaveta();

      mensagemErro.style.backgroundColor = "#52c41a"; // verde sucesso
      mensagemErro.textContent = `Bem-vindo, ${dados.nome}!`;
      mensagemErro.classList.add("ativo"); //isso se der certo login

      setTimeout(() => {
        mensagemErro.classList.remove("ativo");
        mensagemErro.textContent = "";
        mensagemErro.style.backgroundColor = "";
      }, 5000);

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
        JaAcertouHojeFacil: checagemJaAcertou,
        criadoEm: hoje
      });
      docSnap = await getDoc(docRef)
    }

    dados = docSnap.data();
    fecharX();
    FecharJanelaAbrirGaveta();
    alert("Bem vindo! " + user.displayName)
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
    criarPlacarProprio(user.email);
    placarJaCriado = true;
    document.getElementById("botao-iconeID").removeAttribute("onclick");
    document.getElementById("iconeEntrar").className = "fa-solid fa-arrow-right-from-bracket";
    document.getElementById("botao-iconeID").addEventListener("click", sair);
    document.getElementById("placarAuxiliar").style.display = "in-line"
    revelarTudo(user.email);
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
  if (!desistiu && listaAchou.length === 6) {
    totalPontos = listaAchou.length * 1000 - (totalSegundos * 0.25);
  } else if (desistiu && listaAchou.length >= 1) {
    totalPontos = listaAchou.length * 1000 - (totalSegundos * 0.50);
  } else {
    console.log("Desistiu e não colocou nada!")
  }
  console.log(totalPontos)
  const ref = doc(db, "usuarios", usuario.uid);
  try {
    if (id === "pontosFaceis") {
      await setDoc(ref, {
        tempo: guardarTempo,
        JaAcertouHojeFacil: JaAcertou,
        pontosFaceis: totalPontos
      }, { merge: true });
      console.log("Atualizado!");
    }
    if (id === "pontosMedios") {
      await setDoc(ref, {
        tempo: guardarTempo,
        JaAcertouHojeMedio: JaAcertou,
        pontosFaceis: totalPontos
      }, { merge: true });
      console.log("Atualizado!");
    }
    if (id === "pontosDificies") {
      await setDoc(ref, {
        tempo: guardarTempo,
        JaAcertouHojeDificil: JaAcertou,
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
  if (!desistiu && listaAchou.length === 6) {
    totalPontos = listaAchou.length * 1000 - (totalSegundos * 0.25);
  } else if (desistiu && listaAchou.length >= 1) {
    totalPontos = listaAchou.length * 1000 - (totalSegundos * 0.25);
  } else {
    console.log("Desistiu e não colocou nada!")
  }
  registro(email, nome, senha, tempo, seAcertou, totalPontos, id);
};

window.EnviarLogin = function () {
  const email = document.getElementById("emailLogin").value;
  const senha = document.getElementById("senhaLogin").value;
  login(email, senha);
};

window.dica = function () {
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
  const temaAtual = document.body.getAttribute('data-theme');

  if (temaAtual === 'dark') {
    campo.parentElement.style.backgroundColor = '#6e6e6eff';
    campo.parentElement.querySelector('span').style.color = 'white';
  } else {
    campo.parentElement.style.backgroundColor = '#e9b8edff';
    campo.parentElement.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.25), 4px 4px 0px #e9b8edff";
  } campo.parentElement.style.animationName = "aoPedirDica"
}

window.mudarImagem = async function () {
  let urlDado = document.getElementById("urlImagem").value
  if (urlDado.includes("jpeg") || urlDado.includes("png") || urlDado.includes("webp") | urlDado.includes("jpg")) {
    console.log("Formato valido!")
  } else {
    console.log("Invalido")
  }
  console.log(urlDado)
  try {
    const ref = doc(db, "usuarios", usuario.uid);
    await setDoc(ref, {
      foto: urlDado,
    }, { merge: true })
  } catch (err) {
    console.log("Erro algo mandar ou pegar imagem" + err)
  }

}

// FUNÇÃO EXTRA DE TROCAR IMAGEM!document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("urlImagem").addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      mudarImagem()
    }
  });
 
 */