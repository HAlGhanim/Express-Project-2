const unauthorized = {
  status: 401,
  message: "You don't have permission to perfom this action.",
};

const notFound = {
  status: 404,
  message: "Can't find it",
};

const alreadyAdded = {
  status: 400,
  message: "Already added to movie",
};

module.exports = {
  unauthorized,
  notFound,
  alreadyAdded,
};
