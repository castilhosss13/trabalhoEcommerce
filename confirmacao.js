window.onload = function () {
    exibirResumoPedido();

    document.getElementById('novo-pedido').addEventListener('click', function () {
        // Limpa o carrinho e redireciona para a página inicial
        localStorage.removeItem("Carrinho");
        localStorage.removeItem("PedidoConfirmado");
        window.location.href = "index.html";
    });
}

function exibirResumoPedido() {
    const pedidoSalvo = localStorage.getItem("PedidoConfirmado");
    const detalhesDiv = document.getElementById('detalhes-pedido');

    if (!pedidoSalvo) {
        detalhesDiv.innerHTML = "<p>Nenhum pedido encontrado.</p>";
        return;
    }

    try {
        const pedido = JSON.parse(pedidoSalvo);

        // A API retorna os dados dentro de um objeto, precisamos extrair
        const dadosPedido = pedido.body ? JSON.parse(pedido.body) : pedido;

        let html = `
            <h2>Resumo do Pedido</h2>
            <div class="info-section">
                <h3>Produtos:</h3>
                <ul>
        `;

        if (dadosPedido.produtos && Array.isArray(dadosPedido.produtos)) {
            dadosPedido.produtos.forEach(produto => {
                html += `<li>${produto.produto} - R$ ${produto.valor}</li>`;
            });
        }

        html += `
                </ul>
            </div>
            
            <div class="info-section">
                <h3>Endereço de Entrega:</h3>
                <p><strong>CEP:</strong> ${dadosPedido.cep || 'Não informado'}</p>
        `;

        if (dadosPedido.endereco) {
            html += `
                <p><strong>Rua:</strong> ${dadosPedido.endereco.logradouro || 'Não informado'}</p>
                <p><strong>Bairro:</strong> ${dadosPedido.endereco.bairro || 'Não informado'}</p>
                <p><strong>Cidade/Estado:</strong> ${dadosPedido.endereco.cidadeEstado || 'Não informado'}</p>
            `;
        }

        html += `
            </div>
            
            <div class="info-section">
                <h3>Total:</h3>
                <p><strong>Quantidade de itens:</strong> ${dadosPedido.totalItens || '0'}</p>
                <p><strong>Valor total:</strong> R$ ${dadosPedido.valorTotal || '0,00'}</p>
            </div>
            
            <div class="info-section">
                <h3>Data do Pedido:</h3>
                <p>${new Date(dadosPedido.data || Date.now()).toLocaleString('pt-BR')}</p>
            </div>
            
            <div class="info-section">
                <h3>ID do Pedido:</h3>
                <p>${pedido.id || 'Não disponível'}</p>
            </div>
        `;

        detalhesDiv.innerHTML = html;

    } catch (erro) {
        detalhesDiv.innerHTML = `
            <p>Erro ao carregar os detalhes do pedido.</p>
            <p>${erro.message}</p>
        `;
    }
}