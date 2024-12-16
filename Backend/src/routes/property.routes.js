const { authJwt } = require("../middleware");
const controller = require("../controllers/property.controller");
const { isModeratorOrAdmin } = require("../middleware/authJwt");
const multer = require("multer");
const upload = multer({

});

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/property/management/create",
    upload.fields([
      { name: "image_1" },
      { name: "image_2" },
      { name: "image_3" },
      { name: "image_4" },
    ]),
    [authJwt.verifyToken, isModeratorOrAdmin],
    controller.createProperty
  );

  app.patch(
    "/api/property/management/update",
    upload.fields([
      { name: "image_1" },
      { name: "image_2" },
      { name: "image_3" },
      { name: "image_4" },
    ]),
    [authJwt.verifyToken, isModeratorOrAdmin],
    controller.updateProperty
  );

  app.patch(
    "/api/property/management/delete",
    [authJwt.verifyToken, isModeratorOrAdmin],
    controller.deleteProperty
  );

  app.get("/api/property/all/", controller.showAllProperty);

  app.post("/api/property/management/edit-all/",[authJwt.verifyToken, isModeratorOrAdmin], controller.showEditAllProperty);


  app.get(
    "/api/property/management/all",
    [authJwt.verifyToken, isModeratorOrAdmin],
    controller.showPropertyManagementAll
  );

  app.get(
    "/api/property/panel/admin/all/",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.showPropertyAdminPanelAll
  );
};
