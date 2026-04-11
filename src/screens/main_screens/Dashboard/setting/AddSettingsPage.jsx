





// src/pages/settings/AddSettingsPage.js



import { CompanySettingModel } from "../../../../models/CompanySettingModel";
import React, { useState, useEffect } from "react";
import { useCompanySettings } from "../../../../contexts/company_setting_context";
import ErrorBox from "../../../../components/ErrorAlertBox";

export default function AddSettingsPage() {
  const { settings, fetchSettings,updateSettings, loading, error, setError } =
    useCompanySettings();

  // Local state mirrors the settings for form inputs
  const [logo, setLogo] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [fax, setFax] = useState("");
  const [vat, setVat] = useState("");
  const [brn, setBrn] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");

  // Fetch settings when component mounts
  useEffect(() => {
    const loadSettings = async () => {
      const data = await fetchSettings();
      if (data) {
        setLogo(data.logo || "");
        setCompanyName(data.name || "");
        setAddress(data.address || "");
        setPhone(data.phone || "");
        setFax(data.fax || "");
        setVat(data.vat || "");
        setBrn(data.brn || "");
        setEmail(data.email || "");
        setWebsite(data.website || "");
      }
    };
    loadSettings();
  }, []);

 const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  try {
    const updatedModel = {
      name: companyName,
      logo: logo,
      address: address,
      phone: phone,
      fax: fax,
      vat: vat,
      brn: brn,
      email: email,
      website: website,
    };

    await updateSettings(new CompanySettingModel(updatedModel));

    alert("Settings updated successfully!");
  } catch (err) {
    console.error(err);
    setError(err.message);
  }
};

  return (
    <div className="add-page-wrapper">
      <div className="add-page-header">
        <h1 className="add-card-title">Company Settings</h1>
      </div>

      <div className="add-page-content">
        <ErrorBox message={error} onClose={() => setError("")} />

        <form className="add-form" onSubmit={handleSubmit}>
          <input
            placeholder="Company Name"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            required
          />
          <input
            placeholder="Logo URL"
            value={logo}
            onChange={(e) => setLogo(e.target.value)}
          />
          <input
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <input
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <input
            placeholder="Fax"
            value={fax}
            onChange={(e) => setFax(e.target.value)}
          />
          <input
            placeholder="VAT Number"
            value={vat}
            onChange={(e) => setVat(e.target.value)}
          />
          <input
            placeholder="BRN Number"
            value={brn}
            onChange={(e) => setBrn(e.target.value)}
          />
          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            placeholder="Website"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />

          <div className="add-form-actions">
            <button className="add-btn-primary" type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Settings"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
