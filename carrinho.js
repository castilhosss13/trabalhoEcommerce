// Função para debug - verifica o localStorage
function verificarLocalStorage() {
    console.log("Verificando localStorage...");
    const carrinhoSalvo = localStorage.getItem("Carrinho");
    console.log("Carrinho no localStorage:", carrinhoSalvo);
    if (carrinhoSalvo) {
        console.log("Carrinho parseado:", JSON.parse(carrinhoSalvo));
    }
}

window.onload = function () {
    verificarLocalStorage(); // Adicione esta linha
    carregarCarrinho();
    configurarEventos();
}

function carregarCarrinho() {
    const carrinhoSalvo = localStorage.getItem("Carrinho");
    const listaProdutos = document.getElementById("lista-produtos");
    const totalItens = document.getElementById("total-itens");
    const valorTotal = document.getElementById("valor-total");

    listaProdutos.innerHTML = "";

    if (!carrinhoSalvo || carrinhoSalvo === "[]") {
        listaProdutos.innerHTML = "<p>Carrinho vazio</p>";
        totalItens.textContent = "0";
        valorTotal.textContent = "0,00";
        return;
    }

    const carrinho = JSON.parse(carrinhoSalvo);
    let total = 0;

    carrinho.forEach((produto, index) => {
        const itemDiv = document.createElement("div");
        itemDiv.className = "item-carrinho";

        itemDiv.innerHTML = `
            <img src="${produto.imagem}" alt="${produto.titulo}">
            <div class="info-produto">
                <h3>${produto.produto}</h3>
                <p>R$ ${produto.valor}</p>
            </div>
            <button class="remover-item" data-index="${index}">Remover</button>
        `;

        listaProdutos.appendChild(itemDiv);
        total += parseFloat(produto.valor);
    });

    totalItens.textContent = carrinho.length;
    valorTotal.textContent = total.toFixed(2);

    // Adiciona eventos aos botões de remover
    document.querySelectorAll('.remover-item').forEach(botao => {
        botao.addEventListener('click', function () {
            removerItem(this.dataset.index);
        });
    });
}

function configurarEventos() {
    // Evento do botão buscar CEP
    document.getElementById('buscar-cep').addEventListener('click', buscarCEP);

    // Evento do botão confirmar pedido
    document.getElementById('confirmar-pedido').addEventListener('click', confirmarPedido);

    // Formatação do CEP enquanto digita
    document.getElementById('cep-input').addEventListener('input', function (e) {
        let valor = e.target.value.replace(/\D/g, '');
        if (valor.length > 5) {
            valor = valor.substring(0, 5) + '-' + valor.substring(5, 8);
        }
        e.target.value = valor;
    });
}

function buscarCEP() {
    const cepInput = document.getElementById('cep-input').value.replace(/\D/g, '');

    if (cepInput.length !== 8) {
        alert('Por favor, digite um CEP válido (8 dígitos)');
        return;
    }

    fetch(`https://viacep.com.br/ws/${cepInput}/json/`)
        .then(resposta => resposta.json())
        .then(dados => {
            if (dados.erro) {
                throw new Error('CEP não encontrado');
            }

            document.getElementById('logradouro').textContent = dados.logradouro;
            document.getElementById('bairro').textContent = `Bairro: ${dados.bairro}`;
            document.getElementById('cidade-estado').textContent = `${dados.localidade} - ${dados.uf}`;

            document.getElementById('endereco-info').style.display = 'block';
            document.getElementById('confirmar-pedido').disabled = false;
        })
        .catch(erro => {
            alert('Erro ao buscar CEP: ' + erro.message);
        });
}

function removerItem(index) {
    const carrinhoSalvo = localStorage.getItem("Carrinho");
    if (carrinhoSalvo) {
        let carrinho = JSON.parse(carrinhoSalvo);
        carrinho.splice(index, 1);
        localStorage.setItem("Carrinho", JSON.stringify(carrinho));
        carregarCarrinho();
    }
}

function confirmarPedido() {
    const carrinhoSalvo = localStorage.getItem("Carrinho");
    const cepInput = document.getElementById('cep-input').value;

    if (!carrinhoSalvo || carrinhoSalvo === "[]") {
        alert('Carrinho vazio!');
        return;
    }

    if (!cepInput) {
        alert('Por favor, informe o CEP');
        return;
    }

    const pedido = {
        produtos: JSON.parse(carrinhoSalvo),
        cep: cepInput,
        endereco: {
            logradouro: document.getElementById('logradouro').textContent,
            bairro: document.getElementById('bairro').textContent.replace('Bairro: ', ''),
            cidadeEstado: document.getElementById('cidade-estado').textContent
        },
        totalItens: document.getElementById('total-itens').textContent,
        valorTotal: document.getElementById('valor-total').textContent,
        data: new Date().toISOString()
    };

    fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(pedido)
    })
        .then(resposta => resposta.json())
        .then(dados => {
            console.log(dados)
            alert("enviado")
            // Salva a resposta da API no localStorage para a página de confirmação
            localStorage.setItem("PedidoConfirmado", JSON.stringify(dados));
            // Redireciona para a página de confirmação
            window.location.href = "confirmacao.html";
        })
        .catch(erro => {
            alert('Erro ao confirmar pedido: ' + erro.message);
        });
}