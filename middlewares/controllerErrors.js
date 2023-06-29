const unauthorized = {
  status: 401,
  message: "You don't have permission to perfom this action.",
};

const notFound = {
  status: 404,
  message: "Can't find it",
};

const imposter = {
  status: 401,
  message: "The id in the body does not match the id of the user",
};

const alreadyExsists = {
  status: 400,
  message: "Already exists",
};

module.exports = {
  unauthorized,
  notFound,
  alreadyExsists,
  imposter
};
