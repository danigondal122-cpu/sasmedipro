import React, { createContext, useContext, useState } from "react";

import { ApiMethods } from "../services/api_methods";
import { SaleModel } from "../models/SaleModel";
import { useNavigate } from "react-router-dom";
import { useApiServices } from "../hooks/useApiServices";

const SaleContext = createContext();

export const SaleProvider = ({ children }) => {
  const [sales, setSales] = useState([]);
  const [selectedSale, setSelectedSale] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [report, setReport] = useState({
  daily: 0,
  weekly: 0,
  monthly: 0,
});
  const navigate=useNavigate();

  const {getApi,postApi,putApi,deleteApi,patchApi}=useApiServices()
  const [meta, setMeta] = useState({
    current_page: 1,
    per_page: 10,
    total: 0,
    last_page: 1,
  });

  // 🔹 Fetch all sales
  const fetchSales = async ({ search = "", page = 1 ,  payment_type = ""} = {}) => {
    setLoading(true);
    setError("");

    try {
      const response = await getApi(
        ApiMethods.getSales,
        { search, page, per_page: 10, payment_type },
        { isToken: true },
        navigate
      );

      if (!response.isSuccess) {
        throw new Error(response.message || "Failed to fetch sales");
      }

      const list = response.data.map((s) => SaleModel.fromJson(s));
      setSales(list);

      if (response.meta) {
        setMeta(response.meta);
      }
    } catch (err) {
      console.error("fetchSales:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


 const fetchSaleReport = async (month = "") => {
  setLoading(true);
  setError("");

  try {
    const response = await getApi(
      ApiMethods.salesReport,
      { month },
      { isToken: true }
    );

    if (!response.isSuccess) {
      throw new Error(response.message);
    }

    setReport(response.data);
  } catch (err) {
    console.error("fetchSaleReport:", err);
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

  // 🔹 Fetch single sale
  const fetchSale = async (id) => {
    setLoading(true);
    setError("");

    try {
      const response = await getApi(
       ApiMethods.salesReport,
        {},
        { isToken: true },
        navigate
      );

      if (!response.isSuccess) {
        throw new Error(response.message || "Sale not found");
      }

      setSelectedSale(SaleModel.fromJson(response.data));
    } catch (err) {
      console.error("fetchSale:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Create sale (WITH sale items)
  const createSale = async (saleModel) => {
    setLoading(true);
    setError("");

    try {
      const response = await postApi(
        ApiMethods.createSales,
        saleModel.toJson(),
        { isToken: true }
      );

      if (!response.isSuccess) {
        throw new Error(response.message || "Create sale failed");
      }

      const newSale = SaleModel.fromJson(response.data);
      setSales((prev) => [newSale, ...prev]);

      return newSale;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Update sale (status / items)
  const updateSale = async (id, saleModel) => {
    setLoading(true);
    setError("");
  

    try {
      const response = await putApi(
        `${ApiMethods.updateSales}/${id}`,
        saleModel.toJson(),
        { isToken: true }
      );

      if (!response.isSuccess) {
        throw new Error(response.message || "Update sale failed");
      }

      const updated = SaleModel.fromJson(response.data);

      setSales((prev) =>
        prev.map((s) => (s.id === id ? updated : s))
      );

      setSelectedSale(updated);
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Delete sale (soft delete)
  const deleteSale = async (id) => {
    setLoading(true);
    setError("");

    try {
      const response = await deleteApi(
        `${ApiMethods.deleteSales}/${id}`,
        {},
        { isToken: true }
      );

      if (!response.isSuccess) {
        throw new Error(response.message || "Delete failed");
      }

      setSales((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };





  const bulkDeleteSales = async (ids) => {
  setLoading(true);
  try {
    const response = await deleteApi(
      `${ApiMethods.bulkDeleteSales}`,
      { ids },
      { isToken: true }
    );

    if (!response.isSuccess) {
      throw new Error(response.message);
    }

    setSales((prev) => prev.filter((s) => !ids.includes(s.id)));
  } finally {
    setLoading(false);
  }
};

const bulkUpdateStatus = async (ids, status) => {
  setLoading(true);
  try {
    const response = await patchApi(
      `${ApiMethods.bulkSalesStatus}`,
      { ids, status },
      { isToken: true }
    );

    if (!response.isSuccess) {
      throw new Error(response.message);
    }

    setSales((prev) =>
      prev.map((s) =>
        ids.includes(s.id) ? { ...s, status } : s
      )
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <SaleContext.Provider
      value={{
        sales,
         report,               // ✅ sale report
  
        selectedSale,
        loading,
        error,
        meta,

        bulkDeleteSales,
bulkUpdateStatus,

        fetchSaleReport,
        fetchSales,
        fetchSale,
        createSale,
        updateSale,
        deleteSale,

        setSelectedSale,
        setError,
      }}
    >
      {children}
    </SaleContext.Provider>
  );
};

export const useSales = () => useContext(SaleContext);
