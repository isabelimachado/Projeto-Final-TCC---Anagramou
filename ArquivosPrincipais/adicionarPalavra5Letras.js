const fs = require('fs'); // ler json
const path = require('path'); // ler o path(caminho) dos arquivos
const admin = require('firebase-admin'); // tem que importar o firebase manualmente

const serviceAccount = require('./seguranca.json'); // o api de segurança do firebase pra acessar os dados

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount) // garante as ferramentas pra acessar o adm do firebase
});

const db = admin.firestore(); // pegar banco de dados

function encontrarAnagramas(palavra, lista) { // função que passa a palavra + lista para evitar erros
  const chave = palavra.split('').sort().join(''); // cortar,ordem alfabetica e colocar na lista
  return lista.filter(p => p !== palavra && p.length === palavra.length && p.split('').sort().join('') === chave); // retorna o filtro onde só verifica se a palavra do banco de dados é igual a atual
}

async function palavrasUsadas() {  // função assincrona
  const snapshot = await db.collection('palavraDoDia').get(); // executa uma vez e espera a coleção palavraDoDia e seus dados
  const usadas = [];
  snapshot.forEach(doc => {
    const data = doc.data(); // todos os fields do documento
    if (data.palavra) usadas.push(data.palavra);
  });
  return usadas; 
}

async function salvarNoFirebase(palavra, anagramas) {
  try {
    const hoje = new Date().toISOString().split('T')[0]; // deixa em formato XXXX-XX-XX
    const docRef = db.collection('palavraDoDiaFacil').doc(hoje); // so pea a data

    const docSnapshot = await docRef.get();
    if (docSnapshot.exists) { // se existe retorna nada
      console.log(` já existe uma palavra cadastrada para o dia de hoje`);
      return;
    }
    const data = {
      palavra,
      anagrama1: anagramas[0] || '',
      anagrama2: anagramas[1] || '',
      anagrama3: anagramas[2] || '',
      anagrama4: anagramas[3] || '',
      anagrama5: anagramas[4] || '',
      anagrama6: anagramas[5] || ''
    };

    await docRef.set(data); // so ve se ta algo dentro
  } catch (err) {
    console.error('erro', err);
  }
}

const filePath = path.join(__dirname, 'words', 'palavras5letras.json'); // ta pegando o diretorio da palavras com 5 letras

fs.readFile(filePath, 'utf8', async (err, data) => { // tentar levar o diretorio do json uma vez
  if (err) {
    console.error('erro ao ler :', err);
    return;
  }

  try {
    const palavras = JSON.parse(data);
    const usadas = await palavrasUsadas();
    let anagramas = [];
    let palavraSelecionada = '';

    while (true) {
      palavraSelecionada = palavras[Math.floor(Math.random() * palavras.length)]; // funçao do anagrama ai
      if (usadas.includes(palavraSelecionada)) {
        continue;
      }
      anagramas = encontrarAnagramas(palavraSelecionada, palavras);
      if (anagramas.length >= 6) {
        anagramas = anagramas.slice(0, 6);
        break;
      }
    }
    await salvarNoFirebase(palavraSelecionada, anagramas); // salva se tudo certo
    
    console.log(`Palavra aleatoria: ${palavraSelecionada}`);
    console.log(`anagramas encontrados: ${anagramas.join(', ')}`);
  } catch (erro) {
    console.error('erro:', erro);
  }

});
