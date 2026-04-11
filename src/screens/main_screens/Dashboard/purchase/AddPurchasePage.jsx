import React, { useState } from "react";
import { usePurchases } from "../../../../contexts/PurchaseContext";
import ErrorBox from "../../../../components/ErrorAlertBox";
import { PurchaseModel } from "../../../../models/PurchaseModel";
import { useNavigate } from "react-router-dom";

export default function AddPurchasePage() {
  const { createPurchase, error, setError } = usePurchases();
  const navigate = useNavigate();

  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [amount, setAmount] = useState("");
  const [shipping, setShipping] = useState(0);
  const [loading, setLoading] = useState(false);

  const total =
    (Number(price) || 0) * (Number(amount) || 0) +
    (Number(shipping) || 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const purchaseModel = new PurchaseModel({
        product_name: productName,
        price: Number(price),
        amount: Number(amount),
        shipping: Number(shipping),
      });

      await createPurchase(purchaseModel);

      navigate("/purchase");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-page-wrapper">
      <div className="add-page-header">
        <h1 className="add-card-title">Add Purchase</h1>
      </div>

      <div className="add-page-content">
        <ErrorBox message={error} onClose={() => setError("")} />

        <form className="add-form" onSubmit={handleSubmit}>
          <label className="add-full-width">
            Product Name
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
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
            Quantity
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </label>

          <label>
            Shipping
            <input
              type="number"
              step="0.01"
              value={shipping}
              onChange={(e) => setShipping(e.target.value)}
            />
          </label>

          <div style={{ marginTop: "10px", fontWeight: "bold" }}>
            Total: {total.toFixed(2)}
          </div>

          <div className="add-form-actions">
            <button
              type="submit"
              className="add-btn-primary"
              disabled={loading}
            >
              {loading ? "Saving..." : "Add Purchase"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}