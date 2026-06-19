const { roles } = require('../config');

const adminRoleIds = [
  roles.admin.id,
  roles.core.id,
  roles.maintainer.id,
  roles.moderator.id,
];

function isAdmin(member) {
  return adminRoleIds.some((id) => member?.roles.cache.has(id));
}

module.exports = { isAdmin };
