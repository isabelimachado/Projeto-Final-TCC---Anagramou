const listaAchou = []
function mostrarInstrucoes() {
    document.getElementById('Instrucoes').classList.remove('oculto');
}

function fecharInstrucoes() {
    document.getElementById('Instrucoes').classList.add('oculto');
}

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
function mostrarRanking() {
    document.getElementById("ranking").classList.toggle("aberta");
    document.getElementById("divJogador").classList.toggle("aberta");
}
function fecharGaveta() {
    document.getElementById("ranking").classList.remove("aberta");
    document.getElementById("divJogador").classList.remove("aberta");
}
/* 
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
            listaPalavras[i].style.textTransform = "uppercase";
            listaPalavras[i].style.animationName = "AnimPulando";
            if (listaCampos[i]) {
                listaCampos[i].style.animationName = "aoAcertar";
            }
        }
    }
}

function InputResposta() {
    input = document.getElementById("input-jogar").value;
    ag1 = document.getElementById("p1").textContent
    ag2 = document.getElementById("p2").textContent
    ag3 = document.getElementById("p3").textContent
    ag4 = document.getElementById("p4").textContent
    ag5 = document.getElementById("p5").textContent
    ag6 = document.getElementById("p6").textContent

    console.log(ag1, ag2, ag3, ag4, ag5, ag6)
    lista = [ag1, ag2, ag3, ag4, ag5, ag6]

    for (let i = 0; i < lista.length; i++) {
        if (input.includes(lista[i]) && !listaAchou.includes(input)) {
            listaAchou.push(input)
            console.log("há algo")
            VirarDiv(input)
            break;
        }else if(listaAchou.includes(input)){
            console.log("isso ja foi colocado!!")
           
        }
        else {
            console.log("nao há resposta")
           
        }
    }

    document.getElementById("input-jogar").addEventListener("keydown", function(e) {
    if (e.key === "Enter") {
        e.preventDefault();
        InputResposta();
    }
    });
}


 */document.addEventListener("DOMContentLoaded", () => { 
    const input = document.getElementById("input-jogar");
    const tempo = document.getElementById("timeDisplay");
    let intervalo = null;
    let timer = 0;

    input.addEventListener("focus", () => {
        if (!intervalo) {
            intervalo = setInterval(() => {
                const min = Math.floor(timer / 60);
                const sec = timer % 60;
                tempo.textContent = `${min}:${sec < 10 ? '0' : ''}${sec}`;
                timer++;
                if (listaAchou.length === 6) {
                    clearInterval(intervalo);
                    intervalo = null;
                }
            }, 1000);
        }
    });
});