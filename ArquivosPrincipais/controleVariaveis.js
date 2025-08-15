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
        if(input.includes(lista[i])){
            console.log("há algo")
            VirarDiv(input)
        }else{
            console.log("nao há resposta")
        }
    }
}
