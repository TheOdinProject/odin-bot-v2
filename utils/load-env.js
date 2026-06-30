exports.load = () => {
  try {
    process.loadEnvFile();
  } catch (error) {
    // Don't throw if .env doesn't exist
    // CI test won't have a .env file (sets TEST_DATABASE_URL via config)
    // and local testing will throw in the mandatory env var key check
    if (error.code !== 'ENOENT') {
      throw error;
    }
  }
};
