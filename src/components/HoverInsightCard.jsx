export default function HoverInsightCard({
  item,
  position,
  title,
  fields = []
}) {
  if (!item) return null;

  const resolveValue = (field) => {
    if (typeof field.value === "function") {
      return field.value(item);
    }

    return item[field.value];
  };

  return (
    <div
      style={{
        position: "fixed",
        left: position.x,
        top: position.y,
        background: "#fff",
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "12px",
        width: "220px",
        boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
        pointerEvents: "none",
        zIndex: 9999,
      }}
    >
      {title && <strong>{title(item)}</strong>}

      <div style={{ fontSize: "13px", marginTop: "6px" }}>
        {fields.map((field, index) => (
          <div key={index}>
            <b>{field.label}:</b> {resolveValue(field)}
          </div>
        ))}
      </div>
    </div>
  );
}