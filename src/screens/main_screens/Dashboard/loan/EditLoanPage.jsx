import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLoans } from "../../../../contexts/LoanContext";
import { LoanModel } from "../../../../models/LoanModel";
import ErrorBox from "../../../../components/ErrorAlertBox";

export default function EditLoanPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { loans, updateLoan, error, setError } = useLoans();

  const loan = loans.find((l) => l.id === Number(id));

  const [formData, setFormData] = useState({
    lender_name: "",
    borrower_name: "",
    principal_amount: "",
    interest_rate: "",
    start_date: "",
    status: "active",
  });

  const [loading, setLoading] = useState(false);

  // Load loan data into form
  useEffect(() => {
    if (loan) {
      setFormData({
        lender_name: loan.lender_name || "",
        borrower_name: loan.borrower_name || "",
        principal_amount: loan.principal || 0,
        interest_rate: loan.interestRate || 0,
        start_date: loan.startDate || "",
        status: loan.status || "active",
      });
    }
  }, [loan]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const loanModel = new LoanModel({
        id: loan.id,
        lender_name: formData.lender_name,
        borrower_name: formData.borrower_name,
        principal_amount: Number(formData.principal_amount),
        interest_rate: Number(formData.interest_rate),
        start_date: formData.start_date,
        status: formData.status,
      });

      await updateLoan(loan.id, loanModel);
      navigate("/loans");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!loan) return <div className="edit-page-wrapper">Loan not found</div>;

  return (
    <div className="edit-page-wrapper">
      <div className="edit-page-header">
        <h1>Edit Loan</h1>
      </div>

      <div className="edit-page-content">
        <ErrorBox message={error} onClose={() => setError("")} />

        <form className="edit-form" onSubmit={handleSubmit}>
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

          <label>
            Principal Amount
            <input
              type="number"
              name="principal_amount"
              value={formData.principal_amount}
              onChange={handleChange}
              required
            />
          </label>

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

          <label>
            Status
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="custom-select"
            >
              <option value="active">Active</option>
              <option value="paid">Paid</option>
              <option value="defaulted">Defaulted</option>
            </select>
          </label>

          <div className="edit-form-actions">
            <button type="submit" className="edit-btn-primary" disabled={loading}>
              {loading ? "Updating..." : "Update Loan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}