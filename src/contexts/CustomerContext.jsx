import React, { createContext, useContext, useState } from "react";

import { ApiMethods } from "../services/api_methods";
import { CustomerModel } from "../models/CustomerModel";
import { useNavigate } from "react-router-dom";
import { useApiServices } from "../hooks/useApiServices";
const CustomerContext = createContext();

export const CustomerProvider = ({ children }) => {
   const [customers, setCustomers] = useState([]); // role: customer
  const [sellers, setSellers] = useState([]);     // role: seller
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedSeller, setSelectedSeller] = useState(null);
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

  // Fetch customers
  const fetchCustomers = async ({ search = "", page = 1, role = ""} = {}) => {
    setLoading(true);
    setError("");

    try {
      const response = await getApi(
        ApiMethods.getCustomers,
        { search, page, per_page: 10,role },
        { isToken: true },
        navigate
      );

      if (!response.isSuccess) {
        throw new Error(response.message || "Failed to fetch customers");
      }

      const list = response.data.map((c) => CustomerModel.fromJson(c));
      setCustomers(list);

      if (response.meta) {
        setMeta(response.meta);
      }
    } catch (err) {
       //  console.log(err)
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };




   /**
   * Fetch customers or sellers based on role
   * role = "customer" | "seller"
   */
  const fetchCustomersByRole = async ({ search = "", page = 1, role = "customer" } = {}) => {
    setLoading(true);
    setError("");

    try {
      const response = await getApi(
        ApiMethods.getCustomers,
        { search, page, per_page: 10, role },
        { isToken: true }
      );

      if (!response.isSuccess) throw new Error(response.message || "Failed to fetch");

      const list = response.data.map((c) => CustomerModel.fromJson(c));

      // Set appropriate state based on role
      if (role === "customer") setCustomers(list);
      else if (role === "seller") setSellers(list);

      if (response.meta) setMeta(response.meta);
      return list; // return the fetched list for immediate use
    } catch (err) {
     // console.log(err);
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Fetch single customer
  const fetchCustomer = async (id) => {
    setLoading(true);
    setError("");

    try {
      const response = await getApi(`${ApiMethods.customers}/${id}`);

      if (!response.isSuccess) {
        throw new Error("Customer not found");
      }

      setSelectedCustomer(CustomerModel.fromJson(response.data));
    } catch (err) {
      //   console.log(err)
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Create customer
  const createCustomer = async (data) => {
    setLoading(true);
    setError("");

    try {
      const customerModel = new CustomerModel(data);

      const response = await postApi(
        ApiMethods.createCustomers,
        customerModel.toJson(),
        { isToken: true }
      );

      if (!response.isSuccess) {
        throw new Error("Create failed");
      }

      const newCustomer = CustomerModel.fromJson(response.data);
      setCustomers((prev) => [newCustomer, ...prev]);

      return newCustomer;
    } catch (err) {
     //   console.log(err)
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update customer
  const updateCustomer = async (id, model) => {
    setLoading(true);
    setError("");

    try {
      const response = await putApi(
        `${ApiMethods.updateCustomers}/${id}`,
        model.toJson(),
        { isToken: true }
      );

      if (!response.isSuccess) {
        throw new Error("Update failed");
      }

      const updated = CustomerModel.fromJson(response.data);

      setCustomers((prev) =>
        prev.map((c) => (c.id === id ? updated : c))
      );

      setSelectedCustomer(updated);
      return updated;
    } catch (err) {
     //    console.log(err)
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete customer
  const deleteCustomer = async (id) => {
    setLoading(true);
    setError("");

    try {
      const response = await deleteApi(
        `${ApiMethods.deleteCustomers}/${id}`,
        {},
        { isToken: true }
      );

      if (!response.isSuccess) {
        throw new Error("Delete failed");
      }

      setCustomers((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
       //  console.log(err)
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <CustomerContext.Provider value={{
     customers,
      sellers,
      selectedCustomer,
      selectedSeller,
      loading,
      error,
      meta,
      fetchCustomersByRole,
      fetchCustomers,
      fetchCustomer,
      createCustomer,
      updateCustomer,
      deleteCustomer,
      setError
    }}>
      {children}
    </CustomerContext.Provider>
  );
};

export const useCustomers = () => useContext(CustomerContext);
