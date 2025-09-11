const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');
const serviceAccount = require('./seguranca.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const filePathCinco = path.join(__dirname, 'words', 'palavras5letras.json');
const filePathSeis = path.join(__dirname, 'words', 'palavras6letras.json');
const filePathSete = path.join(__dirname, 'words', 'palavras7letras.json');

async function AcharPalavra(jsonTipo, identificador) {
  try {
    let colecao = "";
    if (identificador === 1) colecao = "palavraDoDiaFacil";
    if (identificador === 2) colecao = "palavraDoDiaMedia";
    if (identificador === 3) colecao = "palavraDoDiaDificil";

    const snapshot = await db.collection(colecao).get();
    const listaExistentes = [];
    snapshot.forEach(doc => {
      const tudo = doc.data();
      if (tudo) {
        if (tudo.palavra) listaExistentes.push(tudo.palavra);
        for (let i = 1; i <= 6; i++) {
          if (tudo[`anagrama${i}`]) listaExistentes.push(tudo[`anagrama${i}`]);
        }
      }
    });

    let palavraAleatoria, anagramas;

    while (true) {
      palavraAleatoria = jsonTipo[Math.floor(Math.random() * jsonTipo.length)];

      if (listaExistentes.includes(palavraAleatoria)) {
        console.log(`⚠️ ${palavraAleatoria} já existe!`);
        continue;
      }

      anagramas = jsonTipo.filter(
        (p) =>
          p !== palavraAleatoria &&
          p.split("").sort().join("") === palavraAleatoria.split("").sort().join("")
      );

      if (anagramas.length >= 6) {
        console.log(`escolhida: ${palavraAleatoria} com ${anagramas.length} anagramas`);
        break;
      } else {
        console.log(` ${palavraAleatoria} ,tentando outra`);
      }
    }

    const hoje = new Date().toISOString().split("T")[0];
    const docRef = db.collection(colecao).doc(hoje); 
    const docSnap = await docRef.get();

    const docRefUsuario = db.collection("usuarios");
    const docSnapUsuario = await docRefUsuario.get();
    
    if (!docSnap.exists) {
      await docRef.set({
        palavra: palavraAleatoria,
        anagrama1: anagramas[0] || "",
        anagrama2: anagramas[1] || "",
        anagrama3: anagramas[2] || "",
        anagrama4: anagramas[3] || "",
        anagrama5: anagramas[4] || "",
        anagrama6: anagramas[5] || ""
      });
      if(docSnapUsuario.exists){
       await docRefUsuario.set({
        pontosFaceis:0,
        pontosMedios:0,
        pontosDificies:0,
        seAcertou : false
       },{ merge: true });
      }
      console.log("consegui!");
    } else {
      console.log("existe uma palavra pro dia de hoje!");
    }
  } catch (err) {
    console.error(":( erro enorme", err);
  }
}

async function Descompactar() {
  try {
    const dataCinco = await fs.promises.readFile(filePathCinco, 'utf8');
    const dataSeis = await fs.promises.readFile(filePathSeis, 'utf8');
    const dataSete = await fs.promises.readFile(filePathSete, 'utf8');

    const palavrasCinco = JSON.parse(dataCinco);
    const palavrasSeis = JSON.parse(dataSeis);
    const palavrasSete = JSON.parse(dataSete);

    await AcharPalavra(palavrasCinco, 1);
    await AcharPalavra(palavrasSeis, 2);
    await AcharPalavra(palavrasSete, 3);
  } catch (err) {
    console.error( err);
  }
}

Descompactar();