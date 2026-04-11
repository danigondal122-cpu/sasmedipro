import React, { createContext, useContext, useState } from "react";

import { ApiMethods } from "../services/api_methods";
import { PurchaseModel } from "../models/PurchaseModel";
import { useNavigate } from "react-router-dom";
import { useApiServices } from "../hooks/useApiServices";

const PurchaseContext = createContext();

export const PurchaseProvider = ({ children }) => {
  const [purchases, setPurchases] = useState([]);
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const {getApi,putApi,patchApi,deleteApi,postApi} =useApiServices()

  const [meta, setMeta] = useState({
    current_page: 1,
    per_page: 10,
    total: 0,
    last_page: 1,
  });

  // 🔹 Fetch purchases
  const fetchPurchases = async ({ search = "", page = 1 } = {}) => {
    setLoading(true);
    setError("");

    try {
      const response = await getApi(
        ApiMethods.getPurchases,
        { search, page, per_page: 10 },
        { isToken: true },
        navigate
      );

      if (!response.isSuccess) {
        throw new Error(response.message || "Failed to fetch purchases");
      }

      const list = response.data.map((p) => PurchaseModel.fromJson(p));
      setPurchases(list);

      if (response.meta) setMeta(response.meta);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Create purchase
  const createPurchase = async (purchaseData) => {
    setLoading(true);
    setError("");

    try {
      const purchaseModel = new PurchaseModel({
        product_name: purchaseData.productName,
        price: Number(purchaseData.price),
        amount: Number(purchaseData.amount),
        shipping: Number(purchaseData.shipping),
      });

      const response = await postApi(
        ApiMethods.createPurchase,
        purchaseModel.toJson(),
        { isToken: true }
      );

      if (!response.isSuccess) {
        throw new Error(response.message || "Create failed");
      }

      const newPurchase = PurchaseModel.fromJson(response.data);
      setPurchases((prev) => [newPurchase, ...prev]);

      return newPurchase;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };



  const updatePurchase = async (id, purchaseModel) => {
  setLoading(true);
  setError("");

  try {
    const response = await putApi(
      `${ApiMethods.updatePurchase}/${id}`,
      purchaseModel.toJson(),
      { isToken: true }
    );

    if (!response.isSuccess) {
      throw new Error(response.message || "Update failed");
    }

    const updated = PurchaseModel.fromJson(response.data);

    setPurchases((prev) =>
      prev.map((p) => (p.id === parseInt(id) ? updated : p))
    );

    return updated;
  } catch (err) {
    setError(err.message);
    throw err;
  } finally {
    setLoading(false);
  }
};

  // 🔹 Delete
  const deletePurchase = async (id) => {
    setLoading(true);
    setError("");

    try {
      const response = await deleteApi(
        `${ApiMethods.deletePurchase}/${id}`,
        {},
        { isToken: true }
      );

      if (!response.isSuccess) {
        throw new Error(response.message || "Delete failed");
      }

      setPurchases((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <PurchaseContext.Provider
      value={{
        purchases,
        selectedPurchase,
        loading,
        error,
        meta,
        fetchPurchases,
        createPurchase,
        updatePurchase,
        deletePurchase,
        setSelectedPurchase,
        setError,
      }}
    >
      {children}
    </PurchaseContext.Provider>
  );
};

export const usePurchases = () => useContext(PurchaseContext);