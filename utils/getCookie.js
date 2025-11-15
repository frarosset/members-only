function getCookie(req, name) {
  return req.headers.cookie
    .split("; ")
    .find((row) => row.startsWith(name + "="))
    ?.split("=")[1];
}

module.exports = getCookie;
