require('../utils/load-env').load();
const MissingEnvVarError = require('../utils/errors/missing-env-var');
const DatabaseError = require('../utils/errors/database');
const { execSync } = require('node:child_process');

const PENDING_MIGRATIONS_ERROR_CODE = 1;

module.exports = () => {
  const missingMandatoryEnvKeys = MissingEnvVarError.getMissingMandatoryKeys();
  if (missingMandatoryEnvKeys.length) {
    throw new MissingEnvVarError(missingMandatoryEnvKeys);
  }

  const databaseErrorCode = DatabaseError.checkMigrations();
  // no need to throw if pending migrations, automatically applied after this
  if (
    databaseErrorCode &&
    databaseErrorCode !== PENDING_MIGRATIONS_ERROR_CODE
  ) {
    throw new DatabaseError(databaseErrorCode);
  }

  // Must run DB migrations in global setup and not in package.json script
  // to ensure if watch mode is used, the migrations apply on each test rerun,
  // not just the first run (global teardown resets the DB).
  execSync('npx dbmate --env=TEST_DATABASE_URL --no-dump-schema up');
};
