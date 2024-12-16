const { authJwt } = require("../middleware");
const controller = require("../controllers/agent.controller");
const { isModeratorOrAdmin, isAdmin } = require("../middleware/authJwt");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/test/all", controller.allAccess);

  app.get("/api/test/user", [authJwt.verifyToken], controller.userBoard);

  app.get(
    "/api/test/mod",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.moderatorBoard
  );

  app.get(
    "/api/agent/Management/listAgentsWithID",
    [authJwt.verifyToken, isModeratorOrAdmin],
    controller.listAgentsWithID 
  );

  app.get(
    "/api/agent/Management/all",
    [authJwt.verifyToken, isAdmin],
    controller.listAllAgents 
  ); 

  app.post(
    "/api/agent/Management/listAgentById",
    [authJwt.verifyToken, isAdmin],
    controller.listAgentById 
  );  
};

