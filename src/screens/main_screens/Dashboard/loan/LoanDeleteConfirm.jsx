import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { useLoans } from "../../../../contexts/LoanContext.jsx";
import ErrorBox from "../../../../components/ErrorAlertBox";

export default function LoanDeleteConfirm({ loan, onClose }) {
  const { deleteLoan, error, setError } = useLoans();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    setError("");
    try {
      await deleteLoan(loan.id);
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
          Are you sure you want to delete the loan{" "}
          <b>{loan.loanNo}</b> for <b>{loan.borrower_name}</b>?
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