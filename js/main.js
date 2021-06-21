import Converter from "./Converter.js";

const amountField = document.getElementById("amount");

let sourceDatalistCurrency = document.getElementById("select-source-currency");
let targetDatalistCurrency = document.getElementById("select-target-currency");

const alertFiedsMissing = document.querySelector(".alert-info");
const converterResult = document.querySelector(".converter-result");

document.addEventListener("DOMContentLoaded", () => {
    Converter.getCurrencies().then((currencies) => {
        sourceDatalistCurrency = loadDataListCurrencies(sourceDatalistCurrency, currencies);
        targetDatalistCurrency.innerHTML = sourceDatalistCurrency.innerHTML;
    });

    loadHistoryItems();
});

document.getElementById("btn-convert").addEventListener("click", () => {
    let amount = amountField.value;
    let sourceCurrency = document.getElementById("source-currency").value;
    let targetCurrency = document.getElementById("target-currency").value;

    const isEmpty = amount.length === 0 || sourceCurrency.length === 0 || targetCurrency === 0;
    const currencyIsEqual = targetCurrency === sourceCurrency;

    if (isEmpty || currencyIsEqual) {
        displayErrorMessage();
    } else {
        Converter.convert(amount, sourceCurrency, targetCurrency).then((result) => {
            const symbol = document.querySelector('.select-currency option[value="' + targetCurrency + '"]').dataset
                .symbol;

            document.getElementById("result-amount").textContent = `${result} ${symbol}`;
            let historyItems = JSON.parse(localStorage.getItem("historyItems")) ?? [];

            let historyItem = {
                amount,
                sourceCurrency,
                targetCurrency,
                result: `${result} ${symbol}`,
            };

            const historyItemExists = historyItems.some((historyItem) => {
                return (
                    historyItem.sourceCurrency === sourceCurrency &&
                    historyItem.targetCurrency === targetCurrency &&
                    historyItem.amount === amount
                );
            });

            if (!historyItemExists) {
                historyItems.push(historyItem);
                localStorage.setItem("historyItems", JSON.stringify(historyItems));

                const table = document.getElementById("history-list");
                let nbLines = table.rows.length;
                let line = table.insertRow(nbLines);
                let i = 0;
                for (let property in historyItem) {
                    let cell = line.insertCell(i);
                    let text = document.createTextNode(historyItem[property]);
                    cell.append(text);
                    line.appendChild(cell);
                    i++;
                }
            }
        });

        setTimeout(() => { //wait async request(promise) ends up
            let rates = JSON.parse(localStorage.getItem("currencyRates"));
            let exchange = `${sourceCurrency}_${targetCurrency}`;
            let rate = rates.filter((rate) => rate[exchange] ?? null);
            rate = rate.shift() ?? null;
            document.getElementById(
                "rate-source"
            ).textContent = `1 ${sourceCurrency} = ${rate[exchange]} ${targetCurrency}`;

            document.getElementById("converter-rate").textContent = `1 ${targetCurrency}`;
        }, 1000);

        converterResult.classList.remove("hidden");
    }
});

function loadDataListCurrencies(dataListElement, currencies) {
    for (let currency of currencies) {
        const option = document.createElement("option");
        option.value = currency.id;
        option.text = currency.name;
        option.dataset.symbol = currency.symbol;
        dataListElement.appendChild(option);
    }

    return dataListElement;
}

function loadHistoryItems(itemStorage, tableElement)
{
    let historyItems =  JSON.parse(localStorage.getItem('historyItems')) ?? null;

    const table = document.getElementById("history-list");

    historyItems.forEach( (historyItem, index) => {
        let line = table.insertRow(index + 1);
        let i = 0;
        for (let property in historyItem) {
            let cell = line.insertCell(i);
            let text = document.createTextNode(historyItem[property]);
            cell.append(text);
            line.appendChild(cell);
            i++;
        }
    });
}

function displayErrorMessage() {
    alertFiedsMissing.classList.remove("hidden");
    setTimeout(() => {
        alertFiedsMissing.classList.add("hidden");
        if (!converterResult.classList.contains("hidden")) {
            converterResult.classList.add("hidden");
        }
    }, 3000);
}
