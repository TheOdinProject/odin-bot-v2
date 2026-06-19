const { roles } = require('../../../config');

class Role {
  constructor(id, name) {
    this.id = id;
    this.name = name;
  }

  static get admin() {
    return new Role(roles.admin.id, roles.admin.name);
  }
  static get core() {
    return new Role(roles.core.id, roles.core.name);
  }
  static get maintainer() {
    return new Role(roles.maintainer.id, roles.maintainer.name);
  }
  static get moderator() {
    return new Role(roles.moderator.id, roles.moderator.name);
  }
  static get nobot() {
    return new Role(roles.nobot.id, roles.nobot.name);
  }
  static get club40() {
    return new Role(roles.club40.id, roles.club40.name);
  }
}

module.exports = Role;
