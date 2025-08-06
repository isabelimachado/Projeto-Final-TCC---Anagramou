const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');

const serviceAccount = require('./seguranca.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function salvarNoFirebase(palavra, anagramas) {
  try {
    const hoje = new Date().toISOString().split('T')[0]; 
    const docRef = db.collection('palavradoDia').doc(hoje);
    await docRef.set({ palavra, anagramas });
    console.log('salvo no Firebase');
  } catch (err) {
    console.error('erro ao salvar:', err);
  }
}

const filePath = path.join(__dirname, 'words', 'palavras5letras.json');

fs.readFile(filePath, 'utf8', async (err, data) => {
  if (err) { console.error('erro:', err); return; }
  try {
    const palavras = JSON.parse(data);
    function encontrarAnagramas(palavra, lista) {
      const chave = palavra.split('').sort().join('');
      return lista.filter(p => p !== palavra && p.split('').sort().join('') === chave);
    }

    let anagramas = [];
    let palavraSelecionada = '';

    while (anagramas.length < 5) {
      palavraSelecionada = palavras[Math.floor(Math.random() * palavras.length)];
      anagramas = encontrarAnagramas(palavraSelecionada, palavras);
      if (anagramas.length >= 5) {
        anagramas = anagramas.slice(0, 5);
        break;
      }
    }

    await salvarNoFirebase(palavraSelecionada, anagramas);
    console.log(`palavra: ${palavraSelecionada}`);
    console.log(`anagramas encontrados: ${anagramas.join(', ')}`);
  } catch (erro) {
    console.error(erro);
  }
});
