import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getFirestore, collection, doc, getDoc, getDocs, query, where, orderBy, limit, setDoc } from 'https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js';
// FUNÇÃO DA PALAVRA DO DIA//
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

//
let usuarioEncontrado = false;
//
// FUNÇÕES QUE EXISTEM PRA FACILITAR TRABALHO
window.FecharJanelaAbrirGaveta = function(){
    document.getElementById("gaveta").classList.toggle("aberta");
    document.getElementById("divJogador").classList.toggle("aberta");
}
window.fecharX = function() {
    document.getElementById('Login').classList.add('oculto');
    document.getElementById('Registro').classList.add('oculto');
};
//
async function buscarDados() {
  const hoje = new Date().toISOString().split('T')[0];
  const docRef = doc(db, "palavraDoDiaMedia", hoje);

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
    })
  } catch (error) {
    console.error("Erro ao buscar dados:",error);
  }
}

buscarDados();
console.log(buscarDados())

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

      document.getElementById("gaveta").appendChild(divPlayer);
    });
  } catch (err) {
    console.error("Achei nada!!", err);
  }
}
MostrarDados();

async function criarProprioPlacar(email){
  try{
    const pesquisa = query(collection(db, "usuarios"), where("email", "==", email));
    const snapshot = await getDocs(pesquisa);
    snapshot.forEach(doc =>{
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

      document.getElementById("gaveta").appendChild(divPlayer);      
    })
  }catch(error){
    console.log("erro")
  }
}

async function registro(email,nome,senha,tempo){
  console.log(tempo)
  let usuarioExiste = false
  let contador = -1
  try{
    const usuariosBanco  = collection(db, "usuarios");
    const tentarPegarDocs = await getDocs(usuariosBanco)
    // deixar em funcs separadas
    tentarPegarDocs.forEach(doc =>{
      const dados = doc.data();
      const emailBanco  = dados.email;
      if( email === emailBanco){
        console.log("ja existe esse usuario")
        usuarioExiste = true;
      }
    })
    ///
      tentarPegarDocs.forEach(doc =>{
        contador += 1;
    })
    if(usuarioExiste){
        return;
      }
    const contadorId = contador + 1
    /////////////
    await setDoc(doc(db, "usuarios", String(contadorId) ), {
      email : email,
      nome : nome,
      senha : senha,
      tempo: tempo,
    });
    alert("Registro Completo!")
    login(email,senha);
  }catch(err){
    console.log("Erro ao registrar")
  }
}

window.EnviarRegistro = function () {
  const email = document.getElementById("emailRegistro").value;
  const nome = document.getElementById("nomeRegistro").value;
  const senha = document.getElementById("senhaRegistro").value;
  const tempo = document.getElementById("timeDisplay").textContent;
  registro(email, nome, senha,tempo);
};

async function login(email, senha) {
  try {
    const pesquisa = query(collection(db, "usuarios"), where("email", "==", email));
    const querySnapshot = await getDocs(pesquisa);

    if (querySnapshot.empty) {
      alert("Usuário não encontrado!");
      return;
    }
    querySnapshot.forEach((doc) => {
      if (doc.data().senha === senha) {
        usuarioEncontrado = true;
      }
    });
    if (usuarioEncontrado) {
      alert("Login realizado com sucesso!");
      criarProprioPlacar(email);
      fecharX()
      FecharJanelaAbrirGaveta();
    } else {
      alert("Senha incorreta ou não registrado!");
    }
  } catch (err) {
    alert("Erro no login: " + err.message);
  }
}

window.EnviarLogin = function () {
  const email = document.getElementById("emailLogin").value;
  const senha = document.getElementById("senhaLogin").value;
  login(email, senha);
};

/* async function carregarRanking() {
  const lista = document.getElementById("rankingList"); //pega as coisas pelo ID la do ranking do html numa variavel
  lista.innerHTML = "<li>Carregando...</li>"; //primeira coisa ao entrar

  try {
    const q = query(collection(db, "usuarios"), orderBy("tempo"), limit(10)); //pega os dados do usuario -> tempo -> limite de 10 ver isso pra mudar
    const snapshot = await getDocs(q); 

    const dados = [];
    snapshot.forEach(doc => {
      dados.push(doc.data()); //coloca em variavel percorrer os documentos bla bla, pra no fim coloca na variavel dados e mostrar no ranking
    });

    console.log("Ranking carregado:", dados);
    mostrarRanking(dados);
  } catch (error) {
    console.error("Erro ao carregar ranking:", error);
    lista.innerHTML = "<li>Erro ao carregar ranking.</li>";
  }
}
 */
/* function mostrarRanking(ranking) {
  const lista = document.getElementById("rankingList");
  lista.innerHTML = ""; //isso daqui  eh pra deixa vazio pra dps adiciona as informaçoes do banco+html

  ranking.forEach((usuario, index) => { //percore cada um e bota na lista com html pra mostrar
    lista.innerHTML += ` 
      <li class="item-ranking">
        <span class="posicao">${index + 1}°</span>
        <span class="nome">${usuario.nome || "Sem nome"}</span>
        <span class="tempo">${usuario.tempo ?? "—"}s</span>
      </li>
    `;
  }); 
}

//funcoes so pra fecha e abrir o painel, dps no final eh pra leva no html
function alternarRanking() {
  const painel = document.getElementById("rankingPanel");
  painel.classList.toggle("oculto");

  if (!painel.classList.contains("oculto")) {
    carregarRanking();
  }
}
 */
/* function fecharRanking() {
  document.getElementById("rankingPanel").classList.add("oculto");
}

window.alternarRanking = alternarRanking;
window.fecharRanking = fecharRanking;  */