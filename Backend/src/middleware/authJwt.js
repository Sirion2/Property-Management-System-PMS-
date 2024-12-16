// middleware/authJwt.js

const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");
const db = require("../models");
const Agent = db.agent;

verifyToken = (req, res, next) => {
    let token = req.headers["x-access-token"];
  if (!token) {
    return res.status(403).send({
      message: "No token provided.",
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized.",
      });
    }
    req.agentId = decoded.id;
    next();
  });
};

isAdmin = (req, res, next) => {
  Agent.findByPk(req.agentId)
    .then((agent) => {
      if (!agent) {
        return res.status(404).send({ message: "Agent not found" });
      }
      const adminRolValue = "0x308";
      if (agent.rol === adminRolValue) {
        next();
      } else {
        res.status(403).send({ message: "Required Admin role" });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: "Internal Server Error" });
    });
};

isModerator = (req, res, next) => {
  Agent.findByPk(req.agentId)
    .then((agent) => {
      if (!agent) {
        return res.status(404).send({ message: "Agent not found" });
      }
      const modRolValue = "0x284";
      if (agent.rol === modRolValue) {
        next();
      } else {
        res.status(403).send({ message: "Required Mod role" });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: "Internal Server Error" });
    });
};

isUser = (req, res, next) => {
  Agent.findByPk(req.agentId)
    .then((agent) => {
      if (!agent) {
        return res.status(404).send({ message: "Agent not found" });
      }
      const userRolValue = "0x1bc";
      if (agent.rol === userRolValue) {
        next();
      } else {
        res.status(403).send({ message: "Required read role" });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: "Internal Server Error" });
    });
};

isModeratorOrAdmin = (req, res, next) => {
  Agent.findByPk(req.agentId)
    .then((agent) => {
      if (!agent) {
        return res.status(404).send({ message: "Agent not found" });
      }
      const modRolValue = "0x284";
      const adminRolValue = "0x308";
      if (agent.rol === modRolValue) {
        next();
        return;
      }
      if (agent.rol === adminRolValue) {
        next();
        return;
      }
      res.status(403).send({ message: "Required mod or admin role" });
    })
    .catch((err) => {
      res.status(500).send({ message: "Internal Server Error" });
    });
};

const authJwt = {
  verifyToken: verifyToken,
  isAdmin: isAdmin,
  isModerator: isModerator,
  isUser: isUser,
  isModeratorOrAdmin: isModeratorOrAdmin
};

module.exports = authJwt;
