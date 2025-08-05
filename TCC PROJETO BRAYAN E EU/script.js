function alternarTema() {
    const body = document.body;
    const iconeTema = document.querySelector('.botao-tema i');
    
    if (body.getAttribute('data-theme') === 'dark') {
        body.removeAttribute('data-theme');
        iconeTema.className = 'fas fa-moon';
    } else {
        body.setAttribute('data-theme', 'dark');
        iconeTema.className = 'fas fa-sun';
    }
}
