const { roles } = require('../config');

function isAdmin(member) {
  return member?.roles.cache.some((role) =>
    roles.adminRolesName.includes(role.name),
  );
}

module.exports = { isAdmin };
