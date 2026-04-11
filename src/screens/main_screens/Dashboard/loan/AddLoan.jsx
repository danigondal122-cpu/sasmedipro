import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoans } from "../../../../contexts/LoanContext";
import { LoanModel } from "../../../../models/LoanModel";
import ErrorBox from "../../../../components/ErrorAlertBox";

export default function AddLoanPage() {

  const navigate = useNavigate();
  const { createLoan, error, setError } = useLoans();

  const [formData, setFormData] = useState({
    lender_name: "",
    borrower_name: "",
    principal_amount: "",
    interest_rate: "",
    start_date: "",
    status: "active"
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {

      const loan = new LoanModel({
        lender_name: formData.lender_name,
        borrower_name: formData.borrower_name,
        principal_amount: Number(formData.principal_amount),
        interest_rate: Number(formData.interest_rate),
        start_date: formData.start_date,
        status: formData.status
      });

      await createLoan(loan);

      navigate("/loans");

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="add-page-wrapper">

      <div className="add-page-header">
        <h1>Add Loan</h1>
      </div>

      <div className="add-page-content">

        <ErrorBox message={error} onClose={() => setError("")} />

        <form className="add-form" onSubmit={handleSubmit}>

          {/* Lender */}
          <label>
            Lender Name
            <input
              type="text"
              name="lender_name"
              value={formData.lender_name}
              onChange={handleChange}
              required
            />
          </label>

          {/* Borrower */}
          <label>
            Borrower Name
            <input
              type="text"
              name="borrower_name"
              value={formData.borrower_name}
              onChange={handleChange}
              required
            />
          </label>

          {/* Principal */}
          <label>
            Loan Amount
            <input
              type="number"
              name="principal_amount"
              value={formData.principal_amount}
              onChange={handleChange}
              required
            />
          </label>

          {/* Interest */}
          <label>
            Interest Rate (%)
            <input
              type="number"
              name="interest_rate"
              value={formData.interest_rate}
              onChange={handleChange}
              required
            />
          </label>

          {/* Start Date */}
          <label>
            Start Date
            <input
              type="date"
              name="start_date"
              value={formData.start_date}
              onChange={handleChange}
              required
            />
          </label>

          {/* Status */}
          <label>
            Status
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="active">Active</option>
              <option value="paid">Paid</option>
              <option value="defaulted">Defaulted</option>
            </select>
          </label>

          <button type="submit" className="add-btn-primary">
            Create Loan
          </button>

        </form>
      </div>
    </div>
  );
}