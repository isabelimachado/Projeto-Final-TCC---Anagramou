require ('dotenv').config({ path: "./variaveis.env"})
console.log(process.env.GOOGLE_API_KEY)

const serviceAccount = require('./seguranca.json')
const admin = require('firebase-admin');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


const {GoogleGenAI}  = require("@google/genai")
const ai = new GoogleGenAI({
  apiKey:process.env.GOOGLE_API_KEY,
});


const hoje = new Date();
const diaAtual = new Intl.DateTimeFormat('pt-BR') .format(hoje).replace(/\//g, '-');  
const db = admin.firestore();

async function exemplo(a1,a2,a3,a4,a5,a6,database)
{
    let banco = ""
    if(database == 1) banco = "descPalavraFacil"  
    if(database == 2) banco = "descPalavraMedia"
    if(database == 3) banco = "descPalavraDificil"
   const palavras = [a1,a2,a3,a4,a5,a6] 
    try{
         const resposta = await ai.models.generateContent({
          model: "gemini-2.0-flash",
          contents : `Forneça apenas um sinônimo simples e moderno para as seguintes palavras, na mesma ordem, com exatamente uma palavras ou duas por item, separados por vírgula. Não adicione explicações, quebras de linha, nem texto extra. Apenas os sinônimos: ${palavras.join(", ")}`,
         })
         const texto = resposta.text
         console.log(texto)

        const sinonimos = texto.split(",").map(s => s.trim());

        console.log("sinonimos gerados:", sinonimos);

        const docRef = db.collection(banco).doc(diaAtual);
        const docSnap = await docRef.get();

        if (docSnap.exists) {
          console.log("Existe uma referência hoje");
          return;
        }

        await docRef.set({
          resumo1: sinonimos[0] || "",
          resumo2: sinonimos[1] || "",
          resumo3: sinonimos[2] || "",
          resumo4: sinonimos[3] || "",
          resumo5: sinonimos[4] || "",
          resumo6: sinonimos[5] || ""
        });

    console.log("salvos!");
    }catch(erro){
        console.log(erro)
    }
}


async function procurarDadosFaceis() {
    const docRef = db.collection("palavraDoDiaFacil").doc(diaAtual);
    try{
      const docSnap = await docRef.get();
      if(!docSnap.exists){
        console.log("nao existe!")
        return
      }
      const data  = docSnap.data();
      const anagrama1Valor = data.anagrama1;
      const anagrama2Valor = data.anagrama2;
      const anagrama3Valor = data.anagrama3;
      const anagrama4Valor = data.anagrama4;
      const anagrama5Valor = data.anagrama5;
      const anagrama6Valor = data.anagrama6;
      console.log(anagrama1Valor + anagrama2Valor + anagrama3Valor + anagrama4Valor + anagrama5Valor + anagrama6Valor)
      exemplo(anagrama1Valor,anagrama2Valor,anagrama3Valor,anagrama4Valor,anagrama5Valor,anagrama6Valor,1) 
    }catch(err){
      console.log("erro nessa funcao")
    }
}

async function procurarDadosMedio() {
    const docRef = db.collection("palavraDoDiaMedia").doc(diaAtual);
    try{
      const docSnap = await docRef.get();
      if(!docSnap.exists){
        console.log("nao existe!")
        return
      }
      const data  = docSnap.data();
      const anagrama1Valor = data.anagrama1;
      const anagrama2Valor = data.anagrama2;
      const anagrama3Valor = data.anagrama3;
      const anagrama4Valor = data.anagrama4;
      const anagrama5Valor = data.anagrama5;
      const anagrama6Valor = data.anagrama6;
      console.log(anagrama1Valor + anagrama2Valor + anagrama3Valor + anagrama4Valor + anagrama5Valor + anagrama6Valor)
      exemplo(anagrama1Valor,anagrama2Valor,anagrama3Valor,anagrama4Valor,anagrama5Valor,anagrama6Valor,2) 
    }catch(err){
      console.log("erro nessa funcao")
    }
}

async function procurarDadosDificil() {
    const docRef = db.collection("palavraDoDiaDificil").doc(diaAtual);
    try{
      const docSnap = await docRef.get();
      if(!docSnap.exists){
        console.log("nao existe!")
        return
      }
      const data  = docSnap.data();
      const anagrama1Valor = data.anagrama1;
      const anagrama2Valor = data.anagrama2;
      const anagrama3Valor = data.anagrama3;
      const anagrama4Valor = data.anagrama4;
      const anagrama5Valor = data.anagrama5;
      const anagrama6Valor = data.anagrama6;
      console.log(anagrama1Valor + anagrama2Valor + anagrama3Valor + anagrama4Valor + anagrama5Valor + anagrama6Valor)
      exemplo(anagrama1Valor,anagrama2Valor,anagrama3Valor,anagrama4Valor,anagrama5Valor,anagrama6Valor,3) 
    }catch(err){
      console.log("erro nessa funcao")
    }
}

/* procurarDadosFaceis() */


procurarDadosFaceis()
procurarDadosMedio()
procurarDadosDificil()