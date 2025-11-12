// src/pages/Dashboard.jsx
import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import confetti from "canvas-confetti";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [item, setItem] = useState("");
  const [amount, setAmount] = useState("");
  const [firstExpense, setFirstExpense] = useState(true);

  // Destinations & Hotels data
  const places = [
    { title: "🏯 Rajwada Palace", desc: "Historic royal palace in the heart of Indore." },
    { title: "🏰 Lal Bagh Palace", desc: "Royal heritage museum and garden." },
    { title: "🍢 Sarafa Bazaar", desc: "Famous evening food market. Opens after 7 PM." },
    { title: "🍜 Chhappan Dukaan", desc: "Foodie paradise with 56 shops." },
    { title: "🪞 Kanch Mandir", desc: "Beautiful Jain temple made of glass." }
  ];

  const stays = [
    { title: "🏨 Radisson Blu", desc: "Luxury stay near the airport." },
    { title: "⭐ Sayaji Hotel", desc: "Premium 5-star hotel." },
    { title: "🛏 Hotel Tuli Inn", desc: "Mid-range, clean, and central." },
    { title: "💰 Budget Hotels", desc: "OYO, Treebo — affordable & reliable." }
  ];

  // Check login on mount
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const user = localStorage.getItem("username");
    if (!isLoggedIn) {
      alert("⚠ Please login first!");
      navigate("/");
    } else {
      setUsername(user);
    }
  }, [navigate]);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");
    alert("👋 Logged out successfully.");
    navigate("/");
  };

  // Expense functions
  const addExpense = () => {
    if (!item || !amount || amount <= 0) {
      alert("Please enter valid item and amount!");
      return;
    }

    const newExpense = { item, amt: parseFloat(amount) };
    setExpenses([...expenses, newExpense]);
    setItem("");
    setAmount("");

    if (firstExpense) {
      confetti({ particleCount: 100, spread: 180 });
      setFirstExpense(false);
    }
  };

  const deleteExpense = (index) => {
    const updatedExpenses = expenses.filter((_, i) => i !== index);
    setExpenses(updatedExpenses);
  };

  const resetExpenses = () => {
    if (window.confirm("Clear all expenses?")) {
      setExpenses([]);
    }
  };

  const saveTrip = () => {
    if (expenses.length === 0) {
      alert("No expenses to save!");
      return;
    }
    const data = JSON.stringify(expenses, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "my_indore_trip.json";
    a.click();
  };

  const total = expenses.reduce((sum, exp) => sum + exp.amt, 0);

  // FAQ toggle
  const toggleFAQ = (index) => {
    const faqItems = document.querySelectorAll(".faq-item");
    faqItems[index].classList.toggle("active");
  };

  return (
    <div className="dashboard-container">
      <div className="logout-container">
        <button className="logout-btn" onClick={handleLogout}>🚪 Logout</button>
      </div>

      <h2>Welcome, {username}!</h2>

      <header>
        <div className="hero-content">
          <h1>✨ Indore Travel Planner</h1>
          <div className="location-badge">
            <i className="fas fa-map-marker-alt"></i> Indore, Madhya Pradesh 🇮🇳
          </div>
        </div>
      </header>

      <div className="container">
        {/* Destinations */}
        <section>
          <h2><i className="fas fa-landmark"></i> Top Destinations</h2>
          <div className="card-container">
            {places.map((p, i) => (
              <div className="card" key={i}>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Hotels */}
        <section>
          <h2><i className="fas fa-hotel"></i> Hotel Stays</h2>
          <div className="card-container">
            {stays.map((h, i) => (
              <div className="card" key={i}>
                <h3>{h.title}</h3>
                <p>{h.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Transport */}
        <section>
          <h2><i className="fas fa-bus"></i> Transport Info</h2>
          <ul className="transport-info">
            <li><i className="fas fa-scooter"></i> Auto: ₹30–₹50</li>
            <li><i className="fas fa-car"></i> Cab: ₹8–₹12/km</li>
            <li><i className="fas fa-key"></i> Car rental: ₹1500–₹2500/day</li>
            <li><i className="fas fa-train"></i> Railway: Indore Junction (INDB)</li>
            <li><i className="fas fa-plane"></i> Airport: Devi Ahilya Bai Holkar (IDR)</li>
          </ul>
        </section>

        {/* Expense Tracker */}
        <section>
          <h2><i className="fas fa-wallet"></i> 💸 Expense Tracker</h2>
          <div className="expense-form">
            <input
              type="text"
              placeholder="e.g., Poha, Hotel"
              value={item}
              onChange={(e) => setItem(e.target.value)}
            />
            <input
              type="number"
              placeholder="₹ Amount"
              step="0.01"
              min="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <button onClick={addExpense}>Add</button>
          </div>

          <div id="list">
            {expenses.length === 0 && <p style={{textAlign:"center", color:"#888"}}>No expenses added.</p>}
            {expenses.map((exp, i) => (
              <div className="expense-item" key={i}>
                <span><strong>{exp.item}</strong>: ₹{exp.amt.toFixed(2)}</span>
                <button onClick={() => deleteExpense(i)}>🗑</button>
              </div>
            ))}
          </div>
          <div className="total">Total: ₹{total.toFixed(2)}</div>
          <div className="action-buttons">
            <button className="btn-save" onClick={saveTrip}>💾 Save</button>
            <button className="btn-reset" onClick={resetExpenses}>🗑 Reset</button>
          </div>
        </section>

        {/* FAQ */}
        <section>
          <h2><i className="fas fa-question-circle"></i> FAQ</h2>
          <div className="faq-item">
            <div className="faq-question" onClick={() => toggleFAQ(0)}>
              Best time to visit? <i className="fas fa-chevron-down"></i>
            </div>
            <div className="faq-answer">October to March — perfect weather!</div>
          </div>
          <div className="faq-item">
            <div className="faq-question" onClick={() => toggleFAQ(1)}>
              Safe for solo travelers? <i className="fas fa-chevron-down"></i>
            </div>
            <div className="faq-answer">Yes! Indore is clean, safe, and friendly.</div>
          </div>
          <div className="faq-item">
            <div className="faq-question" onClick={() => toggleFAQ(2)}>
              Must-try foods? <i className="fas fa-chevron-down"></i>
            </div>
            <div className="faq-answer">Poha, Jalebi, Garadu, Bhutte ka Kees!</div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
