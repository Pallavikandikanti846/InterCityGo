import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoCardOutline, IoCloseOutline, IoAddOutline, IoWalletOutline, IoCheckmarkCircle } from "react-icons/io5";
import BottomNav from "../components/BottomNav";

export default function Payments() {
  const navigate = useNavigate();
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [showAddCard, setShowAddCard] = useState(false);
  const [selectedPaymentType, setSelectedPaymentType] = useState("");
  const [cardForm, setCardForm] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
    cardType: ""
  });
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Load payment methods and transactions from localStorage
    const storedMethods = localStorage.getItem("paymentMethods");
    const storedTransactions = localStorage.getItem("transactions");
    
    if (storedMethods) {
      setPaymentMethods(JSON.parse(storedMethods));
    }
    if (storedTransactions) {
      // Filter to only show successful transactions
      const allTransactions = JSON.parse(storedTransactions);
      const successfulTransactions = allTransactions.filter(t => t.status === "successful");
      setTransactions(successfulTransactions);
      // Update localStorage to only keep successful transactions
      if (successfulTransactions.length !== allTransactions.length) {
        localStorage.setItem("transactions", JSON.stringify(successfulTransactions));
      }
    }
  }, []);

  const handleAddCard = () => {
    setShowAddCard(true);
  };

  const handlePaymentTypeSelect = (type) => {
    setSelectedPaymentType(type);
    if (type === "gpay") {
      handleGPayPayment();
    }
  };

  const handleCardFormChange = (e) => {
    const { name, value } = e.target;
    setCardForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCardSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate card processing
    setTimeout(() => {
      const newCard = {
        id: Date.now(),
        type: cardForm.cardType || "Credit Card",
        last4: cardForm.cardNumber.slice(-4),
        expiry: cardForm.expiryDate,
        isDefault: paymentMethods.length === 0
      };
      
      const updatedMethods = [...paymentMethods, newCard];
      setPaymentMethods(updatedMethods);
      localStorage.setItem("paymentMethods", JSON.stringify(updatedMethods));
      
      setShowAddCard(false);
      setCardForm({
        cardNumber: "",
        expiryDate: "",
        cvv: "",
        cardholderName: "",
        cardType: ""
      });
      setIsProcessing(false);
      
      // Process the booking
      processBooking();
    }, 2000);
  };

  const handleGPayPayment = () => {
    setIsProcessing(true);
    // Simulate GPay processing
    setTimeout(() => {
      const gpayMethod = {
        id: Date.now(),
        type: "Google Pay",
        last4: "GPay",
        expiry: "N/A",
        isDefault: paymentMethods.length === 0
      };
      
      const updatedMethods = [...paymentMethods, gpayMethod];
      setPaymentMethods(updatedMethods);
      localStorage.setItem("paymentMethods", JSON.stringify(updatedMethods));
      
      setIsProcessing(false);
      processBooking();
    }, 2000);
  };

  const processBooking = () => {
    // Get booking data from localStorage
    const searchData = JSON.parse(localStorage.getItem("searchData") || "{}");
    
    // Calculate fare
    const PRIVATE_RIDE_PER_KM = 2.15;
    const POOLING_DISCOUNT = 0.35;
    const BASE_DISTANCE_KM = 50;
    const BASE_TAXES_FEES = 10.0;
    
    const estimatedDistance = BASE_DISTANCE_KM;
    const baseFare = searchData.rideType === "pooling" 
      ? estimatedDistance * PRIVATE_RIDE_PER_KM * POOLING_DISCOUNT
      : estimatedDistance * PRIVATE_RIDE_PER_KM;
    const total = baseFare + BASE_TAXES_FEES;
    
    // Create transaction (only for successful bookings)
    const transaction = {
      id: Date.now(),
      route: `${searchData.pickupLocation || "Pickup"} to ${searchData.dropoffLocation || "Dropoff"}`,
      date: new Date().toLocaleDateString("en-US", { 
        month: "short", 
        day: "numeric", 
        year: "numeric" 
      }),
      amount: total,
      type: searchData.rideType || "private",
      status: "successful"
    };
    
    const updatedTransactions = [...transactions, transaction];
    setTransactions(updatedTransactions);
    localStorage.setItem("transactions", JSON.stringify(updatedTransactions));
    
    // Clear search data
    localStorage.removeItem("searchData");
    
    // Navigate to trips page
    navigate("/trips");
  };

  const removePaymentMethod = (id) => {
    const updatedMethods = paymentMethods.filter(method => method.id !== id);
    setPaymentMethods(updatedMethods);
    localStorage.setItem("paymentMethods", JSON.stringify(updatedMethods));
  };

  if (isProcessing) {
    return (
      <div className="page">
        <header className="header">
          <div style={{ width: "24px" }}></div>
          <h1 className="page-title">Processing Payment</h1>
          <div style={{ width: "24px" }}></div>
        </header>
        <main className="content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              width: '60px', 
              height: '60px', 
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #3B82F6',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 20px'
            }}></div>
            <h3>Processing your payment...</h3>
            <p style={{ color: '#6B7280', marginTop: '10px' }}>Please don't close this page</p>
          </div>
        </main>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="page">
      <header className="header">
        <h1 className="page-title">Payments</h1>
      </header>

      <main className="content">
        {!showAddCard ? (
          <>
            <section className="payment-section">
              <div className="section-header">
                <h2 className="section-title">Payment Methods</h2>
                <button className="add-btn" onClick={handleAddCard}>
                  <IoAddOutline size={18} /> Add
                </button>
              </div>
              {paymentMethods.length === 0 ? (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '40px 20px',
                  backgroundColor: '#f9fafb',
                  borderRadius: '12px',
                  margin: '20px 0'
                }}>
                  <IoCardOutline size={48} color="#9CA3AF" />
                  <p style={{ marginTop: '12px', color: '#6B7280' }}>No payment methods added yet</p>
                  <p style={{ fontSize: '14px', color: '#9CA3AF', marginTop: '4px' }}>Add a payment method to complete your booking</p>
                </div>
              ) : (
                paymentMethods.map((method) => (
                  <div key={method.id} className="payment-card" style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '16px',
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    marginBottom: '12px',
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                  }}>
                    <IoCardOutline className="card-icon" size={24} color="#6B7280" />
                    <div className="card-details" style={{ flex: 1, marginLeft: '12px' }}>
                      <p style={{ margin: 0, fontWeight: '500' }}>{method.type} •••• {method.last4}</p>
                      <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#6B7280' }}>
                        {method.expiry !== "N/A" ? `Expires ${method.expiry}` : "Digital Wallet"}
                      </p>
                    </div>
                    <button 
                      className="card-remove" 
                      onClick={() => removePaymentMethod(method.id)}
                      style={{ 
                        background: 'none', 
                        border: 'none', 
                        cursor: 'pointer',
                        padding: '8px',
                        borderRadius: '6px',
                        color: '#9CA3AF'
                      }}
                    >
                      <IoCloseOutline size={20} />
                    </button>
                  </div>
                ))
              )}
            </section>

            {transactions.filter(t => t.status === "successful").length > 0 && (
              <section className="payment-section">
                <h2 className="section-title">Transaction History</h2>
                {transactions.filter(t => t.status === "successful").map((transaction) => (
                  <div key={transaction.id} className="transaction-card" style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '16px',
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    marginBottom: '12px',
                    border: '1px solid #e5e7eb'
                  }}>
                    <div>
                      <p style={{ margin: 0, fontWeight: '500' }}>{transaction.route}</p>
                      <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#6B7280' }}>{transaction.date}</p>
                    </div>
                    <p style={{ margin: 0, fontWeight: '600', color: '#059669' }}>${transaction.amount.toFixed(2)}</p>
                  </div>
                ))}
              </section>
            )}
          </>
        ) : (
          <div className="add-card-section">
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ margin: '0 0 8px 0' }}>Add Payment Method</h2>
              <p style={{ margin: 0, color: '#6B7280' }}>Choose your preferred payment method</p>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
              <button
                className={`payment-type-btn ${selectedPaymentType === "credit" ? "selected" : ""}`}
                onClick={() => setSelectedPaymentType("credit")}
                style={{
                  flex: 1,
                  padding: '16px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  background: selectedPaymentType === "credit" ? '#eff6ff' : 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <IoCardOutline size={24} color={selectedPaymentType === "credit" ? "#3B82F6" : "#6B7280"} />
                <span style={{ fontSize: '14px', fontWeight: '500' }}>Credit Card</span>
              </button>
              
              <button
                className={`payment-type-btn ${selectedPaymentType === "debit" ? "selected" : ""}`}
                onClick={() => setSelectedPaymentType("debit")}
                style={{
                  flex: 1,
                  padding: '16px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  background: selectedPaymentType === "debit" ? '#eff6ff' : 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <IoCardOutline size={24} color={selectedPaymentType === "debit" ? "#3B82F6" : "#6B7280"} />
                <span style={{ fontSize: '14px', fontWeight: '500' }}>Debit Card</span>
              </button>
              
              <button
                className={`payment-type-btn ${selectedPaymentType === "gpay" ? "selected" : ""}`}
                onClick={() => handlePaymentTypeSelect("gpay")}
                style={{
                  flex: 1,
                  padding: '16px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  background: selectedPaymentType === "gpay" ? '#eff6ff' : 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <div style={{ 
                  width: '24px', 
                  height: '24px', 
                  background: 'linear-gradient(45deg, #4285F4, #34A853, #FBBC05, #EA4335)',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <span style={{ color: 'white', fontSize: '12px', fontWeight: 'bold' }}>G</span>
                </div>
                <span style={{ fontSize: '14px', fontWeight: '500' }}>Google Pay</span>
              </button>
            </div>

            {(selectedPaymentType === "credit" || selectedPaymentType === "debit") && (
              <form onSubmit={handleCardSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Card Number</label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={cardForm.cardNumber}
                    onChange={handleCardFormChange}
                    placeholder="1234 5678 9012 3456"
                    maxLength="19"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                    required
                  />
                </div>
                
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Expiry Date</label>
                    <input
                      type="text"
                      name="expiryDate"
                      value={cardForm.expiryDate}
                      onChange={handleCardFormChange}
                      placeholder="MM/YY"
                      maxLength="5"
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '16px'
                      }}
                      required
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>CVV</label>
                    <input
                      type="text"
                      name="cvv"
                      value={cardForm.cvv}
                      onChange={handleCardFormChange}
                      placeholder="123"
                      maxLength="4"
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '16px'
                      }}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Cardholder Name</label>
                  <input
                    type="text"
                    name="cardholderName"
                    value={cardForm.cardholderName}
                    onChange={handleCardFormChange}
                    placeholder="John Doe"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                    required
                  />
                </div>
                
                <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setShowAddCard(false)}
                    style={{
                      flex: 1,
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      background: 'white',
                      cursor: 'pointer',
                      fontSize: '16px',
                      fontWeight: '500'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{
                      flex: 1,
                      padding: '12px',
                      border: 'none',
                      borderRadius: '8px',
                      background: '#3B82F6',
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: '16px',
                      fontWeight: '500'
                    }}
                  >
                    Add Card
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}

