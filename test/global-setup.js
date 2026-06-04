require('dotenv').config({ quiet: true });
const MissingEnvVarError = require('../utils/errors/missing-env-var');

module.exports = () => {
  const missingMandatoryEnvKeys =
    MissingEnvVarError.getMissingMandatoryTestKeys();
  if (missingMandatoryEnvKeys.length) {
    throw new MissingEnvVarError(missingMandatoryEnvKeys);
  }
};
