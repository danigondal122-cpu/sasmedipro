import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLoans } from "../../../../contexts/LoanContext";
import { LoanRepaymentModel } from "../../../../models/LoanModel";
import ErrorBox from "../../../../components/ErrorAlertBox";

export default function AddLoanRepaymentPage() {

  const navigate = useNavigate();
  const { loanId } = useParams();

  const { addRepayment, error, setError } = useLoans();

  const [formData, setFormData] = useState({
    amount_paid: "",
    paid_at: new Date().toISOString().split("T")[0]
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

      const repayment = new LoanRepaymentModel({
        loan_id: loanId,
        amount_paid: Number(formData.amount_paid),
        paid_at: formData.paid_at
      });

      await addRepayment(loanId, repayment);

      navigate("/loans");

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="add-page-wrapper">

      <div className="add-page-header">
        <h1>Add Loan Repayment</h1>
      </div>

      <div className="add-page-content">

        <ErrorBox message={error} onClose={() => setError("")} />

        <form className="add-form" onSubmit={handleSubmit}>

          {/* Amount */}
          <label>
            Repayment Amount
            <input
              type="number"
              name="amount_paid"
              value={formData.amount_paid}
              onChange={handleChange}
              required
            />
          </label>

          {/* Paid Date */}
          <label>
            Payment Date
            <input
              type="date"
              name="paid_at"
              value={formData.paid_at}
              onChange={handleChange}
              required
            />
          </label>

          <button type="submit" className="add-btn-primary">
            Add Repayment
          </button>

        </form>

      </div>
    </div>
  );
}