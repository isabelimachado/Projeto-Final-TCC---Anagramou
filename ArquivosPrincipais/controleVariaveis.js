let contador = 0
const listaAchou = []

function mostrarInstrucoes() {
    document.getElementById('Instrucoes').classList.remove('oculto');
};
function fecharInstrucoes() {
    document.getElementById('Instrucoes').classList.add('oculto');
};
function mostrarPerfil() {
    document.getElementById('Login').classList.remove('oculto');
};
function fecharX() {
    document.getElementById('Login').classList.add('oculto');
    document.getElementById('Registro').classList.add('oculto');
};
function mostrarRegistro() {
    document.getElementById('Registro').classList.remove('oculto');
    document.getElementById('Login').classList.add('oculto');
}
function mostrarRanking(){
    document.getElementById("gaveta").classList.toggle("aberta");
    document.getElementById("divJogador").classList.toggle("aberta");
}
function fecharGaveta(){
    document.getElementById("gaveta").classList.remove("aberta");
    document.getElementById("divJogador").classList.remove("aberta");
}

function VirarDiv(anagramaCerto) {
    const listaCampos = [];
    const listaPalavras = [];
    for (let i = 1; i <= 6; i++) {
        listaCampos.push(document.getElementById(`campos${i}`));
        listaPalavras.push(document.getElementById(`p${i}`));
    }

    for (let i = 0; i < listaPalavras.length; i++) {
        if (listaPalavras[i].textContent === anagramaCerto) {
            listaPalavras[i].style.display = "flex";
            listaPalavras[i].style.animationName = "AnimPulando"
        if(listaCampos[i]){
            listaCampos[i].style.animationName = "aoAcertar";
        }
        }
    }
}
function InputResposta(){
    input = document.getElementById("input-jogar").value;

    ag1 = document.getElementById("p1").textContent
    ag2 = document.getElementById("p2").textContent
    ag3 = document.getElementById("p3").textContent
    ag4 = document.getElementById("p4").textContent
    ag5 = document.getElementById("p5").textContent
    ag6 = document.getElementById("p6").textContent

    console.log(ag1,ag2,ag3,ag4,ag5,ag6)
    lista = [ag1,ag2,ag3,ag4,ag5,ag6]
    
    for(let i = 0; i < lista.length; i++){
        if(input.includes(lista[i]) && !listaAchou.includes(input)){
            listaAchou.push(input)
            console.log("há algo")
            contador += 1
            console.log(contador)
            VirarDiv(input)
        }else if(listaAchou.includes(input)){
            console.log("isso ja foi colocado!!")
        }
        else{
            console.log("nao há resposta")
        }
        if(contador == 6){
            mostrarPerfil()
        }
    }
}
document.addEventListener("DOMContentLoaded", () => { 
    const input = document.getElementById("input-jogar");
    const tempo = document.getElementById("timeDisplay");
    let timer = 0;
    let intervalId = null;

    input.addEventListener("focus", () => {
        if (contador < 6) {
            if (!intervalId) { 
                intervalId = setInterval(() => {
                    const min = Math.floor(timer / 60);
                    const sec = timer % 60;
                    tempo.textContent = `${min}:${sec < 10 ? '0' : ''}${sec}`;
                    timer++;
                }, 1000);
            }
        }else{
            clearInterval(intervalId)
        }
    });
});
