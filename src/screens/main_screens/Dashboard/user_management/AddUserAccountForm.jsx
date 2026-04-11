import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserAccounts } from "../../../../contexts/UserAccountContext";
import { UserAccountModel } from "../../../../models/UserAccountModel";
import ErrorBox from "../../../../components/ErrorAlertBox";
import { useRoles } from "../../../../contexts/RoleContext";
export default function AddUserAccountForm() {
  const navigate = useNavigate();
  const { createAccount, loading, error, setError } = useUserAccounts();
   const { roles, fetchRoles } = useRoles();
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "",
    password: "",
    password_confirmation: "",
  });

  useEffect(() => {
    fetchRoles();
    
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.password_confirmation) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const newUser = new UserAccountModel({
        name: form.name,
        email: form.email,
        role: form.role,
        password: form.password,
      });

      await createAccount(newUser.toJson({ includePassword: true }));
      navigate("/users");
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to create user.");
    }
  };

  return (
    <div className="add-page-wrapper">
      <div className="add-page-header">
        <h1 className="add-card-title">Add User</h1>
      </div>

      <div className="add-page-content">
        <ErrorBox message={error} onClose={() => setError("")} />

        <form className="add-form" onSubmit={handleSubmit}>
          <label>
            Name
            <input
              type="text"
              name="name"
              placeholder="Enter full name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Email
            <input
              type="email"
              name="email"
              placeholder="Enter email address"
              value={form.email}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Role
            <select
  name="role"
  value={form.role}
  onChange={handleChange}
  required
>
  <option value="">Select Role</option>
  {roles.map((r) => (
    <option key={r.id} value={r.key}>
      {r.label}
    </option>
  ))}
</select>
          </label>

          <label>
            Password
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Confirm Password
            <input
              type="password"
              name="password_confirmation"
              placeholder="Confirm password"
              value={form.password_confirmation}
              onChange={handleChange}
              required
            />
          </label>

          <div className="add-form-actions">
            <button
              type="submit"
              className="add-btn-primary"
              disabled={loading}
            >
              {loading ? "Saving..." : "Create User"}
            </button>

            <button
              type="button"
              className="add-btn-secondary"
              onClick={() => navigate("/users")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
