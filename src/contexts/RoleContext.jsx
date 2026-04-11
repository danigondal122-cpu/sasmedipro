import React, { createContext, useContext, useState,useEffect} from "react";

import { ApiMethods } from "../services/api_methods";
import { RoleModel } from "../models/RoleModel";
import { useApiServices } from "../hooks/useApiServices";

const RoleContext = createContext();

export const RoleProvider = ({ children }) => {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const {getApi,postApi,putApi,deleteApi,patchApi}=useApiServices()


  useEffect(() => {
  fetchRoles();
}, []);

 const fetchRoles = async () => {
    setLoading(true);
    try {
      const response = await getApi(
        ApiMethods.getRoles, // make sure this API returns { roles: [], permissions: [] }
        {},
        { isToken: true }
      );

      if (!response.isSuccess) throw new Error(response.message);

      // If API returns { roles: [], permissions: [] }
      const { roles: rolesData, permissions: allPermissions } = response.data;
     //   console.log(rolesData)
      setRoles(rolesData.map(r => RoleModel.fromJson(r)));
      setPermissions(allPermissions);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createRole = async (data) => {
    setLoading(true);
    try {
      const response = await postApi(
        ApiMethods.createRole,
        data,
        { isToken: true }
      );

      if (!response.isSuccess) throw new Error("Create failed");

      const newRole = RoleModel.fromJson(response.data);
      setRoles(prev => [newRole, ...prev]);
      return newRole;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateRole = async (id, data) => {
   
    setLoading(true);
    try {
     
      const response = await putApi(
        `${ApiMethods.updateRole}/${id}`,
        data,
        { isToken: true }
      );

      if (!response.isSuccess) throw new Error("Update failed");

      const updated = RoleModel.fromJson(response.data);

      setRoles(prev =>
        prev.map(r => (r.id === id ? updated : r))
      );

      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteRole = async (id) => {
    setLoading(true);
    try {
      const response = await deleteApi(
        `${ApiMethods.deleteRole}/${id}`,
        {},
        { isToken: true }
      );

      if (!response.isSuccess) throw new Error("Delete failed");

      setRoles(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <RoleContext.Provider
      value={{
        roles,
        permissions,
        loading,
        error,
        fetchRoles,
        
        createRole,
        updateRole,
        deleteRole,
        setError,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
};

export const useRoles = () => useContext(RoleContext);
