document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form');
    const boletosLista = document.getElementById('boletos-lista');

    // Função para criar um item da lista de boletos
    function criarBoletoItem(boleto) {
        const li = document.createElement('li');
        li.classList.add('boleto');
        if (boleto.pago) {
            li.classList.add('pago');
        }

        li.innerHTML = `
            <span>
                <strong>${boleto.descricao}</strong><br>
                Valor: R$ ${boleto.valor.toFixed(2)}<br>
                Data de Vencimento: ${boleto.dataVencimento}
            </span>
            <div class="botoes">
                <button class="pago" data-id="${boleto.id}">
                    ${boleto.pago ? 'Desmarcar como Pago' : 'Marcar como Pago'}
                </button>
                <button class="remover" data-id="${boleto.id}">Remover</button>
            </div>
        `;
        return li;
    }

    // Função para adicionar um novo boleto
    function adicionarBoleto(boleto) {
        const boletoItem = criarBoletoItem(boleto);
        boletosLista.appendChild(boletoItem);
        salvarBoletos();
    }

    // Função para atualizar a lista de boletos
    function atualizarLista() {
        boletosLista.innerHTML = '';
        const boletos = obterBoletos();
        boletos.forEach(boleto => {
            const boletoItem = criarBoletoItem(boleto);
            boletosLista.appendChild(boletoItem);
        });
    }

    // Função para marcar um boleto como pago
    function marcarComoPago(id) {
        const boletos = obterBoletos().map(boleto => {
            if (boleto.id === id) {
                return { ...boleto, pago: !boleto.pago };
            }
            return boleto;
        });
        salvarBoletos(boletos);
        atualizarLista();
    }

    // Função para remover um boleto
    function removerBoleto(id) {
        const boletos = obterBoletos().filter(boleto => boleto.id !== id);
        salvarBoletos(boletos);
        atualizarLista();
    }

    // Função para salvar boletos no localStorage
    function salvarBoletos(boletos) {
        localStorage.setItem('boletos', JSON.stringify(boletos));
    }

    // Função para obter boletos do localStorage
    function obterBoletos() {
        const boletos = localStorage.getItem('boletos');
        return boletos ? JSON.parse(boletos) : [];
    }

    // Adiciona um evento para o formulário de adição de boletos
    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const descricao = document.getElementById('descricao').value.trim();
        const valor = parseFloat(document.getElementById('valor').value);
        const dataVencimento = document.getElementById('dataVencimento').value;

        if (descricao && !isNaN(valor) && dataVencimento) {
            const boleto = {
                id: Date.now().toString(),
                descricao,
                valor,
                dataVencimento,
                pago: false
            };
            adicionarBoleto(boleto);
            form.reset();
        }
    });

    // Adiciona eventos para os botões de marcar como pago e remover
    boletosLista.addEventListener('click', (event) => {
        const id = event.target.getAttribute('data-id');
        if (id) {
            if (event.target.classList.contains('pago')) {
                marcarComoPago(id);
            } else if (event.target.classList.contains('remover')) {
                removerBoleto(id);
            }
        }
    });

    atualizarLista();
});
