exports.handleErrors = (error) => {
  const { name, message } = error;
  if (message === "invalid signature") throw new Error("Your token is incorrect and your are not Authenticated for this action");
  if (name === "TokenExpiredError") throw new Error("Your token has expired");

  throw new Error("A most deadly error occurred!");
};
