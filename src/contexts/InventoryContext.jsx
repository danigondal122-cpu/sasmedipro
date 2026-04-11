import React, { createContext, useContext, useState } from "react";

import { ApiMethods } from "../services/api_methods";
import { InventoryModel } from "../models/InventoryModel";
import { useNavigate } from "react-router-dom";
import { useApiServices } from "../hooks/useApiServices";
const InventoryContext = createContext();

export const InventoryProvider = ({ children }) => {
  const [inventories, setInventories] = useState([]);
  const [selectedInventory, setSelectedInventory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate=useNavigate();

  const {getApi,postApi,putApi,deleteApi,patchApi}=useApiServices()

  const [meta, setMeta] = useState({
    current_page: 1,
    per_page: 10,
    total: 0,
    last_page: 1,
  });

  // 🔹 Fetch all inventories
  const fetchInventories = async ({ search = "", page = 1 } = {}) => {
    setLoading(true);
    setError("");

    try {
      const response = await getApi(
        ApiMethods.getInventories,
        { search, page, per_page: 10 },
        { isToken: true },
        navigate
      );

      if (!response.isSuccess) throw new Error(response.message || "Failed to fetch inventories");
  
      const list = response.data.map((i) => InventoryModel.fromJson(i));
      setInventories(list);

      if (response.meta) setMeta(response.meta);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Fetch single inventory
  const fetchInventory = async (id) => {
    setLoading(true);
    setError("");

    try {
      const response = await getApi(`${ApiMethods.getInventories}/${id}`, {}, { isToken: true });
      if (!response.isSuccess) throw new Error(response.message || "Inventory not found");
      setSelectedInventory(InventoryModel.fromJson(response.data));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Create inventory
  const createInventory = async (inventoryData) => {
    setLoading(true);
    setError("");

    try {
      const inventoryModel = new InventoryModel(inventoryData);

      const response = await postApi(
        ApiMethods.createInventories,
        inventoryModel.toJson(),
        { isToken: true }
      );

      if (!response.isSuccess) throw new Error(response.message || "Create failed");

      const newInventory = InventoryModel.fromJson(response.data);
      setInventories((prev) => [newInventory, ...prev]);
      return newInventory;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Update inventory
  const updateInventory = async (id, inventoryModel) => {
    setLoading(true);
    setError("");

    try {
      const response = await putApi(
        `${ApiMethods.updateInventories}/${id}`,
        inventoryModel.toJson(),
        { isToken: true }
      );

      if (!response.isSuccess) throw new Error(response.message || "Update failed");

      const updated = InventoryModel.fromJson(response.data);
      setInventories((prev) => prev.map((i) => (i.id === id ? updated : i)));
      setSelectedInventory(updated);
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Delete inventory
  const deleteInventory = async (id) => {
    setLoading(true);
    setError("");

    try {
      const response = await deleteApi(`${ApiMethods.deleteInventories}/${id}`, {}, { isToken: true });
      if (!response.isSuccess) throw new Error(response.message || "Delete failed");

      setInventories((prev) => prev.filter((i) => i.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };




   const bulkDeleteInventories = async (ids) => {
    setLoading(true);
    setError("");
  
    try {
      const response = await deleteApi(
        `${ApiMethods.bulkDeleteInventories}`,
        { ids },
        { isToken: true }
      );
  
      if (!response.isSuccess) {
        throw new Error(response.message || "Bulk delete failed");
      }
  
      // Remove deleted items from state
      setInventories((prev) => prev.filter((inv) => !ids.includes(inv.id)));
  
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <InventoryContext.Provider
      value={{
        inventories,
        selectedInventory,
        loading,
        error,
        fetchInventories,
        fetchInventory,
        createInventory,
        updateInventory,
        deleteInventory,
        bulkDeleteInventories,
        setSelectedInventory,
        setError,
        meta,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventories = () => useContext(InventoryContext);
