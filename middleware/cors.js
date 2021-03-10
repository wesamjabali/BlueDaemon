module.exports = (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Authorization, Accept, *"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Expose-Headers", ["Content-Disposition"]);
  // intercepts OPTIONS method
  if ("OPTIONS" === req.method) {
    //respond with 200
    res.status(200).json();
  } else {
    next();
  }
};
