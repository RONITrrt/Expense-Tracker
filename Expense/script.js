let income = 0;
let transactions = [];

function updateBalance() {
    const balanceElement = document.querySelector('.balance-amount');
    const incomeElement = document.querySelector('.money.plus');
    const expenseElement = document.querySelector('.money.minus');

    const totalExpenses = transactions.reduce((total, transaction) => {
        return total + (transaction.amount < 0 ? transaction.amount : 0);
    }, 0);

    const balance = income + transactions.reduce((total, transaction) => total + transaction.amount, 0);

    balanceElement.textContent = `₹${balance.toFixed(2)}`;
    incomeElement.textContent = `₹${income.toFixed(2)}`;
    expenseElement.textContent = `₹${Math.abs(totalExpenses).toFixed(2)}`;
}

function addTransactionToDOM(transaction) {
    const list = document.getElementById('transaction-list');
    const item = document.createElement('li');
    const sign = transaction.amount < 0 ? '-' : '+';

    item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');

    item.innerHTML = `
        ${transaction.text} <span>${sign}₹${Math.abs(transaction.amount).toFixed(2)}</span>
        <button class="delete-btn" onclick="removeTransaction(${transaction.id})">×</button>
    `;

    list.appendChild(item);
}

function removeTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id);
    updateLocalStorage();
    init();
}

function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
    localStorage.setItem('income', income.toString());
}

function init() {
    const list = document.getElementById('transaction-list');
    list.innerHTML = '';
    transactions.forEach(addTransactionToDOM);
    updateBalance();
}

document.getElementById('income-form').addEventListener('submit', function(e) {
    e.preventDefault();
    income = parseFloat(document.getElementById('income').value) || 0;
    updateLocalStorage();
    init();
    this.reset();
});

document.getElementById('transaction-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const text = document.getElementById('text').value;
    const amount = parseFloat(document.getElementById('amount').value);

    if (text.trim() === '' || isNaN(amount)) {
        alert('Please enter both text and amount');
        return;
    }

    const transaction = {
        id: Math.floor(Math.random() * 100000000),
        text,
        amount
    };

    transactions.push(transaction);
    updateLocalStorage();
    init();
    this.reset();
});

// Load data from local storage
const storedTransactions = JSON.parse(localStorage.getItem('transactions'));
const storedIncome = parseFloat(localStorage.getItem('income'));

if (Array.isArray(storedTransactions)) transactions = storedTransactions;
if (!isNaN(storedIncome)) income = storedIncome;

init();