import React, { useState, useEffect,useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSales } from "../../../../contexts/SaleContext";
import { useItems } from "../../../../contexts/ItemContext";
import ErrorBox from "../../../../components/ErrorAlertBox";
import { SaleModel } from "../../../../models/SaleModel";
import { SaleItemModel } from "../../../../models/SaleItemModel";
import { SaleStatusEnum } from "../../../../common/enum/SaleStatusEnum";
import { useCustomers } from "../../../../contexts/CustomerContext";
import { useUserAccounts } from "../../../../contexts/UserAccountContext";

export default function EditSalePage() {
  const { sales, updateSale, error, setError, fetchSales } = useSales();
  const { items } = useItems();
  const navigate = useNavigate();
  const { id } = useParams();

   const {fetchAccounts,accounts} =useUserAccounts();


 

  const [customerName, setCustomerName] = useState("");
  const [saleItems, setSaleItems] = useState([]);
  const [status, setStatus] = useState(SaleStatusEnum.CONFIRMED);

    const [customer, setCustomer] = useState(null);
  const [seller, setSeller] = useState(null);

  // Meta fields
  const [salesPerson, setSalesPerson] = useState("");
  const [paymentType, setPaymentType] = useState("cash");
  const [paymentStatus, setPaymentStatus] = useState("paid");
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [whs, setWhs] = useState("");
  const [uom, setUom] = useState("");



    const [customerSearchTerm, setCustomerSearchTerm] = useState("");
  const [sellerSearchTerm, setSellerSearchTerm] = useState("");

  const [itemsList, setItemsList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItemId, setSelectedItemId] = useState("");

  const [loading, setLoading] = useState(false);

  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);

  const [customerList, setCustomerList] = useState([]);
  const { fetchCustomers,fetchCustomersByRole ,sellers, customers, selectedCustomer, setSelectedCustomer } = useCustomers();
  
   const searchTimeout = useRef(null);


   const customerDropdownRef = useRef(null);









   const handleSelectSeller = (seller) => {

  setSeller(seller);
  setSellerSearchTerm(`${seller.name} (${seller.role?.label})`);
  setShowSellerDropdown(false);
};








 
   const [sellerList, setSellerList] = useState([]);
   const [showSellerDropdown, setShowSellerDropdown] = useState(false);
   const sellerDropdownRef = useRef(null);
const sale = sales.find((s) => s.id === parseInt(id));
  // Load sale from context
  useEffect(() => {
    


    
    if (sale) {

      
      setCustomer(sale.customer);
      setSeller(sale.seller);
      setCustomerName(sale.customerName || "");
      setSaleItems(sale.items.map((item) => new SaleItemModel(item)));
      setStatus(sale.status || SaleStatusEnum.CONFIRMED);
      setPaymentStatus(sale.payment_status);
      setPaymentAmount(sale.payment_amount)

      setSalesPerson(sale.meta?.sales_person || "");
      setPaymentType(sale.meta?.payment_type || "cash");
      setWhs(sale.meta?.whs || "");
      setUom(sale.meta?.uom || "");



      
      setCustomerSearchTerm(
        `${sale.customer?.name} (${sale.customer?.customerNo})`
      );

      setSellerSearchTerm(
        `${sale.seller?.name} (${sale.seller?.role.label})`
      );
    }
  }, [id, sales]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    

  

    try {
      const saleModel = new SaleModel({
        id,
        customer_name: customerName,
         customer,
        seller,
        status,
        payment_status:paymentStatus,
        payment_amount:paymentAmount,
        items: saleItems.map((item) => item.toJson()),
        meta: {
          sales_person: salesPerson,
          payment_type: paymentType,
          whs,
          uom,
        },
      });

      saleModel.calculateTotal();

      await updateSale(id, saleModel);
      await fetchSales();

      navigate("/sales");
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };











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



useEffect(() => {
  const handleClickOutsideCustomer = (event) => {
    if (customerDropdownRef.current && !customerDropdownRef.current.contains(event.target)) {
      setShowCustomerDropdown(false);
    }
  };
  document.addEventListener("mousedown", handleClickOutsideCustomer);
  return () => document.removeEventListener("mousedown", handleClickOutsideCustomer);
}, []);



  return (
    <div className="edit-page-wrapper">
      <div className="edit-page-header">
        <h1 className="edit-card-title">Edit Sale</h1>
      </div>

      <div className="edit-page-content">
        <ErrorBox message={error} onClose={() => setError("")} />

        <form onSubmit={handleSubmit} className="edit-form">
          {/* <label>
            Customer Name
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
            />
          </label> */}


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
            <select className="custom-select" value={status} onChange={(e) => setStatus(e.target.value)}>
              {Object.entries(SaleStatusEnum).map(([key, value]) => (
                <option key={key} value={value}>
                  {value.charAt(0).toUpperCase() + value.slice(1)}
                </option>
              ))}
            </select>
          </label>



           {/* SELLER */}
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
          {/* Meta Fields */}
          <div className="sale-meta-section">
            {/* <label>
              Sales Person
              <input
                type="text"
                value={salesPerson}
                onChange={(e) => setSalesPerson(e.target.value)}
              />
            </label> */}

            <label>
              Payment Type
              <select
              className="custom-select"
                value={paymentType}
                onChange={(e) => setPaymentType(e.target.value)}
              >
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="credit">Credit</option>
                 <option value="bank_transfer">Bank Transfer</option>
              </select>
            </label>



              <label>
              Payment Status
              <select disabled={true} className="custom-select" value={paymentStatus} >
                <option value="paid">Paid</option>
                <option value="partially_paid">Partially Paid</option>
                 <option value="unpaid">Unpaid</option>
                
              </select>
            </label>



               {["unpaid", "partially_paid"].includes(paymentStatus.toLowerCase()) && (
  <div className="payment-section">
    <label>
      Payment Amount
      <input
        type="number"
        value={paymentAmount}
        onChange={(e) => setPaymentAmount(Number(e.target.value))}
        min="0"
      />
    </label>

    <p className="text-sm text-gray-500">
      Customer Total Due: ${sale?.meta?.due_amount || 0}
    </p>
  </div>
)}

            <label>
              WHs
              <input value={whs} onChange={(e) => setWhs(e.target.value)} />
            </label>

            <label>
              UOM
              <input value={uom} onChange={(e) => setUom(e.target.value)} />
            </label>
          </div>

          {/* Sale Items Table */}
          {saleItems.length > 0 && (
            <table className="table small-table sale-items-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Tax</th>
                  <th>Subtotal</th>
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
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <div className="edit-form-actions">
            <button className="edit-btn-primary" disabled={loading}>
              {loading ? "Updating..." : "Update Sale"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
