export default function calculation(reqSum, machine) {
    if (reqSum % 100 !== 0 || reqSum === 0) {
        return false;
    }

    const cassettesDataCopy = {};
    for (const key of Object.keys(machine.cassettes)) {
        if (machine.cassettes[key].length) {
            cassettesDataCopy[key] = []
            for (const cassetteObj of machine.cassettes[key]) {
                cassettesDataCopy[key].push({id: cassetteObj.id, quantity: cassetteObj.cassette.quantity, taken: cassetteObj.cassette.taken});
            }
            // cassettesCopy[key] = machine.cassettes[key];
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
        // for (let key of Object.keys(machine.cassettes)) {
        //     for (const cassetteObj of machine.cassettes[key]) {
        //         const id = cassetteObj.id;
        //         const cassette = cassetteObj.cassette;
        //         const cassetteCopy = cassettesCopy[key].find(el => el.id === id);
        //
        //         if (cassette.quantity === cassetteCopy.quantity && cassette.taken === cassetteCopy.taken) continue;
        //
        //         cassette.quantity = cassetteCopy.quantity;
        //         cassette.taken = cassetteCopy.taken;
        //     }
        // }
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
