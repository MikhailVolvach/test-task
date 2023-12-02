import Cassette from './Cassette.js';

export default class Machine {
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

    restoreCassettes() {
        for (let key of Object.keys(this.#cassettesMap)) {
            for (let cassetteObj of this.#cassettesMap[key]) {
                if (cassetteObj.cassette.taken) {
                    cassetteObj.cassette.restore();
                }
            }
        }
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
            console.error("Неверное значение кассеты");
            return '';
        }
        this.#cassettesAmount++
        const cassette = new Cassette(Number(value), quantity, status, String(this.#cassettesAmount));

        this.#cassettesMap[String(value)].push({id: String(this.#cassettesAmount), cassette: cassette});

        return cassette.getHTML();
    }
}