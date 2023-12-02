export default function calculation(reqSum, machine) {
    if (reqSum % 100 !== 0 || reqSum === 0) {
        return false;
    }

    for (let key of Object.keys(machine.cassettes).reverse()) {
        if (reqSum <= 0) {
            break;
        }

        if (Math.floor(reqSum / key) === 0) {
            continue;
        }

        for (let cassetteObj of machine.cassettes[key]) {
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

    return reqSum === 0;
}
