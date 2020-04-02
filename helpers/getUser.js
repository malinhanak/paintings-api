const { handleErrors } = require("./handleErrors");

exports.getUser = (auth) => {
  if (auth.error) return handleErrors(auth.error);
  if (!auth.user) throw new Error("Your are not authenticated");
};
