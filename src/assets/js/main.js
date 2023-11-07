const nametransaction = document.querySelector('.input_nome') //Nome da transicao
const valuetransaction = document.querySelector('.input_valor') //Valor da transicao
const datatransaction = document.querySelector('.input_data') //Valor da transicao
const receitas = document.querySelector('.valor_receita') //Valor total dos ganhos
const despesas = document.querySelector('.valor_despesas') //Valor total dos gastos
const saldoAtual = document.querySelector('#valor_saldo_atual') //Saldo
const divTransacoes = document.querySelector('.transacoes')
let receitasValor = 0
let despesasValor = 0

function objtransaction(nametransaction, valuetransaction, datatransaction) {
  return {
    nome: nametransaction,
    valor: valuetransaction,
    data: datatransaction
  }
}

function loadtransactionsJSON() {
  const getArraytransaction = gettransaction();
  const verifyMonth = dataTime();
  (getArraytransaction) ? managerFinance(verifyMonth[0], getArraytransaction) : '';
  managerDate(verifyMonth[1])
}

function managerFinance(monthIndex, getArraytransaction) {
  getArraytransaction[monthIndex].forEach((objtransaction, index) => {
    receitasDespesasShow(objtransaction.valor)
    addtransaction(objtransaction.nome, objtransaction.valor, objtransaction.data, divTransacoes, index)
  })
}

function newtransaction() {
  console.log(datatransaction.value)
  if (nametransaction.value && valuetransaction.value && datatransaction.value) {
    const dadostransaction = objtransaction(nametransaction.value, valuetransaction.value, datatransaction.value)
    savetransaction(dadostransaction)
    resetInputs()
    loadtransactionsJSON()
    location.reload();
  } else {
    console.log('digite alguma coisa')
  }
}

function receitasDespesasShow(inputValortransaction) {
  if (inputValortransaction >= 0) {
    receitasValor += Number(inputValortransaction)
    receitas.textContent = `R$ ${receitasValor.toFixed(2)}`
  } else {
    despesasValor += Number(inputValortransaction)
    despesas.textContent = `R$ ${despesasValor.toFixed(2)}`
  }
  saldoAtual.textContent = `R$ ${receitasValor + despesasValor}`

  return [receitasValor, despesasValor, receitasValor + despesasValor]
}

function addtransaction(nome, valor, data, transacoes, index) {
  const newDivTransacao = document.createElement('div');
  const afterTransisacao = document.createElement('div');
  let color;
  (valor < 0) ? color = `var(--color-transacao-despesa)` : color = `var(--color-transacao-renda)`;

  newDivTransacao.innerHTML = `
    <div id="${index}">
      <input class="trigger_input" type="checkbox" id="item${index}">
    
      <div class="trigger-wrapper">
        <label class="labelTransicao" for="item${index}">
          <span>${nome}</span>
          <span>R$ ${valor}</span> 
          <div class="after_div_transaction" style="background-color:${color}"></div>
        </label>
        <div class="data">
          <i>Dia: ${data.slice(8, 10)}</i>
          <span class="trashtransaction" onclick="trashtransaction(event)"><i class="fa-solid fa-trash"></i></span>
        </div>
      </div>
    </div>`

  transacoes.appendChild(newDivTransacao)
}

function savetransaction(objtransaction) {
  const getArraytransaction = gettransaction()
  const verifyDate = dataTime()

  console.log(verifyDate[0])
  if (getArraytransaction && getArraytransaction[verifyDate[0]]) {
    getArraytransaction[verifyDate[0]].unshift(objtransaction)
    const transactionJSON = JSON.stringify(getArraytransaction)
    localStorage.setItem(`Finance${[verifyDate[2]]}`, transactionJSON)

  } else if (getArraytransaction && !getArraytransaction[verifyDate[0]]) {
    getArraytransaction[verifyDate[0]] = [];
    getArraytransaction[verifyDate[0]].unshift(objtransaction)
    const transactionJSON = JSON.stringify(getArraytransaction)
    localStorage.setItem(`Finance${[verifyDate[2]]}`, transactionJSON)

  } else if (!getArraytransaction) {
    const arrayDadosJSON = []
    arrayDadosJSON[verifyDate[0]] = []
    arrayDadosJSON[verifyDate[0]].unshift(objtransaction)
    const transactionJSON = JSON.stringify(arrayDadosJSON)
    localStorage.setItem(`Finance${[verifyDate[2]]}`, transactionJSON)
  }
}

function gettransaction() {
  const gettransactionJSON = localStorage.getItem('Finance2023')
  if (gettransactionJSON) {
    const NodeListtransaction = JSON.parse(gettransactionJSON)
    return NodeListtransaction
  }
  return false
}

function resetInputs() {
  nametransaction.value = ''
  valuetransaction.value = ''
  datatransaction.value = ''
  divTransacoes.innerHTML = `
    <h4>Transações de <span class="date"></span></h4>
    <hr>`
}

//Configuracoes de Lixeira
function trashtransaction(event) {
  const elementoPai = event.currentTarget.parentElement.parentElement.parentElement
  const idElementoPai = elementoPai.id
  const year = dataTime()[2]
  const month = dataTime()[0]
  const nodeListJSON = gettransaction(year)

  nodeListJSON.forEach((mes, index) => {
    if (index === month) {
      mes.forEach((elemento, index) => {
        if (idElementoPai == index) {
          mes.splice(idElementoPai, 1)
          elementoPai.remove()
        }
      })
    }
    location.reload()
  })

  const transactionJSON = JSON.stringify(nodeListJSON)
  localStorage.setItem(`Finance${year}`, transactionJSON)
}

// Configuracoes de Datas
function dataTime() {
  const newDataTime = new Date()
  const currentMonth = newDataTime.getMonth()
  const currentYear = newDataTime.getFullYear()
  const arrayMonth = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']

  return [currentMonth, arrayMonth[currentMonth], currentYear]
}

function managerDate(month) {
  const elementDateDOM = divTransacoes.querySelector('.date')
  elementDateDOM.textContent = month
}
