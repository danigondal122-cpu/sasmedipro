// src/helpers/roleHelper.js

// Mapping backend role values to frontend-friendly labels
export const RoleMap = {
  admin: "Administrator",
  inventory_manager: "Inventory Manager",
  manager: "Manager",
};

/**
 * Get display label for a role
 * @param {string} role - role string from backend
 * @returns {string} - friendly display label
 */
export const getRoleLabel = (role) => {
  return RoleMap[role] || "Unknown Role";
};
