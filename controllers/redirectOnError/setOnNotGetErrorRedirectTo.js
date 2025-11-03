// const fallbackRedirect = "/error";

const staticOnNotGetErrorRedirectTo = (url) => (req, res, next) => {
  res.locals.onNotGetErrorRedirectTo = url;
  next();
};

const fromBodyReferrerOnNotGetErrorRedirectTo =
  (safeReferrerRegex) => (req, res, next) => {
    const ref = req.body.referrer;

    // validate referrer from body
    if (ref && safeReferrerRegex.test(ref)) {
      res.locals.onNotGetErrorRedirectTo = ref;
    } else {
      // let it undefined: let it be handled by error middleware with some default route
      // res.locals.onNotGetErrorRedirectTo = fallbackRedirect;
    }

    next();
  };

// note that logout and deleteMessage have not associated get requests. Hence,
// hence the redirectTo url must be obtained.
// It particular, it obtained from referrer field of req.body.
// Hence, recall to include this in the corresponding form

exports.login = staticOnNotGetErrorRedirectTo("/login");
exports.signup = staticOnNotGetErrorRedirectTo("/signup");
exports.logout = fromBodyReferrerOnNotGetErrorRedirectTo(/^\/my-profile$/);

exports.newMessage = staticOnNotGetErrorRedirectTo("/new-message");
exports.deleteMessage =
  fromBodyReferrerOnNotGetErrorRedirectTo(/^\/(my-messages|)$/);

exports.joinTheClub = staticOnNotGetErrorRedirectTo("/join-the-club");
exports.becomeAdmin = staticOnNotGetErrorRedirectTo("/become-admin");
