import { useState, useEffect } from "react";
import { IoCardOutline, IoCloseOutline, IoAddOutline, IoWalletOutline } from "react-icons/io5";
import BottomNav from "../components/BottomNav";

export default function Payments() {
  // In a real app, this would come from API/backend
  // For now, checking localStorage for any completed bookings
  const [hasPayments, setHasPayments] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    // Check if user has made any bookings/payments
    // This is a simulation - in real app, fetch from backend
    const storedBookings = localStorage.getItem("completedBookings");
    if (storedBookings) {
      const bookings = JSON.parse(storedBookings);
      setHasPayments(bookings.length > 0);
      setTransactions(bookings);
    }
  }, []);

  // Empty state when no payments have been made
  if (!hasPayments) {
    return (
      <div className="page">
        <header className="header">
          <div style={{ width: "24px" }}></div>
          <h1 className="page-title">Payments</h1>
          <div style={{ width: "24px" }}></div>
        </header>

        <main className="content">
          <div className="empty-payments-state">
            <IoWalletOutline size={80} color="#D1D5DB" />
            <h2 className="empty-title">No Payments Yet</h2>
            <p className="empty-description">
              Your payment history will appear here once you book and pay for your first ride.
            </p>
          </div>
        </main>

        <BottomNav />
      </div>
    );
  }

  // Show payments when user has transactions
  return (
    <div className="page">
      <header className="header">
        <div style={{ width: "24px" }}></div>
        <h1 className="page-title">Payments</h1>
        <div style={{ width: "24px" }}></div>
      </header>

      <main className="content">
        <section className="payment-section">
          <div className="section-header">
            <h2 className="section-title">Payment Methods</h2>
            <button className="add-btn">
              <IoAddOutline size={18} /> Add
            </button>
          </div>
          {paymentMethods.length === 0 ? (
            <p className="empty-state-small">No payment methods added yet</p>
          ) : (
            paymentMethods.map((method, index) => (
              <div key={index} className="payment-card">
                <IoCardOutline className="card-icon" />
                <div className="card-details">
                  <p className="card-type">{method.type} •••• {method.last4}</p>
                  <p className="card-expiry">Expires {method.expiry}</p>
                </div>
                <button className="card-remove">
                  <IoCloseOutline size={20} />
                </button>
              </div>
            ))
          )}
        </section>

        <section className="payment-section">
          <h2 className="section-title">Transaction History</h2>
          {transactions.map((transaction, index) => (
            <div key={index} className="transaction-card">
              <div>
                <p className="transaction-date">{transaction.date}</p>
                <p className="transaction-route">{transaction.route}</p>
              </div>
              <p className="transaction-amount">${transaction.amount.toFixed(2)}</p>
            </div>
          ))}
        </section>
      </main>

      <BottomNav />
    </div>
  );
}

