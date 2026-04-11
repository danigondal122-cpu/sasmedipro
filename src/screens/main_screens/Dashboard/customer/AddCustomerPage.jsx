import React, { useState } from "react";
import { useCustomers } from "../../../../contexts/CustomerContext";
import ErrorBox from "../../../../components/ErrorAlertBox";

export default function AddCustomerPage() {
  const { createCustomer, error, setError } = useCustomers();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [mobile, setMobile] = useState("");
const [vat, setVat] = useState("");
const [brn, setBrn] = useState("");
   const [role, setRole] = useState("customer");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    await createCustomer({ name, phone, email, address,mobile,
  vat,
  brn,role });

    setName("");
    setPhone("");
    setEmail("");
    setAddress("");
    setMobile("");
    setBrn("");
    setVat("");
     setRole("customer");
  };

  return (
    <div className="add-page-wrapper">
          <div className="add-page-header">
      <h1 className="add-card-title">Add Customer</h1>
    </div>
    

       <div className="add-page-content">

      <ErrorBox message={error} onClose={() => setError("")} />

      <form className="add-form" onSubmit={handleSubmit}>
        <input placeholder="Customer Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
        <input placeholder="Mobile" value={mobile} onChange={(e) => setMobile(e.target.value)} />
<input placeholder="VAT Number" value={vat} onChange={(e) => setVat(e.target.value)} />
<input placeholder="BRN Number" value={brn} onChange={(e) => setBrn(e.target.value)} />
         <select  className="custom-select" value={role} onChange={(e) => setRole(e.target.value)} required>
            <option value="customer">Customer</option>
           
          </select>
 
      <div className="add-form-actions">
        <button  className="add-btn-primary" type="submit">Save Customer</button>
        </div>
      </form>
      </div>
    </div>
  );
}
