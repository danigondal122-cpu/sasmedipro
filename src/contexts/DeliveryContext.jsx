// contexts/DeliveryContext.js
import React, { createContext, useContext, useState } from "react";

import { ApiMethods } from "../services/api_methods";
import { DeliveryModel } from "../models/DeliveryModel";
import { useApiServices } from "../hooks/useApiServices";

const DeliveryContext = createContext();

export const DeliveryProvider = ({ children }) => {
  const [deliveries, setDeliveries] = useState([]);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const {getApi,postApi,putApi,deleteApi,patchApi}=useApiServices()

  // Meta for pagination
  const [meta, setMeta] = useState({
    current_page: 1,
    per_page: 10,
    total: 0,
    last_page: 1,
  });

  // 🔹 Fetch deliveries with optional pagination and search
  const fetchDeliveries = async ({ search = "", page = 1 } = {}) => {
    setLoading(true);
    setError("");

    try {
      const response = await getApi(
        ApiMethods.getDeliveries,
        { search, page, per_page: 10 },
        { isToken: true }
      );

      if (!response.isSuccess) {
        throw new Error(response.message || "Failed to fetch deliveries");
      }

      // Convert API data into DeliveryModel instances
      const deliveriesData = (response.data || []).map(DeliveryModel.fromJson);

      setDeliveries(deliveriesData);

      if (response.meta) setMeta(response.meta);
    } catch (err) {
      console.error("fetchDeliveries:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Fetch single delivery by ID
  const fetchDelivery = async (id) => {
    setLoading(true);
    setError("");

    try {
      const response = await getApi(
        `${ApiMethods.deliveries}/${id}`,
        {},
        { isToken: true }
      );

      if (!response.isSuccess) {
        throw new Error(response.message || "Delivery not found");
      }

      setSelectedDelivery(DeliveryModel.fromJson(response.data));
    } catch (err) {
      console.error("fetchDelivery:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Create delivery for a sale
 const createDelivery = async (saleId, status = "pending") => {
  setLoading(true);
  setError("");

  try {
    const response = await postApi(
      ApiMethods.createDelivery,
      {
        sale_id: Number(saleId), // must be a number
        status: status           // optional, default to "pending"
      },
      { isToken: true }
    );

    if (!response.isSuccess) {
      throw new Error(response.message || "Failed to create delivery");
    }

    const newDelivery = DeliveryModel.fromJson(response.data);
    setDeliveries((prev) => [newDelivery, ...prev]);
    return newDelivery;
  } catch (err) {
    console.error("createDelivery:", err);
    setError(err.message);
    throw err;
  } finally {
    setLoading(false);
  }
};

  // 🔹 Update delivery status
  const updateDeliveryStatus = async (deliveryId, status) => {
    setLoading(true);
    setError("");

    try {
      const response = await putApi(
        ApiMethods.updateDeliveryStatus(deliveryId),
        { status },
        { isToken: true }
      );

      if (!response.isSuccess) {
        throw new Error(response.message || "Failed to update status");
      }

      const updatedDelivery = DeliveryModel.fromJson(response.data);
      setDeliveries((prev) =>
        prev.map((d) => (d.id === deliveryId ? updatedDelivery : d))
      );

      if (selectedDelivery?.id === deliveryId) {
        setSelectedDelivery(updatedDelivery);
      }

      return updatedDelivery;
    } catch (err) {
      console.error("updateDeliveryStatus:", err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Delete delivery
  const deleteDelivery = async (deliveryId) => {
    setLoading(true);
    setError("");

    try {
      const response = await deleteApi(
        ApiMethods.deleteDelivery(deliveryId),
        {},
        { isToken: true }
      );

      if (!response.isSuccess) {
        throw new Error(response.message || "Failed to delete delivery");
      }

      setDeliveries((prev) => prev.filter((d) => d.id !== deliveryId));
      if (selectedDelivery?.id === deliveryId) setSelectedDelivery(null);
    } catch (err) {
      console.error("deleteDelivery:", err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };





  const bulkDeleteDeliveries = async (ids = []) => {
  setLoading(true);
  setError("");

  try {
    const response = await deleteApi(
     ApiMethods.bulkDeleteDeliveries,
      { ids },
      { isToken: true }
    );

    if (!response.isSuccess) throw new Error(response.message || "Failed bulk delete");

    setDeliveries((prev) => prev.filter((d) => !ids.includes(d.id)));
  } catch (err) {
    console.error("bulkDeleteDeliveries:", err);
    setError(err.message);
    throw err;
  } finally {
    setLoading(false);
  }
};

// Bulk update status
const bulkUpdateDeliveryStatus = async (ids = [], status) => {
  setLoading(true);
  setError("");

  try {
    const response = await patchApi(
      ApiMethods.bulkUpdateDeliveryStatus,
      { ids, status },
      { isToken: true }
    );

    if (!response.isSuccess) throw new Error(response.message || "Failed bulk update");

    setDeliveries((prev) =>
      prev.map((d) => (ids.includes(d.id) ? { ...d, status } : d))
    );
  } catch (err) {
    console.error("bulkUpdateDeliveryStatus:", err);
    setError(err.message);
    throw err;
  } finally {
    setLoading(false);
  }
};

  return (
    <DeliveryContext.Provider
      value={{
        deliveries,
        selectedDelivery,
        loading,
        error,
        meta,
        fetchDeliveries,
        fetchDelivery,
        createDelivery,
        updateDeliveryStatus,
        deleteDelivery,
        bulkDeleteDeliveries,
        bulkUpdateDeliveryStatus,
        setSelectedDelivery,
        setError,
      }}
    >
      {children}
    </DeliveryContext.Provider>
  );
};

export const useDeliveries = () => useContext(DeliveryContext);