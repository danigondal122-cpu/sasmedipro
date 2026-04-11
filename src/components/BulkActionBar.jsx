import React, { useState } from "react";

export default function BulkActionBar({
  selectedCount,
  onClear,
  actions = [],
}) {
  const [selectedAction, setSelectedAction] = useState("");

  if (selectedCount === 0) return null;

  const handleApply = () => {
    if (!selectedAction) return;

    const action = actions.find((a) => a.value === selectedAction);
    if (action?.onClick) {
      action.onClick();
    }

    setSelectedAction("");
  };

  return (
    <div className="bulk-action-bar">
     

      <div className="bulk-controls">
        <select
          value={selectedAction}
          onChange={(e) => setSelectedAction(e.target.value)}
          className="bulk-select"
        >
          <option value="">Select action</option>
          {actions.map((action) => (
            <option key={action.value} value={action.value}>
              {action.label}
            </option>
          ))}
        </select>

        <button
          className="apply-btn"
          disabled={!selectedAction}
          onClick={handleApply}
        >
          Apply
        </button>

        <button className="cancel-btn" onClick={onClear}>
          Cancel
        </button>
      </div>
    </div>
  );
}