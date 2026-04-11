import React, { createContext, useContext, useState } from "react";
import { LoanModel } from "../models/LoanModel";
import { useApiServices } from "../hooks/useApiServices";
import { useNavigate } from "react-router-dom";
import { ApiMethods } from "../services/api_methods";
import { LoanRepaymentModel } from "../models/LoanModel";

const LoanContext = createContext();

export const LoanProvider = ({ children }) => {
  const [loans, setLoans] = useState([]);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [meta, setMeta] = useState({ current_page: 1, per_page: 10, total: 0, last_page: 1 });

  const navigate = useNavigate();
  const { getApi, postApi, putApi, deleteApi, patchApi } = useApiServices();

  const fetchLoans = async ({ search = "", page = 1 } = {}) => {
    setLoading(true);
    setError("");
    try {
      const response = await getApi(ApiMethods.getLoans, { search, page }, { isToken: true }, navigate);
      if (!response.isSuccess) throw new Error(response.message || "Failed to fetch loans");
      setLoans(response.data.map(l => LoanModel.fromJson(l)));
      if (response.meta) setMeta(response.meta);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createLoan = async (loan) => {
    setLoading(true);
    setError("");
    try {
      const response = await postApi(ApiMethods.createLoan, loan.toJson(), { isToken: true });
      if (!response.isSuccess) throw new Error(response.message || "Loan creation failed");
      const newLoan = LoanModel.fromJson(response.data);
      setLoans(prev => [newLoan, ...prev]);
      return newLoan;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateLoan = async (id, loan) => {
    setLoading(true);
    setError("");
    try {
      const response = await putApi(`${ApiMethods.updateLoan(id)}`, loan.toJson(), { isToken: true });
      if (!response.isSuccess) throw new Error(response.message || "Loan update failed");
      const updatedLoan = LoanModel.fromJson(response.data);
      setLoans(prev => prev.map(l => (l.id === id ? updatedLoan : l)));
      return updatedLoan;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteLoan = async (id) => {
    setLoading(true);
    setError("");
    try {
      const response = await deleteApi(`${ApiMethods.deleteLoan(id)}`, {}, { isToken: true });
      if (!response.isSuccess) throw new Error(response.message || "Loan deletion failed");
      setLoans(prev => prev.filter(l => l.id !== id));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

 const addRepayment = async (loanId, repayment) => {
  setLoading(true);
  setError("");

  try {

    const response = await postApi(
      ApiMethods.addRepayment(loanId),
      repayment.toJson(),
      { isToken: true }
    );

    

    if (!response.isSuccess) {
      throw new Error(response.message || "Repayment failed");
    }

 

    const loan = loans.find(l => l.id === Number(loanId));

    if (!loan) {
      throw new Error("Loan not found");
    }

    const repaymentModel = LoanRepaymentModel.fromJson(response.data);

    loan.addRepayment(repaymentModel);

    setLoans(prev =>
      prev.map(l => (l.id === Number(loanId) ? loan : l))
    );

    return loan;

  } catch (err) {
    setError(err.message);
    throw err;
  } finally {
    setLoading(false);
  }
};


  const bulkDeleteLoans = async (ids) => {
  setLoading(true);
  try {
    const response = await deleteApi(
      `${ApiMethods.bulkDeleteLoans}`,
      { ids },
      { isToken: true }
    );

    if (!response.isSuccess) {
      throw new Error(response.message);
    }

    setLoans((prev) => prev.filter((s) => !ids.includes(s.id)));
  } finally {
    setLoading(false);
  }
};

  return (
    <LoanContext.Provider value={{
      loans, selectedLoan, loading, error, meta,
      fetchLoans, createLoan, updateLoan, deleteLoan, addRepayment, bulkDeleteLoans,
      setSelectedLoan, setError
    }}>
      {children}
    </LoanContext.Provider>
  );
};

export const useLoans = () => useContext(LoanContext);