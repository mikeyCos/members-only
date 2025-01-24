// Runs on O(n) time
const hasRole = (userRolesArr, rolesArr) => {
  if (!rolesArr || !userRolesArr || userRolesArr.length === 0) return false;

  const userRoles = [...userRolesArr];
  const roles = [...rolesArr];
  const userRole = userRoles.pop();
  if (roles.some((role) => role === userRole)) return true;
  return hasRole(userRoles, roles);
};

module.exports = hasRole;
