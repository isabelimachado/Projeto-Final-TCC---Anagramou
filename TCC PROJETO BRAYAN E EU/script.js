function alternarTema() {
    const body = document.body; //contsante do body pq vai ser alteradi
    const iconeTema = document.querySelector('.botao-tema i');//pra indicar qual o icone do botao
    
    if (body.getAttribute('data-theme') === 'dark') { //se o body tem os dados do tema escuro -> ativo
        body.removeAttribute('data-theme'); //tirar os atributos do tema escuro , pra volta pro claro
        iconeTema.className = 'fas fa-moon'; //adiciona no icone o simbolo da lua pra dizer que ta no claro e pd mudar
    } else {
        body.setAttribute('data-theme', 'dark'); //senao,tema escuro e icone do sol q eh pra volta pro claro
        iconeTema.className = 'fas fa-sun';
    }
}
