// DeleteUserModal.jsx
import React, { useState } from "react";
import { useUserAccounts } from "../../../../contexts/UserAccountContext";
import CloseIcon from "@mui/icons-material/Close";
import ErrorBox from "../../../../components/ErrorAlertBox";

export default function DeleteUserAccountModal({ user, onClose }) {
  const { deleteAccount, error, setError } = useUserAccounts();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    setError("");
    try {
      await deleteAccount(user.id);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal small">
        <div className="modal-header">
          <h3>Confirm Delete</h3>
          <CloseIcon style={{ cursor: "pointer" }} onClick={onClose} />
        </div>

        <ErrorBox message={error} onClose={() => setError("")} />

        <p>
          Are you sure you want to delete <b>{user.name}</b>?
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
