import * as env from "./config.js";

export default class Converter {
    static getCurrencies() {
        if (localStorage.getItem("currencies") !== null) {
            return new Promise((resolve) => {
                resolve(JSON.parse(localStorage.getItem("currencies")));
            });
        }
        return fetch(`${env.API_URL}/currencies?apiKey=${env.API_KEY}`)
            .then((response) => response.json())
            .then((data) => {
                const currencies = [];
                for (let item in data.results) {
                    let currency = {
                        id: item,
                        name: data.results[item].currencyName,
                        symbol: data.results[item].currencySymbol ?? data.results[item].currencyName,
                    };
                    currencies.push(currency);
                }

                localStorage.setItem("currencies", JSON.stringify(currencies));

                return currencies;
            })
            .catch((error) => error);
    }

    static convert(amount, from, to) {
        const exchange = `${from}_${to}`;
        const currencyRates = JSON.parse(localStorage.getItem("currencyRates")) ?? [];

        let currencyRate = currencyRates.filter((currencyRate) => Object.keys(currencyRate).shift() === exchange);
        currencyRate = currencyRate.shift() ?? [];

        if (exchange in currencyRate) {
            return new Promise((resolve) => {
                resolve((currencyRate[exchange] * amount).toFixed(2));
            });
        }

        return fetch(`${env.API_URL}/convert?q=${exchange}&compact=ultra&apiKey=${env.API_KEY}`)
            .then((response) => response.json())
            .then((data) => {
                const currencyRate = {
                    [exchange]: data[exchange],
                };
                currencyRates.push(currencyRate);
                localStorage.setItem("currencyRates", JSON.stringify(currencyRates));

                return (data[exchange] * amount).toFixed(2);
            })
            .catch((error) => error);
    }
}
