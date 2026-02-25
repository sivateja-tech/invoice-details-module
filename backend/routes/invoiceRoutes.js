import express from "express";
import Invoice from "../models/Invoice.js";
import InvoiceLine from "../models/InvoiceLine.js";
import Payment from "../models/Payment.js";

const router = express.Router();


router.get("/:id", async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ message: "Not found" });

    const lines = await InvoiceLine.find({ invoiceId: invoice._id });
    const payments = await Payment.find({ invoiceId: invoice._id });

  
    let total = 0;
    lines.forEach(line => {
      line.lineTotal = line.quantity * line.unitPrice;
      total += line.lineTotal;
    });

    invoice.total = total;
    invoice.balanceDue = total - invoice.amountPaid;

    await invoice.save();

    res.json({
      invoice,
      lines,
      payments,
      total: invoice.total,
      amountPaid: invoice.amountPaid,
      balanceDue: invoice.balanceDue
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.post("/:id/payments", async (req, res) => {
  try {
    const { amount } = req.body;

    if (amount <= 0)
      return res.status(400).json({ message: "Amount must be > 0" });

    const invoice = await Invoice.findById(req.params.id);
    if (!invoice)
      return res.status(404).json({ message: "Invoice not found" });

    if (amount > invoice.balanceDue)
      return res.status(400).json({ message: "Overpayment not allowed" });

    await Payment.create({
      invoiceId: invoice._id,
      amount
    });

    invoice.amountPaid += amount;
    invoice.balanceDue = invoice.total - invoice.amountPaid;

    if (invoice.balanceDue === 0) {
      invoice.status = "PAID";
    }

    await invoice.save();

    res.json({ message: "Payment added" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.post("/archive/:id", async (req, res) => {
  await Invoice.findByIdAndUpdate(req.params.id, { isArchived: true });
  res.json({ message: "Archived" });
});


router.post("/restore/:id", async (req, res) => {
  await Invoice.findByIdAndUpdate(req.params.id, { isArchived: false });
  res.json({ message: "Restored" });
});

export default router;