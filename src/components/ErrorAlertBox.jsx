import React from "react";


export default function ErrorBox({ message, onClose }) {
  if (!message) return null;
   
  return (
    <div className="error-box">
      <span className="error-message">{message}</span>
      {onClose && (
        <button className="error-close" onClick={onClose}>
          ×
        </button>
      )}
    </div>
  );
}
