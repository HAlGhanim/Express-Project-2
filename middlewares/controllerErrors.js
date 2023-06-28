const unauthorized = {
  status: 401,
  message: "You don't have permission to perfom this action.",
};

const notFound = {
  status: 404,
  message: "Can't find it",
};

const alreadyExsists = {
  status: 400,
  message: "Already exists",
};

module.exports = {
  unauthorized,
  notFound,
  alreadyExsists,
};
