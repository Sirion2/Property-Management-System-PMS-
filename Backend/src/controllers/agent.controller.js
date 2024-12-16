const db = require("../models");
const Agent = db.agent;

const Op = db.Sequelize.Op;

exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};

exports.listAgentsWithID = (req, res) => {
  Agent.findAll({
    attributes: [
      "id",
      "firstName",
      "lastName",
      "status",
      "email",
      "rol",
      "phoneNumber",
    ],
    where: {
      email: { [Op.ne]: "agente@administrador.com" },
    },
    order: [["firstName", "ASC"]],
  })
    .then((agent) => {
      if (!agent) {
        return res.status(404).send({ message: "Cannot list agents." });
      }

      const formattedAgents = agent.map((agent) => ({
        id: agent.id,
        firstName: agent.firstName,
        lastName: agent.lastName,
        status: agent.status === "0x01" ? "activo" : "inactivo",
        email: agent.email,
        phoneNumber: agent.phoneNumber,
      }));
      res.status(200).send(formattedAgents);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.listAllAgents = (req, res) => {
  Agent.findAll({
    attributes: {
      exclude: ["password"],
    },
    order: [["firstName", "ASC"]],
  })
    .then((agents) => {
      if (!agents) {
        return res.status(404).send({ message: "Cannot list agents." });
      }

      const agentsWithImages = agents.map((agent) => {
        const agentData = agent.toJSON();
        const profileImageBase64 = agent.profileImage
          ? agent.profileImage.toString("base64")
          : null;

        let agentRol = null;
        //'0x1bc', '0x284', '0x308'
        if (agent.rol === "0x1bc") {
          agentRol = "Usuario";
        } else if (agent.rol === "0x284") {
          agentRol = "Moderador";
        } else if (agent.rol === "0x308") {
          agentRol = "Administrador";
        }

        let agentStatus = null;
        //'0x01', '0x02'
        if (agent.status === "0x01") {
          agentStatus = "Activo";
        } else if (agent.status === "0x02") {
          agentStatus = "Inactivo";
        }

        return {
          ...agentData,
          rol: agentRol,
          status: agentStatus,
          profileImage: profileImageBase64,
        };
      });
      res.status(200).send(agentsWithImages);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.listAgentById = (req, res) => {
  const userId = req.body.id;
  Agent.findByPk(userId, {
    attributes: {
      exclude: ["createdBy", "password"]
    },
  })
    .then((agent) => {
      if (!agent) {
        return res.status(404).json({ message: "agent not found" });
      }

      let agentRol = null;
      //'0x1bc', '0x284', '0x308'
      if (agent.rol === "0x1bc") {
        agentRol = "Usuario";
      } else if (agent.rol === "0x284") {
        agentRol = "Moderador";
      } else if (agent.rol === "0x308") {
        agentRol = "Administrador";
      }

      let agentStatus = null;
      //'0x01', '0x02'
      if (agent.status === "0x01") {
        agentStatus = "Activo";
      } else if (agent.status === "0x02") {
        agentStatus = "Inactivo";
      }

      agent.rol = agentRol;
      agent.status = agentStatus;
      res.status(200).json({
        agent
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Error retrieving agent.",
        error: err.message,
      });
    });
};
