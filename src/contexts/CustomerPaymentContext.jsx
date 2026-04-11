// contexts/CustomerPaymentContext.js
import React, { createContext, useContext, useState } from "react";

import { ApiMethods } from "../services/api_methods";
import { CustomerPaymentModel } from "../models/CustomerPaymentModel";
import { useNavigate } from "react-router-dom";
import { useApiServices } from "../hooks/useApiServices";

const CustomerPaymentContext = createContext();

export const CustomerPaymentProvider = ({ children }) => {
  const [payments, setPayments] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, per_page: 10, total: 0 });
  const [error, setError] = useState("");

  const {getApi,postApi,putApi,deleteApi,patchApi}=useApiServices()
 
  const navigate=useNavigate();
  const fetchPayments = async ({ page = 1, customer_id = "" } = {}) => {
    setLoading(true);
    setError("");

    try {
      const response = await getApi(
        ApiMethods.customerPayments,
        { page, per_page: 10, customer_id },
        { isToken: true },
        navigate
      );

      if (!response.isSuccess) throw new Error(response.message || "Failed to fetch payments");

      const list = response.data.map((p) => CustomerPaymentModel.fromJson(p));
      setPayments(list);

      if (response.meta) setMeta(response.meta);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchPayment = async (id) => {
    setLoading(true);
    setError("");

    try {
      const response = await getApi(
        `${ApiMethods.customerPayments}/${id}`,
        {},
        { isToken: true }
      );

      if (!response.isSuccess) throw new Error(response.message || "Payment not found");

      setSelectedPayment(CustomerPaymentModel.fromJson(response.data));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CustomerPaymentContext.Provider value={{
      payments,
      selectedPayment,
      loading,
      error,
      meta,
      fetchPayments,
      fetchPayment,
      setSelectedPayment,
      setError
    }}>
      {children}
    </CustomerPaymentContext.Provider>
  );
};

export const useCustomerPayments = () => useContext(CustomerPaymentContext);
