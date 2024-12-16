// controllers/auth.controller.js

const db = require("../models");
const config = require("../config/auth.config");
const Agent = db.agent;

let jwt = require("jsonwebtoken");
let bcrypt = require("bcrypt");

exports.signup = (req, res) => {
  Agent.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10),
    phoneNumber: req.body.phoneNumber,
    profileImage: req.file.buffer,
    rol: req.body.rol,
    status: req.body.status,
    createdAt: new Date(),
    createdBy: req.body.createdBy,
    updatedAt: null,
    updatedBy: null,
  })
    .then((agent) => {
      res.status(201).send({
        message: "Agent created successfully.",
        agent: agent,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Agent creation unsuccessfully.",
        error: err.message,
      });
    });
};

exports.signin = (req, res) => {
  Agent.findOne({
    where: {
      email: req.body.email,
    },
  })
    .then((agent) => {
      if (!agent) {
        return res.status(404).send({ message: "User not found." });
      }

      let passWordIsValid = bcrypt.compareSync(
        req.body.password,
        agent.password
      );
      console.log(bcrypt.hashSync(req.body.password, 10))

      if (!passWordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password,",
        });
      }

      const token = jwt.sign({ id: agent.id }, config.secret, {
        algorithm: "HS256",
        allowInsecureKeySizes: true,
        expiresIn: 86400, //24 HRS
      });
      let authorities = [];
      if (agent.rol) {
        switch (agent.rol) {
          case "0x1bc":
            authorities.push("Usuario");
            break;
          case "0x284":
            authorities.push("Moderador");
            break;
          case "0x308":
            authorities.push("Administrator");
            break;
          default:
            authorities.push("Desconocido");
        }
      }
      const profileImageBase64 = agent.profileImage
      ? agent.profileImage.toString("base64")
      : null;
      res.status(200).send({
        id: agent.id,
        firstName: agent.firstName,
        lastName: agent.lastName,
        email: agent.email,
        roles: authorities,
        accessToken: token,
        profileImage: profileImageBase64,
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};
