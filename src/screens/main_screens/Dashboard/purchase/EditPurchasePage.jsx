import React, { useState, useEffect } from "react";
import { usePurchases } from "../../../../contexts/PurchaseContext";
import { useNavigate, useParams } from "react-router-dom";
import ErrorBox from "../../../../components/ErrorAlertBox";
import { PurchaseModel } from "../../../../models/PurchaseModel";

export default function EditPurchasePage() {
  const { purchases, updatePurchase, error, setError } = usePurchases();
  const navigate = useNavigate();
  const { id } = useParams();

  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [amount, setAmount] = useState("");
  const [shipping, setShipping] = useState(0);
  const [loading, setLoading] = useState(false);

  // 🔹 Preload purchase data
  useEffect(() => {
    const purchaseToEdit = purchases.find(
      (p) => p.id === parseInt(id)
    );

    if (purchaseToEdit) {
      setProductName(purchaseToEdit.productName);
      setPrice(purchaseToEdit.price);
      setAmount(purchaseToEdit.amount);
      setShipping(purchaseToEdit.shipping);
    }
  }, [id, purchases]);

  // 🔹 Live total preview
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

      await updatePurchase(id, purchaseModel);

      navigate("/purchase");
    } catch (err) {
      console.error("Update purchase failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-page-wrapper">
      <div className="add-page-header">
        <h1 className="add-card-title">Edit Purchase</h1>
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
              {loading ? "Updating..." : "Update Purchase"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}