function Teste(){
    input = document.getElementById("text").value;
    ag1 = document.getElementById("p1").textContent
    ag2 = document.getElementById("p2").textContent
    ag3 = document.getElementById("p3").textContent
    ag4 = document.getElementById("p4").textContent
    ag5 = document.getElementById("p5").textContent

    console.log(input)
    lista = [ag1,ag2,ag3,ag4,ag5]
    
    for(let i = 0; i < lista.length; i++){
        if(input.includes(lista[i])){
            console.log("ceci papa")
        }else{
            console.log("ceci eletro")
        }
    }
}