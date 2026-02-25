import { BrowserRouter, Routes, Route } from "react-router-dom";
import InvoiceDetails from "./InvoiceDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/invoices/:id" element={<InvoiceDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;