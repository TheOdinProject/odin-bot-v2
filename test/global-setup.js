require('../utils/load-env').load();
const MissingEnvVarError = require('../utils/errors/missing-env-var');
const { execSync } = require('node:child_process');

module.exports = () => {
  const missingMandatoryEnvKeys = MissingEnvVarError.getMissingMandatoryKeys();
  if (missingMandatoryEnvKeys.length) {
    throw new MissingEnvVarError(missingMandatoryEnvKeys);
  }

  // Must run DB migrations in global setup and not in package.json script
  // to ensure if watch mode is used, the migrations apply on each test rerun,
  // not just the first run (global teardown resets the DB).
  execSync('npx dbmate --env=TEST_DATABASE_URL --no-dump-schema up');
};
