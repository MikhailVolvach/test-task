export default class Cassette {
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
