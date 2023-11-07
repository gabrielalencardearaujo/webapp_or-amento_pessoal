const formulario = document.forms.namedItem('consulta')
const divTransacoes = document.querySelector('.transacoes')

const consultar = event => {
  event.preventDefault()

  if (formulario.year.value) {
    managerSearch(
      formulario.name.value,
      formulario.year.value,
      formulario.month.value
    )
  } else {
    console.log('escolha um ano')
  }
}
formulario.addEventListener('submit', consultar)

function noFocus() {
  loadtransactionsName(formulario.year.value)
}

function managerSearch(nome, ano, mes) {
  const buscaDadosJSON = verificaInputs(nome, ano, mes)
  resetInputs(nome, ano, mes)
  buscaDadosJSON.forEach((elemento, index) => {
    showtransactions(elemento, index)
  })

}

function loadtransactionsName(yearInput) {
  let dadosJSON;
  (yearInput) ? dadosJSON = searchNomeJSON(gettransaction(yearInput)) : dadosJSON = [];
  criaOptions(dadosJSON)
}

function gettransaction(ano) {
  const gettransactionJSON = localStorage.getItem(`Finance${ano}`)

  if (gettransactionJSON) {
    const NodeListtransaction = JSON.parse(gettransactionJSON)
    return NodeListtransaction
  }
  return false
}

function searchNomeJSON(nodeListJSON) {
  let arrayDadosNomes = []

  if (nodeListJSON) {
    nodeListJSON.forEach(array => {
      if (array) {
        array.forEach(arrayBi => { arrayDadosNomes.push(arrayBi.nome) })
      }
    })
  } else {
    noTransactionFound()
    return []
  }

  arrayDadosNomes = arrayDadosNomes.sort().filter((valor, index) => {
    //Filtrando valores repetidos
    return arrayDadosNomes.indexOf(valor) == index
  })

  return arrayDadosNomes
}

function verificaInputs(nome, ano, mes) {
  let nodeListJSON = gettransaction(ano);
  let arrayDadosNomes = [];

  (!nodeListJSON) ? nodeListJSON = [] : '';

  if (nome && mes) {
    nodeListJSON.forEach((array, index) => {
      if (array && index == mes) {
        array.forEach(arrayBi => { (arrayBi.nome === nome) ? arrayDadosNomes.push(arrayBi) : ''; })
      }
    })

  } else if (!nome && mes) {
    nodeListJSON.forEach((array, index) => {
      if (array && index == mes) {
        array.forEach(arrayBi => { arrayDadosNomes.push(arrayBi) })
      }
    })

  } else if (!nome && !mes) {
    nodeListJSON.forEach(array => {
      if (array) {
        array.forEach(arrayBi => { arrayDadosNomes.push(arrayBi) })
      }
    })
  }

  arrayDadosNomes = arrayDadosNomes.sort().filter((valor, index) => {
    //Filtrando valores repetidos
    return arrayDadosNomes.indexOf(valor) == index
  })
  return arrayDadosNomes
}

function criaOptions(dadosJSON) {
  if (Array.isArray(dadosJSON) && dadosJSON.length > 0) {
    formulario.name.innerHTML = `<option value="">  </option>`
    dadosJSON.forEach(valor => {
      const newOption = document.createElement('option')
      newOption.setAttribute('value', `${valor}`)
      newOption.textContent = `${valor}`
      formulario.name.appendChild(newOption)
    })
  } else if (Array.isArray(dadosJSON) && dadosJSON.length == '0') {
    formulario.name.innerHTML = ` 
    <option value="">  </option>
    `
  }
}

function noTransactionFound(){
  const divNothingFound = document.createElement('div');
  divNothingFound.setAttribute('class', 'nothing_found')
  divNothingFound.textContent = 'Nenhuma transaçacão encontrada'
  divTransacoes.appendChild(divNothingFound)
}

function showtransactions(elemento, index) {

  const newDivTransacao = document.createElement('div');
  const afterTransisacao = document.createElement('div');
  let color;

  (elemento.valor < 0) ? color = `var(--color-transacao-despesa)` : color = `var(--color-transacao-renda)`;

  newDivTransacao.innerHTML = `
    <div>
    <input class="trigger_input" type="checkbox" id="item${index}">
  
    <div class="trigger-wrapper">
      <label class="labelTransicao" for="item${index}">
        <span>${elemento.nome}</span>
        <span>R$ ${elemento.valor}</span> 
        <div class="after_div_transaction" style="background-color:${color}"></div>
      </label>
      <div class="data" style="padding-bottom: 5px">
        <i>Data: ${elemento.data}</i>
      </div>
    </div>
  </div>`

  divTransacoes.appendChild(newDivTransacao)
}

function resetInputs(nome, ano, mes){

  nome.value = ''
  ano.value = ''
  mes.value = ''
  divTransacoes.innerHTML = `
    <h4>Transações Encontradas</h4>
    <hr>`
}