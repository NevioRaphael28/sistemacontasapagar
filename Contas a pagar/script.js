document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form');
    const contasLista = document.getElementById('contas-lista');

    // Função para criar um item da lista de contas
    function criarContaItem(conta) {
        const li = document.createElement('li');
        li.classList.add('conta');
        if (conta.paga) {
            li.classList.add('paga');
        }

        li.innerHTML = `
            <span>
                <strong>${conta.nome}</strong><br>
                Valor: R$ ${conta.valor.toFixed(2)}<br>
                Data de Vencimento: ${conta.dataVencimento}
            </span>
            <div class="botoes">
                <button class="pago" data-id="${conta.id}">${conta.paga ? 'Desmarcar como Pago' : 'Marcar como Pago'}</button>
                <button data-id="${conta.id}">Remover</button>
            </div>
        `;
        return li;
    }

    // Função para adicionar uma nova conta
    function adicionarConta(conta) {
        const contaItem = criarContaItem(conta);
        contasLista.appendChild(contaItem);
        salvarContas();
    }

    // Função para atualizar a lista de contas
    function atualizarLista() {
        contasLista.innerHTML = '';
        const contas = obterContas();
        contas.forEach(conta => {
            const contaItem = criarContaItem(conta);
            contasLista.appendChild(contaItem);
        });
    }


    // Função para marcar uma conta como paga
    function marcarComoPago(id) {
        const contas = obterContas().map(conta => {
            if (conta.id === id) {
                return { ...conta, paga: !conta.paga };
            }
            return conta;
        });
        salvarContas(contas);
        atualizarLista();
    }

    // Função para remover uma conta
    function removerConta(id) {
        const contas = obterContas().filter(conta => conta.id !== id);
        salvarContas(contas);
        atualizarLista();
    }

    // Função para salvar contas no localStorage
    function salvarContas(contas) {
        localStorage.setItem('contas', JSON.stringify(contas));
    }

    // Função para obter contas do localStorage
    function obterContas() {
        const contas = localStorage.getItem('contas');
        return contas ? JSON.parse(contas) : [];
    }

    // Adiciona um evento para o formulário de adição de contas
    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const nome = document.getElementById('nome').value.trim();
        const valor = parseFloat(document.getElementById('valor').value);
        const dataVencimento = document.getElementById('dataVencimento').value;

        if (nome && !isNaN(valor) && dataVencimento) {
            const conta = {
                id: Date.now().toString(),
                nome,
                valor,
                dataVencimento,
                paga: false
            };
            adicionarConta(conta);
            form.reset();
        }
    });

    // Adiciona eventos para os botões de marcar como pago e remover
    contasLista.addEventListener('click', (event) => {
        const id = event.target.getAttribute('data-id');
        if (id) {
            if (event.target.textContent.includes('Marcar como Pago') || event.target.textContent.includes('Desmarcar como Pago')) {
                marcarComoPago(id);
            } else if (event.target.textContent === 'Remover') {
                removerConta(id);
            }
        }
    });

    atualizarLista();
});
