
function VirarDiv(anagramaCerto){
    ag1 = document.getElementById("p1")
    ag2 = document.getElementById("p2")
    ag3 = document.getElementById("p3")
    ag4 = document.getElementById("p4")
    ag5 = document.getElementById("p5")
    ag6 = document.getElementById("p6")
    mcdivertida = document.getElementById("mcDivertida")

    lista = [ag1,ag2,ag3,ag4,ag5,ag6]
    
    for(let i = 0; i < lista.length; i++){
        if(lista[i].textContent === anagramaCerto){
            lista[i].innerText = "achei!";
            lista[i].style.display = "flex";
            mcdivertida.style.animationName = "slide-in"
        }
    }
}
function Teste(){
    input = document.getElementById("text").value;
    ag1 = document.getElementById("p1").textContent
    ag2 = document.getElementById("p2").textContent
    ag3 = document.getElementById("p3").textContent
    ag4 = document.getElementById("p4").textContent
    ag5 = document.getElementById("p5").textContent
    ag6 = document.getElementById("p6").textContent
    console.log(input)
    lista = [ag1,ag2,ag3,ag4,ag5,ag6]
    
    for(let i = 0; i < lista.length; i++){
        if(input.includes(lista[i])){
            console.log("ceci papa")
            VirarDiv(input)
        }else{
            console.log("ceci eletro")
        }
    }
}
