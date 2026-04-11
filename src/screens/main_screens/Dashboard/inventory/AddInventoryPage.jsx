import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useInventories } from "../../../../contexts/InventoryContext";
import { useItems } from "../../../../contexts/ItemContext";
import ErrorBox from "../../../../components/ErrorAlertBox";

export default function AddInventoryPage() {
  const { createInventory, error, setError } = useInventories();
  const { fetchItems, items } = useItems();
  const navigate = useNavigate();

  const [itemId, setItemId] = useState("");          // Selected item ID
  const [qty, setQty] = useState(0);                // Quantity
  const [loading, setLoading] = useState(false); 
  const [searchTerm, setSearchTerm] = useState(""); // Input text
  const [itemsList, setItemsList] = useState([]);   // Search results
  const [showDropdown, setShowDropdown] = useState(false);

  const searchTimeout = useRef(null);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle typing in item search
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setItemId(""); // reset selected ID

    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    searchTimeout.current = setTimeout(async () => {
      if (value.trim() !== "") {
        try {
          await fetchItems({ search: value, page: 1 });
          setItemsList(items || []);
          setShowDropdown(true);
        } catch (err) {
          console.error("Failed to fetch items:", err);
        }
      } else {
        setItemsList([]);
        setShowDropdown(false);
      }
    }, 500);
  };

  const handleSelectItem = (item) => {
    setItemId(item.id);
    setSearchTerm(`${item.itemName} (${item.itemNo})`);
    setShowDropdown(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await createInventory({
        item_id: itemId,
        qty: Number(qty),
      });

      // Reset form
      setItemId("");
      setQty(0);
      setSearchTerm("");
      setItemsList([]);
      setShowDropdown(false);

      navigate("/inventory"); // redirect to inventory list
    } catch (err) {
      console.error("Create inventory failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-page-wrapper">
      <div className="add-page-header">
        <h1 className="add-card-title">Add Inventory</h1>
      </div>

      <div className="add-page-content">
        <ErrorBox message={error} onClose={() => setError("")} />

        <form className="add-form" onSubmit={handleSubmit}>
          {/* Select Item Dropdown */}
          <label style={{ position: "relative" }} className="add-full-width" ref={dropdownRef}>
            Select Item
            <input
              type="text"
              placeholder="Type item name or item_no..."
              value={searchTerm}
              onChange={handleInputChange}
              onFocus={() => { if (itemsList.length > 0) setShowDropdown(true); }}
              required
            />
            {showDropdown && itemsList.length > 0 && (
              <ul
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  right: 0,
                  maxHeight: "150px",
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
                {itemsList.map((item) => (
                  <li
                    key={item.id}
                    style={{ padding: "5px", cursor: "pointer" }}
                    onMouseDown={() => handleSelectItem(item)}
                  >
                    {item.itemName} ({item.itemNo})
                  </li>
                ))}
              </ul>
            )}
          </label>

          {/* Quantity */}
          <label>
            Stock
            <input
              type="number"
              min="0"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              required
            />
          </label>

          <div className="add-form-actions">
            <button
              type="submit"
              className="add-btn-primary"
              disabled={loading || !itemId}
            >
              {loading ? "Saving..." : "Add Inventory"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
