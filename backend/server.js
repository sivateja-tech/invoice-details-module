import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import invoiceRoutes from "./routes/invoiceRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/invoiceDB")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.use("/api/invoices", invoiceRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});