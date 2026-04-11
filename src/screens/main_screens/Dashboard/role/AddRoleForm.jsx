import React, { useEffect, useState } from "react";
import { useRoles } from "../../../../contexts/RoleContext";
import { useNavigate } from "react-router-dom";


export default function AddRoleForm() {
  const navigate = useNavigate();
  const { fetchRoles, createRole, permissions, loading } = useRoles();

  const [form, setForm] = useState({
    name: "",
    permissions: [],
  });

  useEffect(() => {
     fetchRoles();
  }, []);

  const handleCheckbox = (perm) => {
    setForm((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(perm)
        ? prev.permissions.filter((p) => p !== perm)
        : [...prev.permissions, perm],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createRole(form);
    navigate("/roles");
  };

  return (
    <div className="permission-matrix-container add-page-wrapper">
      <h2 className="permission-matrix-title">Add Role</h2>

      <form onSubmit={handleSubmit} className="add-form">
        {/* Role Name */}
        <label>
          Role Name
          <input
            type="text"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
            required
            className="permission-name-cell"
          />
        </label>

        {/* Permissions Grid */}
        <h3 style={{ marginTop: "20px", marginBottom: "10px", color: "#065f46" }}>
          Permissions
        </h3>

        <div className="permission-matrix-table-wrapper">
          <table className="permission-matrix-table">
            <thead>
              <tr>
                <th>Permission</th>
                <th>Allow</th>
              </tr>
            </thead>
            <tbody>
              {permissions.map((perm) => (
                <tr key={perm.key}>
                  <td className="permission-name-cell">{perm.label}</td>
                  <td>
                    <input
                      type="checkbox"
                      className="permission-checkbox"
                      checked={form.permissions.includes(perm.key)}
                      onChange={() => handleCheckbox(perm.key)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="add-form-actions">
        <button
          type="submit"
         className="add-btn-primary"
          disabled={loading}
          style={{ marginRight: "40px" }}
        
          
        >
          {loading ? "Saving..." : "Create Role"}
        </button>
        </div>
      </form>
    </div>
  );
}
