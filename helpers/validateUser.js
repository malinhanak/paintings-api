const bcrypt = require("bcryptjs");

exports.validateUser = async (user, argsPassword) => {
  if (!user) throw new Error("Invalid Login");

  const passwordMatch = await bcrypt.compare(argsPassword, user.password);
  if (!passwordMatch) throw new Error("Invalid Password");
};
