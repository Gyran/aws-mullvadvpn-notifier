const getEnvValue = (key, defaultValue) => {
  const envValue = process.env[key];
  if (envValue) {
    return envValue;
  }

  return defaultValue;
};

const getEnvIntegerValue = (key, defaultValue = 0) => {
  const envValue = Number.parseInt(getEnvValue(key), 10);
  if (Number.isInteger(envValue)) {
    return envValue;
  }

  return defaultValue;
};

module.exports = {
  getEnvValue,
  getEnvIntegerValue,
};
