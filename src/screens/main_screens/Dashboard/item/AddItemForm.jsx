import React, { useState } from "react";
import { useItems } from "../../../../contexts/ItemContext";
import ErrorBox from "../../../../components/ErrorAlertBox";


export default function AddItemPage() {
  const { createItem, error, setError } = useItems();

  const [itemName, setItemName] = useState("");
  const [price, setPrice] = useState("");
  const [tax, setTax] = useState(0);
  const [qty, setQty] = useState(0);
  const [loading, setLoading] = useState(false);
  const [batchNumber, setBatchNumber] = useState("");
const [expiryDate, setExpiryDate] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await createItem({ itemName, price, qty, tax,batchNumber,expiryDate });

      setItemName("");
      setPrice("");
      setQty(0);
      setTax(0);
      setBatchNumber("");
      setExpiryDate("");
    } catch (err) {
      console.error("Create item failed:", err);
    } finally {
      setLoading(false);
    }
  };

 return (
  <div className="add-page-wrapper">
    
    <div className="add-page-header">
      <h1 className="add-card-title">Add New Item</h1>
    </div>

    <div className="add-page-content">
      <ErrorBox message={error} onClose={() => setError("")} />

      <form className="add-form" onSubmit={handleSubmit}>
        <label className="add-full-width">
          Item Name
          <input
            type="text"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            required
          />
        </label>

        <label>
          Price
          <input
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </label>

        <label>
          Stock
          <input
            type="number"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            required
          />
        </label>

        <label>
          Tax %
          <input
            type="number"
            value={tax}
            onChange={(e) => setTax(e.target.value)}
          />
        </label>


          <label>
  Batch Number
  <input
    type="text"
    value={batchNumber}
    onChange={(e) => setBatchNumber(e.target.value)}
  />
</label>

<label>
  Expiry Date
  <input
    type="date"
    value={expiryDate}
     onFocus={(e) => e.target.showPicker?.()} 
    onChange={(e) => setExpiryDate(e.target.value)}
  />
</label>

        <div className="add-form-actions">
          <button  className="add-btn-primary" type="submit"  disabled={loading}>
            {loading ? "Saving..." : "Add Item"}
          </button>
        </div>
      </form>
    </div>

  </div>
);
}
