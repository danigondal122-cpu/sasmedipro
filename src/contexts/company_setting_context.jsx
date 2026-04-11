// src/contexts/company_setting_context.js
import React, { createContext, useContext, useState } from "react";

import { ApiMethods } from "../services/api_methods";
import { CompanySettingModel } from "../models/CompanySettingModel";
import { useApiServices } from "../hooks/useApiServices";

const CompanySettingContext = createContext();

export const CompanySettingProvider = ({ children }) => {
  const [settings, setSettings] = useState(new CompanySettingModel());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
 const {getApi,postApi,putApi,deleteApi,patchApi}=useApiServices()

 

  // Fetch company settings
  const fetchSettings = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getApi(ApiMethods.getCompanySettings, {}, { isToken: true });

      if (!response.isSuccess) throw new Error(response.message || "Failed to fetch company settings");

      setSettings(CompanySettingModel.fromJson(response.data));
      return CompanySettingModel.fromJson(response.data);
    } catch (err) {
     // console.log(err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update company settings
  const updateSettings = async (model) => {
    setLoading(true);
    setError("");

    try {
     const response = await putApi(
  ApiMethods.updateCompanySettings,
  model.toJson(),
  { isToken: true }
);

      if (!response.isSuccess) throw new Error(response.message || "Update failed");

      const updatedSettings = CompanySettingModel.fromJson(response.data);
      setSettings(updatedSettings);
      return updatedSettings;
    } catch (err) {
  //    console.log(err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };


  

  return (
    <CompanySettingContext.Provider
      value={{
        settings,
        loading,
        error,
        fetchSettings,
        updateSettings,
        setError,
      }}
    >
      {children}
    </CompanySettingContext.Provider>
  );
};

export const useCompanySettings = () => useContext(CompanySettingContext);
