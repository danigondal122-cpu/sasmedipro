import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { useDeliveries } from "../../../../contexts/DeliveryContext";

export default function DeleteDeliveryConfirm({ delivery, onClose }) {
  const { deleteDelivery, error, setError } = useDeliveries();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    setError("");
    try {
      await deleteDelivery(delivery.id);
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.message);
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

        <p>
          Are you sure you want to delete delivery <b>#{delivery.id}</b>?
        </p>

        {error && <div className="error-box">{error}</div>}

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