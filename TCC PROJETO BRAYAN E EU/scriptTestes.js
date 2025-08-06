/* fetch('json/anagramas_3letras.json')
    .then(response => response.json())
    .then(palavras => {
    const ul = document.getElementById('listaPalavras');
    palavras.forEach(palavra => {
        const li = document.createElement('li');
        li.textContent = palavra;
        ul.appendChild(li);
    });
    }) */
fetch('palavrasEmJson/palavras3letras.json')
  .then(response => response.json())
  .then(palavras => {
    console.log('Palavras:', palavras);
    const palavraAleatoria = palavras[Math.floor(Math.random() * palavras.length)];
    console.log('Palavra aleatória:', palavraAleatoria);
     const p = document.getElementById('palavra');        
        p.textContent = palavraAleatoria;

  })
  .catch(erro => {
    console.error('Erro:', erro);
  });