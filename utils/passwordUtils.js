const bcrypt = require("bcryptjs");

const securePasswordForStorage = async (password) => {
  const hashedPassword = await bcrypt.hash(
    password,
    parseInt(process.env.PASSWORD_SALT_LENGTH)
  );
  return hashedPassword;
};

const checkPassword = async (password, storedSecuredPassword) => {
  const match = await bcrypt.compare(password, storedSecuredPassword);
  return match;
};

module.exports = { securePasswordForStorage, checkPassword };
