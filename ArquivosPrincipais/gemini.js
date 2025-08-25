const admin = require('firebase-admin');
const serviceAccount = require('./seguranca.json');

const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI("AIzaSyCMozEyqIb-VR62uMWtylxYpzNtTPxrzzQ");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
async function exemplo(a1, a2, a3, a4, a5, a6,database) {
  let banco = ""
  if(database == 1) banco = "descPalavraFacil"  
  if(database == 2) banco = "descPalavraMedia"
  if(database == 3) banco = "descPalavraDificil"
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const palavras = [a1, a2, a3, a4, a5, a6];
  const prompt = `Dê um sinônimo de cada uma dessas palavras, em duas únicas palavra para cada, na mesma ordem, separadas por vírgula: ${palavras.join(", ")}`;
  
  try {
    const result = await model.generateContent(prompt);
    const texto = result.response.text(); 
    
    const sinonimos = texto.split(",").map(s => s.trim());

    console.log("sinonimos gerados:", sinonimos);

    const hoje = new Date().toISOString().split('T')[0];
    const docRef = db.collection(banco).doc(hoje);
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

  } catch (err) {
    console.error("Erro!:", err);
  }
}


async function procurarDadosFaceis() {
    const hoje = new Date().toISOString().split('T')[0];
    const docRef = db.collection("palavraDoDiaFacil").doc(hoje);
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
    const hoje = new Date().toISOString().split('T')[0];
    const docRef = db.collection("palavraDoDiaMedia").doc(hoje);
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
    const hoje = new Date().toISOString().split('T')[0];
    const docRef = db.collection("palavraDoDiaDificil").doc(hoje);
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

procurarDadosFaceis();
procurarDadosMedio();
procurarDadosDificil();