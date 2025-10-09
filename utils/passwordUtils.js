const bcrypt = require("bcryptjs");

const securePasswordForStorage = async (password) => {
  const hashedPassword = await bcrypt.hash(
    password,
    parseInt(process.env.PASSWORD_SALT_LENGTH)
  );
  return hashedPassword;
};

module.exports = { securePasswordForStorage };
