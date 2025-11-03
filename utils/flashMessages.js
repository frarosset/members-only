function setFlashMessage(req, name, data) {
  if (!req.session.flashMessages) {
    req.session.flashMessages = {};
  }

  if (req.session.flashMessages[name] != null) {
    throw new Error(`Flash message '${name}' has already been set.`);
  }

  req.session.flashMessages[name] = data;
}

function useFlashMessages(req, res, next) {
  res.locals.flashMessages = req.session?.flashMessages;
  delete req.session.flashMessages;
  next();
}

function getFlashMessage(res, name) {
  return res.locals.flashMessages?.[name];
}

module.exports = {
  setFlashMessage,
  useFlashMessages,
  getFlashMessage,
};
