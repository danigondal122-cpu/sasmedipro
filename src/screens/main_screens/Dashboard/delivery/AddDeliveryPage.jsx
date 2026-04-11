import React, { useState, useRef, useEffect } from "react";
import { useDeliveries } from "../../../../contexts/DeliveryContext";
import { useSales } from "../../../../contexts/SaleContext";
import { useNavigate } from "react-router-dom";
import ErrorBox from "../../../../components/ErrorAlertBox";

export default function AddDeliveryPage() {
  const { createDelivery, error, setError } = useDeliveries();
  const { sales, fetchSales } = useSales();
  const navigate = useNavigate();

  const [saleId, setSaleId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSales, setFilteredSales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("pending");

  const searchTimeout = useRef(null);
  const dropdownRef = useRef(null);

  // Fetch sales on mount
  useEffect(() => {
    fetchSales();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setFilteredSales([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle typing to search sales
  const handleInputChange = (e) => {
  const value = e.target.value;
  setSearchTerm(value);
  setSaleId(""); // reset selected sale

  if (searchTimeout.current) clearTimeout(searchTimeout.current);

  searchTimeout.current = setTimeout(async () => {
    if (value.trim() !== "") {
      try {
        // fetch sales from backend
        await fetchSales({ search: value, page: 1, noDeliveryOnly: true });
        setFilteredSales(sales || []);
        setShowDropdown(true);
      } catch (err) {
        console.error("Failed to fetch sales:", err);
      }
    } else {
      setFilteredSales([]);
      setShowDropdown(false);
    }
  }, 500);
};







  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!saleId) return setError("Please select a sale");
    setLoading(true);
    setError("");

    try {
     await createDelivery(saleId, status); 
      navigate("/delivery");
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  const handleSelectSale = (sale) => {
  setSaleId(sale.id);
  setSearchTerm(`${sale.invoiceNo} - ${sale.customer?.name}`);
  setFilteredSales([]);
};


  return (
    <div className="add-page-wrapper">
      <div className="add-page-header">
        <h1 className="add-card-title">Add Delivery</h1>
      </div>

      <div className="add-page-content">
        <ErrorBox message={error} onClose={() => setError("")} />

        <form className="add-form" onSubmit={handleSubmit}>
          {/* Sale Search */}
          <label style={{ position: "relative" }} ref={dropdownRef}>
            Sale Invoice / Customer
            <input
              type="text"
              placeholder="Type sale invoice or customer..."
              value={searchTerm}
              onChange={handleInputChange}
              onFocus={() => {
  if (filteredSales.length > 0) setShowDropdown(true);
}}
              required
            />
            {filteredSales.length > 0 && (
              <ul
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  right: 0,
                  maxHeight: "200px",
                  overflowY: "auto",
                  border: "1px solid #ccc",
                  background: "#fff",
                  zIndex: 9999,
                  margin: 0,
                  padding: 0,
                  listStyle: "none",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                }}
              >
                {filteredSales.map((sale) => (
                  <li
                    key={sale.id}
                    style={{ padding: "5px", cursor: "pointer" }}
                    onMouseDown={() => handleSelectSale(sale)}
                  >
                    {sale.invoiceNo} - {sale.customer?.name}
                  </li>
                ))}
              </ul>
            )}
          </label>

          {/* Status */}
          <label>
            Status
            <select
              className="custom-select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="pending">Pending</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </label>

          <div className="add-form-actions">
            <button type="submit" className="add-btn-primary" disabled={loading}>
              {loading ? "Creating..." : "Create Delivery"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}