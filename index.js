import calculation from './calculation.js';
import Machine from './Machine.js';

const cassettesContainer = document.querySelector('.cassettes');
const cassetteForm = document.querySelector('.cassette-form'); // Форма создания кассеты
const request = document.querySelector('.request'); // Блок с формой ввода требуемой суммы и результатом

const cassetteFormInputValue = cassetteForm.querySelector('.cassette-form__value').querySelector('input');
const cassetteFormInputQuantity = cassetteForm.querySelector('.cassette-form__quantity').querySelector('input');
const cassetteFormInputStatus = cassetteForm.querySelector('.cassette-form__status').querySelector('input');

const requestInput = request.querySelector('.request__input');
const requestButton = request.querySelector('.request__send');
const requestResult = request.querySelector('.request__result');

const machine = new Machine(); // Машина с кассетами

// Создание кассеты
cassetteForm.addEventListener('click', (e) => {
    if (e.target.dataset.action === 'add') {
        if (machine.amount >= 8) return;
        if (cassetteFormInputValue.value && cassetteFormInputQuantity.value) {

            cassettesContainer.insertAdjacentHTML('beforeend', machine.addCassette(cassetteFormInputValue.value, Number(cassetteFormInputQuantity.value), cassetteFormInputStatus.checked));

            cassetteFormInputQuantity.value = '';
            cassetteFormInputValue.value = '';
            cassetteFormInputStatus.checked = true;
        }
    }
})

// Запрос на получение суммы
requestButton.addEventListener('click', (e) => {
    const input = requestInput.querySelector('input').value;
    if (!input && !machine.amount) return;

    const startTime = Date.now();

    const result = calculation(Number(input), machine);

    const requestCassettes = request.querySelector('.request__cassettes');
    requestCassettes.innerHTML = '';

    // Перерисовка кассет
    if (result) {
        for (const cassetteNode of cassettesContainer.children) {
            const id = cassetteNode.dataset.id;
            const value = cassetteNode.dataset.value;
            const cassette = machine.cassettes[value].find(el => el.id === id).cassette;

            const cassetteNodeQuantity = cassetteNode.querySelector('.quantity');

            if (cassette.quantity === Number(cassetteNodeQuantity.innerText)) {
                continue;
            }

            requestCassettes.insertAdjacentHTML('beforeend', getRequestedCassette(id, value, Number(cassetteNodeQuantity.innerText) - cassette.quantity));

            cassetteNodeQuantity.innerText = cassette.quantity;
            cassetteNode.querySelector('.taken').innerText = cassette.taken;
        }
    }

    requestResult.querySelector('.result').innerText = result ? 'Выдано' : 'Отказано';
    requestResult.querySelector('.time').innerText = String(Date.now() - startTime)
})

function getRequestedCassette(id, value, taken) {
    return `<li class="request-cassettes__item"><div class="item-row">ID: <span class="id">${id}</span></div><div class="item-row">Номинал: <span class="value">${value}</span></div><div class="item-row">Взято купюр: <span class="taken">${taken}</span></div></li>`;
}