const { verifySignUp } = require("../middleware");
const controller = require("../controllers/auth.controller");
const multer = require("multer");
const upload = multer();

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/auth/signup",
    upload.single("profileImage"),
    [
      verifySignUp.checkDuplicateEmail,
    ],
    controller.signup
  );

  app.post("/api/auth/signin", controller.signin);
};
