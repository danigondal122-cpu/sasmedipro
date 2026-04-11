import React, { useEffect, useState } from "react";
import { useRoles } from "../../../../contexts/RoleContext";
import SaveIcon from "@mui/icons-material/Save";

export default function PermissionMatrix() {
  const { roles, permissions, fetchRoles, updateRole, loading } = useRoles();
  const [matrix, setMatrix] = useState({});// { roleId: Set(permissionName) }
  const [saving, setSaving] = useState(false);
  

  // Fetch roles and permissions on mount
  useEffect(() => {
  fetchRoles();
   
  }, []);

useEffect(() => {
  if (roles.length > 0) {
    setMatrix(prev => {
      const updated = { ...prev };
      roles.forEach(role => {
        if (!updated[role.id]) {
          updated[role.id] = [...role.permissions];
        }
      });
      return updated;
    });
  }
}, [roles]);

// Handle checkbox
const handleCheckboxChange = (roleId, permissionName) => {
  setMatrix(prev => {
    const rolePermissions = prev[roleId] || [];
    const newRolePermissions = rolePermissions.includes(permissionName)
      ? rolePermissions.filter(p => p !== permissionName) // remove
      : [...rolePermissions, permissionName]; // add

    return { ...prev, [roleId]: newRolePermissions };
  });
};


const arraysEqual = (a = [], b = []) => {
  if (a.length !== b.length) return false;

  const sortedA = [...a].sort();
  const sortedB = [...b].sort();

  return sortedA.every((value, index) => value === sortedB[index]);
};

const handleSave = async () => {
  setSaving(true);

  try {
    // Only roles that:
    // 1. Are NOT system reserved
    // 2. Have modified permissions
    const modifiedRoles = roles.filter(role => {
      if (role.system_reserve) return false;

      const original = role.permissions || [];
      const current = matrix[role.id] || [];

      return !arraysEqual(original, current);
    });

    if (modifiedRoles.length === 0) {
      alert("No changes detected.");
      return;
    }

    await Promise.all(
      modifiedRoles.map(role =>
        updateRole(role.id, {
          permissions: matrix[role.id] || []
        })
      )
    );

    alert("Permissions updated successfully!");
  } catch (err) {
    alert("Failed to save permissions: " + err.message);
  } finally {
    setSaving(false);
  }
};

  if (loading) return <p>Loading...</p>;
  

  return (
    <div className="permission-matrix-container">
  <h2 className="permission-matrix-title">Permission Matrix</h2>

  <div className="permission-matrix-table-wrapper">
    <table className="permission-matrix-table">
      <thead>
        <tr>
          <th>Permission</th>
          {roles.map(role => (
            <th key={role.id}>{role.label}</th>
          ))}
        </tr>
      </thead>

      <tbody>
        {permissions.map(permission => (
          <tr key={permission.key}>
            <td className="permission-name-cell">
              {permission.label}
            </td>

            {roles.map(role => (
              <td key={role.id}>
                <input
                  className="permission-checkbox"
                  disabled={Boolean(role.system_reserve)}
                  type="checkbox"
                  checked={matrix[role.id]?.includes(permission.key) || false}
                  onChange={() =>
                    handleCheckboxChange(role.id, permission.key)
                  }
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  <button
    className="permission-save-btn"
    disabled={saving}
    onClick={handleSave}
  >
    <SaveIcon />
    {saving ? "Saving..." : "Save Changes"}
  </button>
</div>
  );
}
