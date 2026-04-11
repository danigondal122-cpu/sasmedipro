// EditUserAccountPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUserAccounts } from "../../../../contexts/UserAccountContext";
import ErrorBox from "../../../../components/ErrorAlertBox";
import { useRoles } from "../../../../contexts/RoleContext";



export default function EditUserAccountPage() {
  const { accounts, updateAccount, error, setError } = useUserAccounts();
  const { id } = useParams();
  const navigate = useNavigate();
  const { roles, fetchRoles } = useRoles();

useEffect(() => {
  fetchRoles();
  
}, []);

  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "",
    password: "",
    password_confirmation: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const user = accounts.find((u) => u.id === parseInt(id));
    if (user) {
      setForm({
        name: user.name,
        email: user.email,
        role: user.role,
        password: "",
        password_confirmation: "",
      });
    }
  }, [id, accounts]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password && form.password !== form.password_confirmation) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const updateData = {
        name: form.name,
        email: form.email,
        role: form.role,
      };
      if (form.password) updateData.password = form.password;
      await updateAccount(id, updateData);
      navigate("/users");
    } catch (err) {
      console.error(err);
      setError(err.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-page-wrapper">
      <div className="add-page-header">
        <h1 className="add-card-title">Edit User</h1>
      </div>

      <div className="add-page-content">
        <ErrorBox message={error} onClose={() => setError("")} />

        <form className="add-form" onSubmit={handleSubmit}>
          <label>
            Name
            <input
              type="text"
              name="name"
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
              value={form.password}
              onChange={handleChange}
              placeholder="Leave blank to keep current"
            />
          </label>

          <label>
            Confirm Password
            <input
              type="password"
              name="password_confirmation"
              value={form.password_confirmation}
              onChange={handleChange}
              placeholder="Leave blank to keep current"
            />
          </label>

          <div className="add-form-actions">
            <button type="submit" className="add-btn-primary" disabled={loading}>
              {loading ? "Updating..." : "Update User"}
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
