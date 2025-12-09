let carrinho = [];

function adicionarAoCarrinho(produtoAtual) {
    const produtoExistente = carrinho.some(item => item.id === produtoAtual.id);
    if (!produtoExistente) {
        carrinho.push(produtoAtual);
    }
    else {
        alert('Produto já existe no carrinho, impossível adicionar')
    }
    localStorage.setItem("Carrinho", JSON.stringify(carrinho))
    console.log(localStorage.length);
}

window.onload = function buscar() {
    let requisicao = fetch("https://ae770223-9c26-41a2-853f-9f88fccc166c-00-2ygc5paggqgi1.kirk.replit.dev/produtos")
    requisicao
        .then((respostaHTTP) => {
            console.log(respostaHTTP)
            if (respostaHTTP.ok == true) {
                return respostaHTTP.json()
            } else {
                throw new Error("Erro!!")
            }
        })
        .then((resJSON) => {
            console.log(resJSON)
            for (let i = 0; i < resJSON.length; i++) {
                const produtoAtual = resJSON[i];
                let div = document.createElement("div")
                let img = document.createElement("img")
                img.src = resJSON[i].imagem
                div.appendChild(img)
                document.querySelector("body").appendChild(div)
                let valorProdutos = document.createElement("h2")
                valorProdutos.textContent = resJSON[i].valor
                div.appendChild(valorProdutos)
                let btAdicionar = document.createElement("button")
                btAdicionar.textContent = "Adicionar"
                div.appendChild(btAdicionar)
                valorProdutos.textContent = produtoAtual.valor

                btAdicionar.addEventListener('click', function () {
                    console.log(produtoAtual);
                    
                    adicionarAoCarrinho(produtoAtual);
                });
            }
        })
        .catch((erro) => { alert(erro) })

}
