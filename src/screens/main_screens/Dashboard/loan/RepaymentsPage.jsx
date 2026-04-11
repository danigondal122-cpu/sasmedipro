import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLoans } from "../../../../contexts/LoanContext";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function LoanRepaymentsPage() {

  const { loanId } = useParams();
  const navigate = useNavigate();

  const { loans } = useLoans();

 

  const loan = loans.find(l => l.id === Number(loanId));

  if (!loan) {
    return <div className="data-table-container">Loan not found</div>;
  }

  return (
    <div className="data-table-container">

      <div className="table-header">

        <div>
          <h2>Loan Repayments</h2>
          <p><strong>Loan No:</strong> {loan.loanNo}</p>
          <p><strong>Borrower:</strong> {loan.borrower_name}</p>
        </div>

        <div className="table-buttons">

          <button
            className="emerald-btn"
            onClick={() => navigate(`/loans/${loan.id}/repayments/add`)}
          >
            <AddIcon fontSize="small" /> Add Repayment
          </button>

          <button
            className="gray-btn"
            onClick={() => navigate("/loans")}
          >
            <ArrowBackIcon fontSize="small" /> Back
          </button>

        </div>
      </div>

      <table className="table">

        <thead>
          <tr>
            <th>#</th>
            <th>Amount Paid</th>
            <th>Paid At</th>
          </tr>
        </thead>

        <tbody>

          {loan.repayments.length === 0 ? (
            <tr>
              <td colSpan="3">No repayments yet</td>
            </tr>
          ) : (
            loan.repayments.map((repayment, i) => (
              <tr key={repayment.id}>
                <td>{i + 1}</td>
                <td>{repayment.amountPaid}</td>
                <td>{repayment.paidAt}</td>
              </tr>
            ))
          )}

        </tbody>

      </table>

    </div>
  );
}