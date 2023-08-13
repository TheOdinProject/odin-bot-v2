const { rotationBuilder } = require("../../services/RotationBuilder");

const triage = rotationBuilder("triage", "maintainerTriageRotationList");

console.log(triage)

const { data, execute } = triage

module.exports = {
  data,
  execute,
};
