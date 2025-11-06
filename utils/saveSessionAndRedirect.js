// In express-session, it is necessary to call session.save(callback) when setting data on the
// session and redirecting. Using the following ensures that data (including flash data) are
// available on the redirected page.
// Source: https://expressjs.com/en/resources/middleware/session.html#sessionsavecallback
const saveSessionAndRedirect = (req, res, target) => {
  req.session.save((err) => {
    if (err) return next(err);
    res.redirect(303, target);
  });
};

module.exports = saveSessionAndRedirect;
