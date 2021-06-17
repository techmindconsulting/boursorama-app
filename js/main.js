import tauxDevise from "./currency.js";

const amountField = document.getElementById("amount");

const sourceSelectCurrency = document.getElementById("select-source-currency");
const targetSelectCurrency = document.getElementById("select-target-currency");

const alertFiedsMissing = document.querySelector(".alert-info");
const converterResult = document.querySelector(".converter-result");

function displayErrorMessage() {
    alertFiedsMissing.classList.remove("hidden");
    setTimeout(() => {
        alertFiedsMissing.classList.add("hidden");
        if (!converterResult.classList.contains("hidden")) {
            converterResult.classList.add("hidden");
        }
    }, 3000);
}

document.getElementById("btn-convert").addEventListener("click", () => {
    let amount = amountField.value;
    let sourceCurrencyIndex = sourceSelectCurrency.selectedIndex;
    let targetCurrencyIndex = targetSelectCurrency.selectedIndex;

    const isEmpty = amount.length === 0 || sourceCurrencyIndex === 0 || targetCurrencyIndex === 0;
    const currencyIsEqual = targetCurrencyIndex === sourceCurrencyIndex;

    if (isEmpty || currencyIsEqual) {
        displayErrorMessage();
    } else {
        const sourceCurrency = sourceSelectCurrency.options[sourceCurrencyIndex].value;
        const targetCurrency = targetSelectCurrency.options[targetCurrencyIndex].value;
        const rate = tauxDevise[sourceCurrency][targetCurrency];
        const reverseRate = tauxDevise[targetCurrency][sourceCurrency];

        document.getElementById("result-amount").textContent = `${amount * rate} ${targetCurrency.toUpperCase()}`;
        document.getElementById("rate-source").textContent = 
        `1 ${sourceCurrency.toUpperCase()} = ${rate} ${targetCurrency.toUpperCase()}`;
        document.getElementById("rate-target").textContent = 
        `1 ${targetCurrency.toUpperCase()} = ${reverseRate} ${sourceCurrency.toUpperCase()}`;


        document.getElementById("converter-rate").textContent = `1 ${targetCurrency.toUpperCase()}`;

        converterResult.classList.remove("hidden");
    }
});
