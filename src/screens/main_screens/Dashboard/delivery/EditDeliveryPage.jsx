import React, { useState, useEffect } from "react";
import { useDeliveries } from "../../../../contexts/DeliveryContext";
import { useSales } from "../../../../contexts/SaleContext";
import { useNavigate, useParams } from "react-router-dom";
import ErrorBox from "../../../../components/ErrorAlertBox";

export default function EditDeliveryPage() {
  const { deliveries, updateDeliveryStatus, fetchDeliveries, error, setError } =
    useDeliveries();
  const { sales, fetchSales } = useSales();
  const navigate = useNavigate();
  const { id } = useParams();

  const [delivery, setDelivery] = useState(null);
  const [saleId, setSaleId] = useState("");
  const [status, setStatus] = useState("pending");
  const [loading, setLoading] = useState(false);

  // Load sale & delivery data
  useEffect(() => {
    fetchSales();
    const d = deliveries.find((d) => d.id === parseInt(id));
    if (d) {
      setDelivery(d);
      setSaleId(d.sale?.id || "");
      setStatus(d.status);
    }
  }, [id, deliveries]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
      if (delivery?.inventoryDeducted) {
  alert("Cannot edit sale after delivery is completed.");
  navigate("/delivery");
  return;
}

    if (!saleId) return setError("Please select a sale");
    setLoading(true);
    setError("");

    try {
      await updateDeliveryStatus(delivery.id, status);
      await fetchDeliveries();
      navigate("/delivery");
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!delivery) return <p>Loading delivery...</p>;

  return (
    <div className="edit-page-wrapper">
      <div className="edit-page-header">
        <h1>Edit Delivery #{delivery.id}</h1>
      </div>

      <div className="edit-page-content">
        <ErrorBox message={error} onClose={() => setError("")} />

        <form className="edit-form" onSubmit={handleSubmit}>
          <label>
            Sale
            <select
            className="custom-select"
              value={saleId}
              onChange={(e) => setSaleId(e.target.value)}
              required
              disabled
            >
              <option value={delivery.sale?.id}>
                {delivery.sale?.invoiceNo} - {delivery.sale?.customer?.name}
              </option>
            </select>
          </label>

          <label>
            Status
            <select
            className="custom-select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
            >
              <option value="pending">Pending</option>
              <option value="delivered">Delivered</option>
              <option value="failed">Failed</option>
            </select>
          </label>

          <div className="edit-form-actions">
            <button className="edit-btn-primary"  type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Delivery"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}