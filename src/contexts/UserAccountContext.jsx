import React, { createContext, useContext, useState } from "react";

import { ApiMethods } from "../services/api_methods";
import { UserAccountModel } from "../models/UserAccountModel";
import { useApiServices } from "../hooks/useApiServices";

const UserAccountContext = createContext();

export const UserAccountProvider = ({ children }) => {

  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [meta, setMeta] = useState({
    current_page: 1,
    last_page: 1,
  });

  const {getApi,postApi,putApi,deleteApi,patchApi}=useApiServices()

  

  const fetchAccounts = async ({ search = "", page = 1 } = {}) => {
    setLoading(true);
    setError("");

    try {
      const response = await getApi(
        ApiMethods.getUserAccounts,
        { search, page, per_page: 10 },
        { isToken: true }
      );

      if (!response.isSuccess)
        throw new Error(response.message);

      const list = response.data.map((u) =>
        UserAccountModel.fromJson(u)
      );

      setAccounts(list);
      setMeta(response.meta);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createAccount = async (data) => {
    setLoading(true);

    try {
      const response = await postApi(
        ApiMethods.createUserAccount,
        data,
        { isToken: true }
      );

      if (!response.isSuccess)
        throw new Error("Create failed");

      const newAccount = UserAccountModel.fromJson(response.data);
      setAccounts((prev) => [newAccount, ...prev]);

      return newAccount;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };



    const updateAccount = async (id, data) => {
    setLoading(true);
    try {
      const response = await putApi(
        `${ApiMethods.updateUserAccount}/${id}`,
        data,
        { isToken: true }
      );
      if (!response.isSuccess) throw new Error("Update failed");
      const updatedAccount = UserAccountModel.fromJson(response.data);
      setAccounts((prev) =>
        prev.map((u) => (u.id === id ? updatedAccount : u))
      );
      return updatedAccount;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Delete user
  const deleteAccount = async (id) => {
    setLoading(true);
    try {
      const response = await deleteApi(
        `${ApiMethods.deleteUserAccount}/${id}`,
        {},
        { isToken: true }
      );
      if (!response.isSuccess) throw new Error("Delete failed");
      setAccounts((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserAccountContext.Provider value={{
      accounts,
      loading,
      error,
      meta,
      fetchAccounts,
      createAccount,
      updateAccount,
      deleteAccount,
      setError
    }}>
      {children}
    </UserAccountContext.Provider>
  );
};

export const useUserAccounts = () => useContext(UserAccountContext);
