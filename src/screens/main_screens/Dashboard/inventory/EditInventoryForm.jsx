import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useInventories } from "../../../../contexts/InventoryContext";
import ErrorBox from "../../../../components/ErrorAlertBox";
import { InventoryModel } from "../../../../models/InventoryModel";

export default function EditInventoryForm() {
  const { id } = useParams(); // inventory ID from URL
  const navigate = useNavigate();
  const { inventories, updateInventory, error, setError } = useInventories();

  const [qty, setQty] = useState(0);
  const [loading, setLoading] = useState(false);

  // Preload inventory data
  useEffect(() => {
    const invToEdit = inventories.find((i) => i.id === parseInt(id));
    if (invToEdit) {
      setQty(invToEdit.qty);
    }
  }, [id, inventories]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const invModel = new InventoryModel({
        qty: Number(qty),
      });

      await updateInventory(id, invModel);
      navigate("/inventory"); // redirect back to inventory list
    } catch (err) {
      console.error("Update inventory failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-page-wrapper">
      <div className="edit-page-header">
        <h1 className="edit-card-title">Edit Inventory</h1>
      </div>

      <div className="edit-page-content">
        <ErrorBox message={error} onClose={() => setError("")} />

        <form className="edit-form" onSubmit={handleSubmit}>
          <label>
            Stock
            <input
              type="number"
              min="0"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              required
            />
          </label>

          <div className="edit-form-actions">
            <button className="edit-btn-primary" disabled={loading}>
              {loading ? "Updating..." : "Update Inventory"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
