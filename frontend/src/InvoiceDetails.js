import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function InvoiceDetails() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [amount, setAmount] = useState("");
  const [showModal, setShowModal] = useState(false);

  const fetchInvoice = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/invoices/${id}`
      );
      setData(res.data);
    } catch (err) {
      console.log(err);
      alert("Error fetching invoice");
    }
  };

  useEffect(() => {
    fetchInvoice();
  }, []);

  const addPayment = async () => {
    try {
      await axios.post(
        `http://localhost:5000/api/invoices/${id}/payments`,
        { amount: Number(amount) }
      );
      setAmount("");
      setShowModal(false);
      fetchInvoice();
    } catch (err) {
      alert("Payment error");
    }
  };

  if (!data) return <h2>Loading...</h2>;

  const { invoice, lines, payments } = data;

  return (
    <div style={{
      background: "#f4f6f9",
      minHeight: "100vh",
      padding: "40px"
    }}>
      <div style={{
        maxWidth: "900px",
        margin: "auto",
        background: "#ffffff",
        borderRadius: "16px",
        padding: "30px",
        boxShadow: "0 8px 25px rgba(0,0,0,0.08)"
      }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h2 style={{ margin: 0 }}>Invoice #{invoice.invoiceNumber}</h2>
            <p style={{ color: "#666", marginTop: 5 }}>{invoice.customerName}</p>
          </div>

          <span style={{
            padding: "8px 16px",
            borderRadius: "20px",
            fontWeight: "bold",
            background:
              invoice.status === "PAID" ? "#d4edda" : "#fff3cd",
            color:
              invoice.status === "PAID" ? "#155724" : "#856404"
          }}>
            {invoice.status}
          </span>
        </div>

        <hr style={{ margin: "20px 0" }} />

        {/* Dates */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
          <div>
            <strong>Issue Date:</strong><br />
            {new Date(invoice.issueDate).toDateString()}
          </div>
          <div>
            <strong>Due Date:</strong><br />
            {new Date(invoice.dueDate).toDateString()}
          </div>
        </div>

        {/* Line Items */}
        <h3>Line Items</h3>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f1f3f5" }}>
              <th style={{ padding: 10, textAlign: "left" }}>Description</th>
              <th style={{ padding: 10 }}>Qty</th>
              <th style={{ padding: 10 }}>Unit Price</th>
              <th style={{ padding: 10 }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {lines.map(line => (
              <tr key={line._id}>
                <td style={{ padding: 10 }}>{line.description}</td>
                <td style={{ padding: 10, textAlign: "center" }}>{line.quantity}</td>
                <td style={{ padding: 10, textAlign: "center" }}>₹{line.unitPrice}</td>
                <td style={{ padding: 10, textAlign: "center" }}>₹{line.lineTotal}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <hr style={{ margin: "20px 0" }} />

        {/* Totals */}
        <div style={{ textAlign: "right" }}>
          <p><strong>Total:</strong> ₹{invoice.total}</p>
          <p><strong>Paid:</strong> ₹{invoice.amountPaid}</p>
          <p style={{ fontSize: "18px" }}>
            <strong>Balance Due:</strong> ₹{invoice.balanceDue}
          </p>
        </div>

        <hr style={{ margin: "20px 0" }} />

        {/* Payments */}
        <h3>Payments</h3>
        {payments.length === 0 && <p>No payments yet</p>}
        {payments.map(p => (
          <div key={p._id} style={{
            background: "#f8f9fa",
            padding: "10px",
            borderRadius: "8px",
            marginBottom: "8px",
            display: "flex",
            justifyContent: "space-between"
          }}>
            <span>₹{p.amount}</span>
            <span>{new Date(p.paymentDate).toDateString()}</span>
          </div>
        ))}

        <button
          onClick={() => setShowModal(true)}
          style={{
            marginTop: "15px",
            padding: "10px 20px",
            borderRadius: "8px",
            border: "none",
            background: "#007bff",
            color: "white",
            cursor: "pointer"
          }}
        >
          Add Payment
        </button>

        {showModal && (
          <div style={{ marginTop: "20px" }}>
            <input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              style={{ padding: 8, marginRight: 10 }}
            />
            <button onClick={addPayment}>Submit</button>
          </div>
        )}

      </div>
    </div>
  );
}

export default InvoiceDetails;