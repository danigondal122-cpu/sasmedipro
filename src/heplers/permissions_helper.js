// heplers/permissions_helper.js
export const hasPermission = (userPermissions = [], requiredPermissions = []) => {
  if (!requiredPermissions || requiredPermissions.length === 0) return true; // no permissions required
  if (!userPermissions || userPermissions.length === 0) return false; // user has nothing
  return requiredPermissions.some((perm) => userPermissions.includes(perm));
};
