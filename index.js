function calculation(reqSum, machine) {
    if (reqSum % 100 !== 0 || reqSum === 0) {
        return false;
    }

    const cassettesDataCopy = {};
    for (const key of Object.keys(machine.cassettes)) {
        if (machine.cassettes[key].length) {
            cassettesDataCopy[key] = []
            for (const cassetteObj of machine.cassettes[key]) {
                if (!cassetteObj.cassette.quantity) continue;
                cassettesDataCopy[key].push({id: cassetteObj.id, quantity: cassetteObj.cassette.quantity, taken: cassetteObj.cassette.taken});
            }
        }
    }

    for (const key of Object.keys(machine.cassettes).reverse()) {
        if (reqSum <= 0) {
            break;
        }

        if (Math.floor(reqSum / key) === 0) {
            continue;
        }

        for (const cassetteObj of machine.cassettes[key]) {
            if (cassetteObj.cassette.quantity === 0) {
                continue;
            }
            if (reqSum <= 0) {
                break;
            }

            let amount = Math.floor(reqSum / key);

            if (cassetteObj.cassette.quantity < amount) {
                amount = cassetteObj.cassette.quantity;
            }

            let moneyToSend = cassetteObj.cassette.sendMoney(amount);
            if (reqSum > 0) {
                reqSum -= moneyToSend;
            }
        }

    }

    // В случае если денег оказалось недостаточно, нужно восстановить количество купюр в кассетах
    if (reqSum !== 0) {
        for (let key of Object.keys(cassettesDataCopy)) {
            for (const cassetteCopyObj of cassettesDataCopy[key]) {
                const id = cassetteCopyObj.id;
                const cassetteCopyQuantity = cassetteCopyObj.quantity;
                const cassetteCopyTaken = cassetteCopyObj.taken;
                const cassette = machine.cassettes[key].find(el => el.id === id).cassette;

                if (cassette.quantity === cassetteCopyQuantity && cassette.taken === cassetteCopyTaken) continue;

                cassette.quantity = cassetteCopyQuantity;
                cassette.taken = cassetteCopyTaken;
            }
        }
    }

    return reqSum === 0;
}

class Cassette {
    #id;
    #value;
    #status;
    #quantity;
    #taken;
    constructor(value, quantity, status, id) {
        if (typeof value !== 'number' || typeof status !== 'boolean' || typeof quantity !== 'number') {
            console.error("Неверный тип");
            return;
        }
        if (value <= 0 || quantity < 0) {
            console.error("Неверное значение");
            return;
        }
        this.#id = id;
        this.#value = value;
        this.#status = status;
        this.#quantity = quantity;
        this.#taken = 0;
    }

    get id() {
        return this.#id;
    }

    get value() {
        return this.#value;
    }

    get status() {
        return this.#status;
    }

    get quantity() {
        return this.#quantity;
    }

    get taken() {
        return this.#taken;
    }

    set quantity(newQuantity) {
        if (typeof newQuantity !== 'number') return;
        if (newQuantity < 0) return;
        this.#quantity = newQuantity;
    }

    set taken(newTaken) {
        if (typeof newTaken !== 'number') return;
        if (newTaken < 0) return;
        this.#taken = newTaken;
    }

    sendMoney(amount) {
        if (typeof amount !== 'number') {
            console.error("Неверный тип");
            return 0;
        }
        if (!this.#status) {
            console.error("Кассета неисправна")
            return 0;
        }
        if (this.#quantity < amount) {
            console.error("Количество купюр меньше необходимого");
            return 0;
        }
        this.#quantity -= amount;
        this.#taken += amount;
        return this.#value * amount;
    }

    getHTML() {
        return `<li class="cassettes__cassette cassette" data-id=${this.#id} data-value=${this.#value}>
            <div class="cassette__id">ID кассеты: <span class="id">${this.#id}</span></div>
            <div class="cassette__value">Номинал: <span class="value">${this.#value}</span></div>
            <div class="cassette__quantity">Осталось купюр: <span class="quantity">${this.#quantity}</span></div>
            <div class="cassette__taken">Взято купюр: <span class="taken">${this.#taken}</span></div>
            <div class="cassette__status">Кассета ${!this.#status ? 'не' : ''}исправна</div>
        </li>`
    }
}

class Machine {
    #cassettesMap;
    #cassettesAmount;
    constructor() {
        this.#cassettesMap = {
            100: [],
            200: [],
            500: [],
            1000: [],
            2000: [],
            5000: []
        }
        this.#cassettesAmount = 0;
    }

    get cassettes() {
        return this.#cassettesMap;
    }

    get amount() {
        return this.#cassettesAmount;
    }

    addCassette(value, quantity, status) {
        if (this.#cassettesAmount > 8) {
            console.error("Превышено количество кассет");
            return '';
        }
        if (!(String(value) in this.#cassettesMap)) {
            console.error("Неверный номинал кассеты");
            return '';
        }
        if (quantity < 0) {
            console.error("Количество купюр в кассете не может быть отрицательным");
            return '';
        }
        this.#cassettesAmount++
        const cassette = new Cassette(Number(value), quantity, status, String(this.#cassettesAmount));

        this.#cassettesMap[String(value)].push({id: String(this.#cassettesAmount), cassette: cassette});

        return cassette.getHTML();
    }
}

function getRequestedCassette(id, value, taken) {
    return `<li class="request-cassettes__item"><div class="item-row">ID: <span class="id">${id}</span></div><div class="item-row">Номинал: <span class="value">${value}</span></div><div class="item-row">Взято купюр: <span class="taken">${taken}</span></div></li>`;
}


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

