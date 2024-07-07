import React, { createContext, useContext, useReducer, useState, useEffect } from 'react';
import './App.css';

const ExpenseContext = createContext();

const expenseReducer = (state, action) => {
  switch (action.type) {
    case 'SET_INCOME':
      return { ...state, income: action.payload };
    case 'ADD_TRANSACTION':
      return { ...state, transactions: [...state.transactions, action.payload] };
    case 'DELETE_TRANSACTION':
      return { ...state, transactions: state.transactions.filter(transaction => transaction.id !== action.payload) };
    default:
      return state;
  }
};

function App() {
  const [state, dispatch] = useReducer(expenseReducer, {
    income: 0,
    transactions: []
  });

  return (
    <ExpenseContext.Provider value={{ state, dispatch }}>
      <div className="App">
        <div className="App-container">
          <header className="App-header">
            <h1>Expense Tracker</h1>
          </header>
          <main className="App-main">
            <div className="left-panel">
              <IncomeSection />
              <AddTransaction />
            </div>
            <div className="right-panel">
              <Balance />
              <TransactionList />
            </div>
          </main>
        </div>
      </div>
    </ExpenseContext.Provider>
  );
}

function IncomeSection() {
  const { state, dispatch } = useContext(ExpenseContext);
  const [incomeInput, setIncomeInput] = useState(state.income);

  const handleIncomeChange = (e) => {
    setIncomeInput(e.target.value);
  };

  const handleIncomeSubmit = (e) => {
    e.preventDefault();
    dispatch({ type: 'SET_INCOME', payload: parseFloat(incomeInput) || 0 });
  };

  return (
    <div className="income-section">
      <h2>Set Your Income</h2>
      <form onSubmit={handleIncomeSubmit}>
        <input
          type="number"
          value={incomeInput}
          onChange={handleIncomeChange}
          placeholder="Enter your income"
        />
        <button type="submit">Set Income</button>
      </form>
    </div>
  );
}

function Balance() {
  const { state } = useContext(ExpenseContext);
  const totalExpenses = state.transactions.reduce((acc, transaction) => acc + transaction.amount, 0);
  const balance = state.income - totalExpenses;

  return (
    <div className="balance-section">
      <h2>Your Balance</h2>
      <div className="balance-amount">₹{balance.toFixed(2)}</div>
      <div className="income-expense">
        <div className="income">
          <h3>Income</h3>
          <p className="money plus">₹{state.income.toFixed(2)}</p>
        </div>
        <div className="expense">
          <h3>Expenses</h3>
          <p className="money minus">₹{totalExpenses.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}

function TransactionList() {
  const { state, dispatch } = useContext(ExpenseContext);

  return (
    <div className="transaction-list">
      <h2>Transaction History</h2>
      <ul>
        {state.transactions.map(transaction => (
          <li key={transaction.id} className={transaction.amount < 0 ? 'minus' : 'plus'}>
            {transaction.text}
            <span>₹{Math.abs(transaction.amount).toFixed(2)}</span>
            <button onClick={() => dispatch({ type: 'DELETE_TRANSACTION', payload: transaction.id })} className="delete-btn">×</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function AddTransaction() {
  const [text, setText] = useState('');
  const [amount, setAmount] = useState('');
  const { dispatch } = useContext(ExpenseContext);

  const onSubmit = (e) => {
    e.preventDefault();
    const newTransaction = {
      id: Math.floor(Math.random() * 100000000),
      text,
      amount: parseFloat(amount) || 0
    };
    dispatch({ type: 'ADD_TRANSACTION', payload: newTransaction });
    setText('');
    setAmount('');
  };

  return (
    <div className="add-transaction">
      <h2>Add New Transaction</h2>
      <form onSubmit={onSubmit}>
        <div className="form-control">
          <label htmlFor="text">Description</label>
          <input type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter description..." />
        </div>
        <div className="form-control">
          <label htmlFor="amount">Amount (negative for expense)</label>
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Enter amount..." />
        </div>
        <button className="btn">Add Transaction</button>
      </form>
    </div>
  );
}

export default App;