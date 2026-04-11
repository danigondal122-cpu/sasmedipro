import React, { createContext, useContext, useEffect, useState } from "react";
import { useApiServices } from "../hooks/useApiServices";

import { ApiMethods } from "../services/api_methods";
import { ItemModel } from "../models/ItemModel";
import { useNavigate } from "react-router-dom";
const ItemContext = createContext();

export const ItemProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
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

  // 🔹 Fetch all items
  const fetchItems = async ({ search ="", page = 1 } = {}) => {
    setLoading(true);
    setError("");
    
    try {
      const response = await getApi(
        ApiMethods.getItems,
         {
        search,
        page,
        per_page: 10,
      },
        {isToken:true},
        navigate
      );
    

      if (!response.isSuccess) {
        throw new Error(response.message || "Failed to fetch items");
      }

      const list = response.data.map((i) => ItemModel.fromJson(i));
      setItems(list);

        if (response.meta) {
          
      setMeta(response.meta);
    }
    } catch (err) {
     
       if (err.response?.status === 401) {
      
      // if (navigate) navigate("/login"); // ✅ use navigate passed from component
      return ;
    }
      console.error("fetchItems:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };





  // 🔹 Fetch single item
  const fetchItem = async (id) => {
    setLoading(true);
    setError("");

    try {
      const response = await getApi(`${ApiMethods.items}/${id}`);

      if (!response.success) {
        throw new Error(response.message || "Item not found");
      }

      setSelectedItem(ItemModel.fromJson(response.data));
    } catch (err) {
      console.error("fetchItem:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Create item
  const createItem = async (itemData) => {
    setLoading(true);
    setError("");

    try {

        const itemModel = new ItemModel({
      item_name: itemData.itemName,
      price: Number(itemData.price),
      qty: Number(itemData.qty),
      tax: Number(itemData.tax),
      batch_number: itemData.batchNumber,
  expiry_date: itemData.expiryDate,
      
      // status: itemData.status ? "Active" : "Inactive",
    });

      const response = await postApi(
        ApiMethods.createItems,
        itemModel.toJson(),
        { isToken: true }
      );

      if (!response.isSuccess) {
        throw new Error(response.message || "Create failed");
      }

      const newItem = ItemModel.fromJson(response.data);
      setItems((prev) => [newItem, ...prev]);

      return newItem;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Update item
  const updateItem = async (id, itemModel) => {
    setLoading(true);
    setError("");

    try {
      const response = await putApi(
        `${ApiMethods.updateItems}/${id}`,
        itemModel.toJson(),
        {isToken:true}
      );

      if (!response.isSuccess) {
        throw new Error(response.message || "Update failed");
      }

      const updated = ItemModel.fromJson(response.data);

      setItems((prev) =>
        prev.map((i) => (i.id === id ? updated : i))
      );

      setSelectedItem(updated);
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Delete item (soft delete)
  const deleteItem = async (id) => {
    setLoading(true);
    setError("");

    try {
      const response = await putApi(
        `${ApiMethods.deleteItems}/${id}`,{},{isToken:true}
      );


      if (!response.isSuccess) {
        throw new Error(response.message || "Delete failed");
      }

      
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };


  const bulkDeleteItems = async (ids) => {
  setLoading(true);
  setError("");

  try {
    const response = await deleteApi(
      `${ApiMethods.bulkDeleteItems}`,
      { ids },
      { isToken: true }
    );

    if (!response.isSuccess) {
      throw new Error(response.message || "Bulk delete failed");
    }

    // Remove deleted items from state
    setItems((prev) => prev.filter((item) => !ids.includes(item.id)));

    return true;
  } catch (err) {
    setError(err.message);
    throw err;
  } finally {
    setLoading(false);
  }
};

  return (
    <ItemContext.Provider
      value={{
        items,
        selectedItem,
        loading,
        error,
        fetchItems,
        fetchItem,
        createItem,
        updateItem,
        bulkDeleteItems,
        deleteItem,
        setSelectedItem,
        setError,
        meta
      }}
    >
      {children}
    </ItemContext.Provider>
  );
};

export const useItems = () => useContext(ItemContext);
