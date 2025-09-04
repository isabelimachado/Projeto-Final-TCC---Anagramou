const tempo = "10:10"
const pontuacao = 10000  

const [min, sec] = tempo.split(":").map(Number)
const totalSegundos = min * 60 + sec

let resultado = pontuacao - (totalSegundos * 10)

console.log("Pontuação:", pontuacao)
console.log("Tempo:", tempo)
console.log("Total em segundos:", totalSegundos)
console.log("Resultado:", resultado)