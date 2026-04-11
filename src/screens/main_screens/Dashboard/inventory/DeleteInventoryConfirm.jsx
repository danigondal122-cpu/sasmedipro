import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { useInventories } from "../../../../contexts/InventoryContext";
import ErrorBox from "../../../../components/ErrorAlertBox";

export default function DeleteInventoryConfirm({ inventory, onClose }) {
  const { deleteInventory, error, setError } = useInventories();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    setError("");

    try {
      await deleteInventory(inventory.id);
      onClose();
    } catch (err) {
      console.error("Delete inventory failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal small">
        <div className="modal-header">
          <h3>Confirm Delete</h3>
          <CloseIcon onClick={onClose} style={{ cursor: "pointer" }} />
        </div>

        <ErrorBox message={error} onClose={() => setError("")} />

        <p>
          Are you sure you want to delete inventory for{" "}
          <b>{inventory.item?.item_name}</b>?
        </p>

        <div className="delete-modal-actions">
          <button className="delete-btn-outline" onClick={onClose}>
            Cancel
          </button>
          <button
            className="delete-btn-danger"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
