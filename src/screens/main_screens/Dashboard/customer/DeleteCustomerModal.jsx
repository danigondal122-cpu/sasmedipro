import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { useCustomers } from "../../../../contexts/CustomerContext";
import ErrorBox from "../../../../components/ErrorAlertBox";

export default function DeleteCustomerModal({ customer, onClose }) {
  const { deleteCustomer, error, setError } = useCustomers();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    setError("");

    try {
      await deleteCustomer(customer.id);
      onClose();
    } catch (err) {
      console.error("Delete failed", err);
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
          Are you sure you want to delete{" "}
          <b>{customer.name}</b>?
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
