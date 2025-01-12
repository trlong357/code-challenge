let storedData = undefined;

async function fetchTokenPrices() {
    const response = await fetch('https://interview.switcheo.com/prices.json');
    const data = await response.json();
    const formattedData = data.reduce((acc, curr) => {
        if (acc[curr.currency]) {
            if (new Date(acc[curr.currency].date) < new Date(curr.date)) {
                acc[curr.currency] = curr;
            }
        } else {
            acc[curr.currency] = curr;
        }
        return acc;
    }, {});
    storedData = formattedData;
    return formattedData;
}

function convert(fromCurrency, toCurrency, amount) {
    const fromPrice = storedData[fromCurrency]?.price || 0;
    const toPrice = storedData[toCurrency]?.price || 0;
    if (fromPrice && toPrice) {
        return amount * fromPrice / toPrice;
    }
    return 0;
}

async function populateTokenOptions() {
    await fetchTokenPrices();
    const fromSelect = document.querySelector('#from-amount-select');
    const toSelect = document.querySelector('#to-amount-select');

    if (!fromSelect || !toSelect) {
        console.error('One or both select elements not found');
        return;
    }

    const tokens = Object.keys(storedData);
    tokens.forEach(token => {
        const option = document.createElement('option');
        option.value = token;
        option.textContent = token;

        fromSelect.appendChild(option.cloneNode(true));
        toSelect.appendChild(option.cloneNode(true));
    });
}

function showError(message) {
    alert(message); // Or use a dedicated error message element
}

function handleFormSubmit(event) {
    event.preventDefault();

    const fromAmount = parseFloat(document.querySelector('#from-amount').value);
    const fromCurrency = document.querySelector('#from-amount-select').value;
    const toCurrency = document.querySelector('#to-amount-select').value;

    if (isNaN(fromAmount) || fromAmount <= 0) {
        showError('Please enter a valid amount greater than zero.');
        return;
    }

    if (!fromCurrency) {
        showError('Please select a currency to convert from.');
        return;
    }

    if (!toCurrency) {
        showError('Please select a currency to convert to.');
        return;
    }

    const convertedAmount = convert(fromCurrency, toCurrency, fromAmount);
    document.querySelector('#to-amount').value = convertedAmount.toFixed(2);
}

document.addEventListener('DOMContentLoaded', () => {
    populateTokenOptions();
    const form = document.querySelector('form');
    form.addEventListener('submit', handleFormSubmit);
});
