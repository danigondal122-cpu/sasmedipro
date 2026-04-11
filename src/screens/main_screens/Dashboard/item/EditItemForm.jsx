import React, { useState, useEffect } from "react";
import { useItems } from "../../../../contexts/ItemContext";
import { useNavigate, useParams } from "react-router-dom";
import ErrorBox from "../../../../components/ErrorAlertBox";
import { ItemModel } from "../../../../models/ItemModel";
export default function EditItemPage() {
  const { items, updateItem, error, setError } = useItems();
  const navigate = useNavigate();
  const { id } = useParams(); // item ID from URL

  const [itemName, setItemName] = useState("");
  const [price, setPrice] = useState("");
  const [tax, setTax] = useState(0);
  const [qty, setQty] = useState(0);
  const [loading, setLoading] = useState(false);
  const [batchNumber, setBatchNumber] = useState("");
const [expiryDate, setExpiryDate] = useState("");


  // Preload item data
  useEffect(() => {
    const itemToEdit = items.find((item) => item.id === parseInt(id));
    if (itemToEdit) {
      setItemName(itemToEdit.itemName);
      setPrice(itemToEdit.price);
      setTax(itemToEdit.tax);
      setQty(itemToEdit.qty);
       setBatchNumber(itemToEdit.batchNumber);
  setExpiryDate(itemToEdit.expiryDate);
    }
  }, [id, items]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
       // ✅ Create ItemModel instance
      const itemModel = new ItemModel({
        item_name: itemName,
        price: Number(price),
        // qty: Number(qty),
        tax: Number(tax),
         batch_number: batchNumber,
  expiry_date: expiryDate,
        
        // You can also include status if needed
        // status: "Active",
      });

      await updateItem(id, itemModel);
      navigate("/items"); // redirect back to item list
    } catch (err) {
      console.error("Update item failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-page-wrapper">
      <div className="add-page-header">
        <h1 className="add-card-title">Edit Item</h1>
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

          {/* <label>
            Stock
            <input
              type="number"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              required
            />
          </label> */}

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
            <button type="submit" className="add-btn-primary" disabled={loading}>
              {loading ? "Updating..." : "Update Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
