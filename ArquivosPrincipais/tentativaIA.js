const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');
const OpenAI = require('openai'); // Adicionar biblioteca da OpenAI

// Configurar OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // Adicionar sua chave da API aqui
});

const serviceAccount = require('./seguranca.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

function encontrarAnagramas(palavra, lista) {
  const chave = palavra.split('').sort().join('');
  return lista.filter(p => p !== palavra && p.length === palavra.length && p.split('').sort().join('') === chave);
}

// Função para obter significado usando OpenAI
async function obterSignificado(palavra) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // ou "gpt-4" se você tiver acesso
      messages: [
        {
          role: "system",
          content: "Você é um assistente que fornece definições concisas e claras de palavras em português brasileiro."
        },
        {
          role: "user",
          content: `Qual é o significado da palavra "${palavra}"? Forneça uma definição clara e concisa em até 50 palavras.`
        }
      ],
      max_tokens: 100,
      temperature: 0.3
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('Erro ao obter significado da OpenAI:', error);
    return 'Significado não disponível'; // Fallback em caso de erro
  }
}

// Função simplificada para obter apenas o significado da palavra principal
async function obterSignificadoPrincipal(palavra) {
  console.log(`Obtendo significado para a palavra principal: ${palavra}`);
  return await obterSignificado(palavra);
}

async function palavrasUsadas() {
  const snapshot = await db.collection('palavraDoDia').get();
  const usadas = [];
  snapshot.forEach(doc => {
    const data = doc.data();
    if (data.palavra) usadas.push(data.palavra);
  });
  return usadas; 
}

async function salvarNoFirebase(palavra, anagramas, significado) {
  try {
    const hoje = new Date().toISOString().split('T')[0];
    const docRef = db.collection('palavraDoDia').doc(hoje);

    const docSnapshot = await docRef.get();
    if (docSnapshot.exists) {
      console.log(`Já existe uma palavra cadastrada para o dia de hoje`);
      return;
    }
    
    const data = {
      palavra,
      significado, // Apenas o significado da palavra principal
      anagrama1: anagramas[0] || '',
      anagrama2: anagramas[1] || '',
      anagrama3: anagramas[2] || '',
      anagrama4: anagramas[3] || '',
      anagrama5: anagramas[4] || ''
    };

    await docRef.set(data);
    console.log('Dados salvos no Firebase com sucesso!');
  } catch (err) {
    console.error('Erro ao salvar no Firebase:', err);
  }
}

const filePath = path.join(__dirname, 'words', 'palavras5letras.json');

fs.readFile(filePath, 'utf8', async (err, data) => {
  if (err) {
    console.error('Erro ao ler arquivo:', err);
    return;
  }

  try {
    const palavras = JSON.parse(data);
    const usadas = await palavrasUsadas();
    let anagramas = [];
    let palavraSelecionada = '';

    // Encontrar palavra com anagramas suficientes
    while (true) {
      palavraSelecionada = palavras[Math.floor(Math.random() * palavras.length)];
      if (usadas.includes(palavraSelecionada)) {
        continue;
      }
      anagramas = encontrarAnagramas(palavraSelecionada, palavras);
      if (anagramas.length >= 5) {
        anagramas = anagramas.slice(0, 5);
        break;
      }
    }

    console.log(`Palavra selecionada: ${palavraSelecionada}`);
    console.log(`Anagramas encontrados: ${anagramas.join(', ')}`);
    
    // Obter apenas o significado da palavra principal
    const significado = await obterSignificadoPrincipal(palavraSelecionada);
    
    // Salvar no Firebase
    await salvarNoFirebase(palavraSelecionada, anagramas, significado);
    
    // Mostrar resultados
    console.log('\n=== RESULTADOS ===');
    console.log(`Palavra: ${palavraSelecionada}`);
    console.log(`Significado: ${significado}`);
    console.log(`Anagramas: ${anagramas.join(', ')}`);
    
  } catch (erro) {
    console.error('Erro geral:', erro);
  }
});