import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSales } from "../../../../contexts/SaleContext";
import { useItems } from "../../../../contexts/ItemContext";
import { SaleModel } from "../../../../models/SaleModel";
import { SaleItemModel } from "../../../../models/SaleItemModel";
import { SaleStatusEnum } from "../../../../common/enum/SaleStatusEnum";
import ErrorBox from "../../../../components/ErrorAlertBox";
import { useCustomers } from "../../../../contexts/CustomerContext";
import { CustomerModel } from "../../../../models/CustomerModel";
import { useCompanySettings } from "../../../../contexts/company_setting_context";
import InvoicePDF from "./components/invoice/InvoicePDF.jsx";
import ReactDOMServer from "react-dom/server";
import html2pdf from "html2pdf.js";

import { useUserAccounts } from "../../../../contexts/UserAccountContext.jsx";

export default function AddSalePage() {
   const { settings: companySettings, fetchSettings } = useCompanySettings();
  const {fetchAccounts,accounts} =useUserAccounts();
  
  const { createSale, error, setError } = useSales();
  const { fetchItems, items } = useItems();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState(null);
  const [customerName, setCustomerName] = useState("");
  const [saleItems, setSaleItems] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState("");
  const [qty, setQty] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [itemsList, setItemsList] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [status, setStatus] = useState(SaleStatusEnum.CON);
  const [salesPerson, setSalesPerson] = useState("");
  const [paymentType, setPaymentType] = useState("cash");
  

  const [whs, setWhs] = useState("");
  const [uom, setUom] = useState("");
  const [loading, setLoading] = useState(false);
  const [customerSearchTerm, setCustomerSearchTerm] = useState("");
const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
const [customerList, setCustomerList] = useState([]);
const { fetchCustomers,fetchCustomersByRole ,sellers, customers, selectedCustomer, setSelectedCustomer } = useCustomers();





const [seller, setSeller] = useState(null);
const [sellerSearchTerm, setSellerSearchTerm] = useState("");
const [sellerList, setSellerList] = useState([]);
const [showSellerDropdown, setShowSellerDropdown] = useState(false);
const sellerDropdownRef = useRef(null);




  const totalAmount = saleItems.reduce((sum, item) => sum + item.subtotal, 0).toFixed(2);








const handleSellerInputChange = (e) => {
  const value = e.target.value;
  setSellerSearchTerm(value);
 

  if (searchTimeout.current) clearTimeout(searchTimeout.current);

  searchTimeout.current = setTimeout(async () => {
    if (value.trim() !== "") {
      try {
    await fetchAccounts({ search: value, page: 1 });
     
        setSellerList(accounts || []);
        setShowSellerDropdown(accounts && accounts.length > 0);
      } catch (err) {
        console.error("Failed to fetch sellers:", err);
        setSellerList([]);
        setShowSellerDropdown(false);
      }
    } else {
      setSellerList([]);
      setShowSellerDropdown(false);
    }
  }, 500);
};



useEffect(() => {
  if (sellerSearchTerm.trim() !== "") {
   setSellerList(sellers); 
    setShowSellerDropdown(sellers.length > 0);
  }
}, [customers, sellerSearchTerm]);

// Close dropdown on click outside
useEffect(() => {
  const handleClickOutsideSeller = (event) => {
    if (sellerDropdownRef.current && !sellerDropdownRef.current.contains(event.target)) {
      setShowSellerDropdown(false);
    }
  };
  document.addEventListener("mousedown", handleClickOutsideSeller);
  return () => document.removeEventListener("mousedown", handleClickOutsideSeller);
}, []);

// Handle seller selection
const handleSelectSeller = (seller) => {
 
  setSeller(seller);
  setSellerSearchTerm(`${seller.name} (${seller.role.label})`);
  setShowSellerDropdown(false);
};

















  const customerDropdownRef = useRef(null);

  const searchTimeout = useRef(null);
  const dropdownRef = useRef(null);

  // Close dropdown if clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);




  


const handleCustomerInputChange = (e) => {
  const value = e.target.value;
  setCustomerSearchTerm(value);
  setCustomerId(null);

  if (searchTimeout.current) clearTimeout(searchTimeout.current);

  searchTimeout.current = setTimeout(() => {
    if (value.trim() !== "") {
      fetchCustomers({ search: value, page: 1 ,role:'seller'}).catch((err) =>
        console.error("Failed to fetch customers:", err)
      );
       setCustomerList(customers || []);
    } else {
      setCustomerList([]);
      setShowCustomerDropdown(false);
    }
  }, 500);
};

// 2️⃣ Sync customerList when context changes
useEffect(() => {
  
  if (customerSearchTerm.trim() !== "") {
    setCustomerList(customers);
    setShowCustomerDropdown(customers.length > 0);
  }
}, [customers, customerSearchTerm]);


useEffect(() => {
  const handleClickOutsideCustomer = (event) => {
    if (customerDropdownRef.current && !customerDropdownRef.current.contains(event.target)) {
      setShowCustomerDropdown(false);
    }
  };
  document.addEventListener("mousedown", handleClickOutsideCustomer);
  return () => document.removeEventListener("mousedown", handleClickOutsideCustomer);
}, []);

// const handleSelectCustomer = (customer) => {
//   setCustomerId(customer.id);
//   setCustomerSearchTerm(`${customer.name} (${customer.customerNo})`);
//   setShowCustomerDropdown(false);
// };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setSelectedItemId(""); // reset selected ID

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
    
    setSelectedItemId(item.id);
    setSearchTerm(`${item.itemName} (${item.itemNo})`);
    setShowDropdown(false);
  };

  const handleAddItem = () => {
   
    if (!selectedItemId) return;

    const item = itemsList.find((i) => i.id === Number(selectedItemId));
   
    if (!item) return;

    const newItem = new SaleItemModel({
    
      item_id: item.id,
      item_name: item.itemName,
      price: item.price,
      qty,
      tax: item.tax,
    });
    newItem.calculateSubtotal();

    setSaleItems((prev) => [...prev, newItem]);
    setSelectedItemId("");
    setQty(1);
    setSearchTerm("");
  };





  const handleRemoveItem = (index) => {
    setSaleItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const sale = new SaleModel({
        customer: customer,
        seller: seller,
        items: saleItems.map((item) => item.toJson()),
        status,
        meta: {  sales_person: salesPerson , payment_type: paymentType, whs, uom },
      });
      sale.calculateTotal();

      const createdSale = await createSale(sale);
       
      
      let company = companySettings;
    if (!company.name) {
      company = await fetchSettings();
      if (!company) return;
    }
   

    //    const pdfContent = ReactDOMServer.renderToString(
    //   <InvoicePDF data={createdSale}  company={company} />
    // );

    // html2pdf()
    //   .set({
    //     margin: 0,
    //     filename: `sales_invoice_${createdSale.invoiceNo}.pdf`,
    //     image: { type: "jpeg", quality: 1 },
    //     html2canvas: { scale: 3 },
    //     jsPDF: { unit: "px", format: [794, 1123], orientation: "portrait" },
    //   })
    //   .from(pdfContent)
    //   .save();

      // Reset form
      setCustomerName("");
      setSaleItems([]);
      setSelectedItemId("");
      setQty(1);
      setSearchTerm("");
      setItemsList([]);
      setSalesPerson("");
      setPaymentType("cash");
      setWhs("");
      setUom("");
      setStatus(SaleStatusEnum.CONFIRMED);

      navigate("/sales"); // redirect to sales list
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-page-wrapper">
      <div className="add-page-header">
        <h1 className="add-card-title">Add Sale</h1>
      </div>

      <div className="add-page-content">
        <ErrorBox message={error} onClose={() => setError("")} />

        <form className="add-form" onSubmit={handleSubmit}>
      <label style={{ position: "relative" }} ref={customerDropdownRef}>
  Customer
  <input
    type="text"
    placeholder="Type customer name..."
    value={customerSearchTerm}
    onChange={async (e) => {
      const value = e.target.value;
      setCustomerSearchTerm(value);
      

      if (searchTimeout.current) clearTimeout(searchTimeout.current);

      searchTimeout.current = setTimeout(async () => {
        if (value.trim() !== "") {
          try {
            // Fetch customers and use the returned list immediately
            const list =   await fetchCustomersByRole({ search: value, page: 1,role:'customer' });
            setCustomerList(list || []);
            setShowCustomerDropdown(list && list.length > 0);
          } catch (err) {
            console.error("Failed to fetch customers:", err);
            setCustomerList([]);
            setShowCustomerDropdown(false);
          }
        } else {
          setCustomerList([]);
          setShowCustomerDropdown(false);
        }
      }, 500);
    }}
    onFocus={() => {
      if (customerList.length > 0) setShowCustomerDropdown(true);
    }}
    required
  />

  {showCustomerDropdown && customerList.length > 0 && (
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
      {customerList.map((customer) => (
        <li
          key={customer.id}
          style={{ padding: "5px", cursor: "pointer" }}
          onMouseDown={() => {
            setCustomer(customer);
            setCustomerSearchTerm(`${customer.name} (${customer.customerNo})`);
            setShowCustomerDropdown(false);
          }}
        >
          {customer.name} ({customer.customerNo})
        </li>
      ))}
    </ul>
  )}
</label>

          <label>
            Status
            <select  className="custom-select" value={status} onChange={(e) => setStatus(e.target.value)} required>
              {Object.entries(SaleStatusEnum).map(([key, value]) => (
                <option key={key} value={value}>
                  {value.charAt(0).toUpperCase() + value.slice(1)}
                </option>
              ))}
            </select>
          </label>

          <div className=" add-form sale-meta-section">
          <label style={{ position: "relative" }} ref={sellerDropdownRef}>
  Seller
  <input
    type="text"
    placeholder="Type seller name..."
    value={sellerSearchTerm}
    onChange={handleSellerInputChange}
    onFocus={() => {
      if (sellerList.length > 0) setShowSellerDropdown(true);
    }}
    required
  />

  {showSellerDropdown && sellerList.length > 0 && (
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
      {sellerList.map((seller) => (
        <li
          key={seller.id}
          style={{ padding: "5px", cursor: "pointer" }}
          onMouseDown={() => handleSelectSeller(seller)}
        >
          {seller.name} ({seller.role?.label})
        </li>
      ))}
    </ul>
  )}
</label>

            <label>
              Payment Type
              <select  className="custom-select" value={paymentType} onChange={(e) => setPaymentType(e.target.value)}>
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                 <option value="bank_transfer">Bank Transfer</option>
                <option value="credit">Credit</option>
              </select>
            </label>




       


         

            <label>
              WHs
              <input type="text" value={whs} onChange={(e) => setWhs(e.target.value)} />
            </label>

            <label>
              UOM
              <input type="text" value={uom} onChange={(e) => setUom(e.target.value)} />
            </label>
          </div>

          {/* Add Item Section */}
          <div className="sale-add-item">
            <label style={{ position: "relative" }} ref={dropdownRef}>
              Select Item
              <input
                type="text"
                placeholder="Type item name or item_no..."
                value={searchTerm}
                onChange={handleInputChange}
                onFocus={() => { if (itemsList.length > 0) setShowDropdown(true); }}
                
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

            <label>
              Quantity
              <input
                type="number"
                min="1"
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
              />
            </label>

            <button
              type="button"
              className="emerald-btn add-sale-item add-item-btn"
              onClick={handleAddItem}
            >
              Add Item
            </button>
          </div>

          {/* Sale Items Table */}
          {saleItems.length > 0 && (
            <>
            <table className="table small-table sale-items-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Tax</th>
                  <th>Subtotal</th>
                  <th>Remove</th>
                </tr>
              </thead>
              <tbody>
                {saleItems.map((item, index) => (
                  <tr key={index}>
                    <td>{item.item_name}</td>
                    <td>{item.qty}</td>
                    <td>{item.price}</td>
                    <td>{item.tax}</td>
                    <td>{item.subtotal.toFixed(2)}</td>
                    <td>
                      <button
                        type="button"
                        className="remove-item-btn"
                        onClick={() => handleRemoveItem(index)}
                      >
                        X
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

             <div
    className="sale-total-amount-box"
   
  >
    <span>Total Amount</span>
    <span>${totalAmount}</span>
  </div>

  </>

            
          )}

          

          <div className="add-form-actions">
            <button type="submit" className="add-btn-primary" disabled={loading}>
              {loading ? "Saving..." : "Create Sale"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
