// Runs on O(n) time
const hasRole = (userRolesArr, rolesQueryArr) => {
  if (!rolesQueryArr || !userRolesArr || userRolesArr.length === 0)
    return false;

  /* Similar to Array.prototype.shift()
   * const roles = [...rolesQueryArr];
   * const [userRole, ...userRoles] = userRolesArr
   */
  const userRoles = [...userRolesArr];
  const rolesQuery = [...rolesQueryArr];
  const userRole = userRoles.pop();
  if (rolesQuery.some((role) => role === userRole)) return true;
  return hasRole(userRoles, rolesQuery);
};

module.exports = hasRole;
