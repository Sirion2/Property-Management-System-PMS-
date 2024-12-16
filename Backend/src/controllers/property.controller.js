const db = require("../models");
const Property = db.property;
const Agent = db.agent;

const Op = db.Sequelize.Op;

exports.createProperty = (req, res) => {
  const images = [];

  for (let i = 1; i <= 4; i++) {
    const imageFiles = req.files[`image_${i}`];
    if (imageFiles && imageFiles.length > 0) {
      imageFiles.forEach((file) => {
        images.push(file.buffer);
      });
    } else {
      images.push(null);
    }
  }
  Property.create({
    name: req.body.name,
    description: req.body.description,
    location: req.body.location,
    price: req.body.price,
    image_1: images[0],
    image_2: images[1],
    image_3: images[2] || null,
    image_4: images[3] || null,
    assignedTo: req.body.assignedAgentId,
    publish: req.body.publish || false,
    sold: false,
    createdAt: new Date(),
    createdBy: req.body.createdBy,
    updatedAt: null,
    updatedBy: null,
    deleted: false,
  })
  .then((property) => {
      res.status(201).send({
        message: "Property created successfully.",
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: `Property creation unsuccessfully. Error:${err}`,
        error: err.message,
      });
    });
};

exports.updateProperty = (req, res) => {
  const propertyId = parseInt(req.body.id);
  const images = [];
  for (let i = 1; i <= 4; i++) {
    const imageFiles = req.files[`image_${i}`];
    if (imageFiles && imageFiles.length > 0) {
      imageFiles.forEach((file) => {
        images.push(file.buffer);
      });
    } else {
      images.push(null);
    }
  }

  Property.findByPk(propertyId)
    .then((property) => {
      if (!property) {
        return res.status(404).send({
          message: "property not found.",
        });
      }
      Property.update(
        {
          name: req.body.name || property.name,
          description: req.body.description || property.description,
          location: req.body.location || property.location,
          price: req.body.price || property.price,
          image_1: images[0] !== property.image_1 ? images[0] : property.image_1,
          image_2: images[1] !== property.image_2 ? images[1] : property.image_2,
          image_3: images[2] || null,
          image_4: images[3] || null,
          assignedTo: req.body.assignedAgentId || property.assignedTo,
          publish: req.body.publish || property.publish,
          sold: req.body.sold ||  property.sold,
          updatedAt: new Date(),
          updatedBy: req.body.updatedBy || null,
          deleted: req.body.deleted || property.deleted,
        },
        {
          where: { id: propertyId },
        }
      )
        .then(() => {
          res.status(200).send({
            message: "Property updated successfully",
          });
        })
        .catch((err) => {
          res.status(500).send({
            message: "Error updating property",
          });
        });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving property.",
        error: err.message,
      });
    });
};

exports.deleteProperty = (req, res) => {
  const propertyId = parseInt(req.body.id);

  Property.findByPk(propertyId).then((property) => {
    if (!property) {
      return res.status(404).send({
        message: "property not found.",
      });
    }
    Property.update(
      {
        publish: false,
        updatedAt: new Date(),
        updatedBy: req.body.updatedBy || null,
        deleted: true,
      },
      {
        where: { id: propertyId },
      }
    )
      .then(() => {
        res.status(200).send({
          message: "Property deleted succesfully",
        });
      })
      .catch((err) => {
        res.send.status(500).send({
          message: "Error retrieving property",
          error: err.message,
        });
      });
  });
};

exports.showAllProperty = (req, res) => {
  Property.findAll({
    attributes: {
      exclude: [
        "deleted",
        "updatedBy",
        "updatedAt",
        "createdBy",
        "publish",
        "assignedTo",
      ],
    },
    where: { publish: true, deleted: { [Op.or]: [false, null] } },
    include: [
      {
        model: Agent,
        as: "agentAssigned", 
        attributes: [
          "firstName",
          "lastName",
          "email",
          "phoneNumber",
          "profileImage",
        ],
      },
    ],
  })
    .then((properties) => {
      const propertiesWithImages = properties.map((property) => {
        const propertyData = property.toJSON();
        const images = ["image_1", "image_2", "image_3", "image_4"].map(
          (imageField) => {
            return propertyData[imageField]
              ? propertyData[imageField].toString("base64")
              : null;
          }
        );
        const profileImageBase64 = property.agentAssigned.profileImage
          ? property.agentAssigned.profileImage.toString("base64")
          : null;
        return {
          ...propertyData,
          image_1: images[0],
          image_2: images[1],
          image_3: images[2],
          image_4: images[3],
          agentAssigned: { ...propertyData.agentAssigned, profileImage: profileImageBase64 },
        };
      });
      res.status(200).send(propertiesWithImages);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving properties.",
        error: err.message,
      });
    });
};


exports.showEditAllProperty = (req, res) => {
  const propertyId = req.body.id;
  Property.findByPk(propertyId, {
    attributes: {
      exclude: ["createdBy"],
    },
    include: [
      {
        model: Agent,
        as: "agentAssigned", 
        attributes: ["firstName", "lastName", "email", "phoneNumber"],
      },
      {
        model: Agent,
        as: "latestEditor", 
        attributes: ['firstName', 'lastName'],
      },
    ],
  })
    .then((property) => {
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
      res.status(200).json({
        property
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Error retrieving property.",
        error: err.message,
      });
    });
};

exports.showPropertyManagementAll = (req, res) => {
    Property.findAll({
      attributes: {
        exclude: [
          "deleted",
          "updatedBy",
          "updatedAt",
          "createdBy",
          "publish",
          "assignedTo",
        ],
      },
      where: { publish: { [Op.or]: [true, false] }, deleted: { [Op.or]: [false, null] } },
      include: [
        {
          model: Agent,
          as: "agentAssigned", 
          attributes: [
            "firstName",
            "lastName",
            "email",
            "phoneNumber",
            "profileImage",
          ],
        },
      ],
    })
      .then((properties) => {
        const propertiesWithImages = properties.map((property) => {
          const propertyData = property.toJSON();
          const images = ["image_1", "image_2", "image_3", "image_4"].map(
            (imageField) => {
              return propertyData[imageField]
                ? propertyData[imageField].toString("base64")
                : null;
            }
          );
          const profileImageBase64 = property.agentAssigned.profileImage
            ? property.agentAssigned.profileImage.toString("base64")
            : null;
          return {
            ...propertyData,
            image_1: images[0],
            image_2: images[1],
            image_3: images[2],
            image_4: images[3],
            agentAssigned: { ...propertyData.agentAssigned, profileImage: profileImageBase64 },
          };
        });
        res.status(200).send(propertiesWithImages);
      })
      .catch((err) => {
        console.log(err)
        res.status(500).send({
          message: "Error retrieving properties.",
          error: err.message,
        });
      });
};

exports.showPropertyAdminPanelAll = (req, res) => {
  Property.findAll()
    .then((properties) => {
      res.status(200).send(properties);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving properties.",
        error: err.message,
      });
    });
};
