import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCustomers } from "../../../../contexts/CustomerContext";
import ErrorBox from "../../../../components/ErrorAlertBox";
import { CustomerModel } from "../../../../models/CustomerModel";
export default function EditCustomerPage() {
  const { id } = useParams(); // customer ID from URL
  const navigate = useNavigate();
  const { customers, updateCustomer, error, setError } = useCustomers();

  const [customerNo, setCustomerNo] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  // const [role, setRole] = useState("");
  const [mobile, setMobile] = useState("");
const [vat, setVat] = useState("");
const [brn, setBrn] = useState("");
  const [loading, setLoading] = useState(false);

  // Preload customer data
  useEffect(() => {
    const customerToEdit = customers.find((c) => c.id === parseInt(id));
    if (customerToEdit) {
      setCustomerNo(customerToEdit.customerNo);
      setName(customerToEdit.name);
      setPhone(customerToEdit.phone);
      setEmail(customerToEdit.email);
      setAddress(customerToEdit.address);
      setMobile(customerToEdit.mobile);
setVat(customerToEdit.vat);
setBrn(customerToEdit.brn);
      // setRole(customerToEdit.role);
      
    }
  }, [id, customers]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {

          const customerModel = new CustomerModel({
      
      name,
      phone,
      email,
      address,
      mobile,
      vat,
      brn,
      // role,
    });
      await updateCustomer(id, customerModel);

      navigate("/customers"); // back to customer list
    } catch (err) {
      console.error("Update customer failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-page-wrapper">
      <div className="edit-page-header">
        <h1 className="edit-card-title">Edit Customer</h1>
      </div>

      <div className="edit-page-content">
        <ErrorBox message={error} onClose={() => setError("")} />

        <form className="edit-form" onSubmit={handleSubmit}>
         

          <label>
            Name
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>

          <label>
            Phone
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </label>

          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label>
            Address
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </label>

          <label>
            Mobile
            <input
              type="text"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
            />
          </label>


          <label>
            VAT
            <input
              type="text"
              value={vat}
              onChange={(e) => setVat(e.target.value)}
            />
          </label>


          <label>
            BRN
            <input
              type="text"
              value={brn}
              onChange={(e) => setBrn(e.target.value)}
            />
          </label>

          {/* <label>
            Role
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
          </label> */}

          <div className="edit-form-actions">
            <button
              type="submit"
              className="edit-btn-primary"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Customer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
