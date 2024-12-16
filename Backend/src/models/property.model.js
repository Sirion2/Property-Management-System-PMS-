// models/property.model.js

module.exports = (sequelize, Sequelize) => {
  const Property = sequelize.define("properties", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    location: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    price: {
      type: Sequelize.NUMERIC,
      allowNull: false,
    },
    image_1: {
      type: Sequelize.BLOB,
      allowNull: false,
    },
    image_2: {
      type: Sequelize.BLOB,
      allowNull: false,
    },
    image_3: {
      type: Sequelize.BLOB,
      allowNull: true,
    },
    image_4: {
      type: Sequelize.BLOB,
      allowNull: true,
    },
    assignedTo: {
      type: Sequelize.INTEGER,
      references: {
        model: "agents",
        key: "id",
      },
      allowNull: false,
    },
    publish: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    },
    sold: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    createdBy: {
      type: Sequelize.INTEGER,
      references: {
        model: "agents",
        key: "id"
      },
      allowNull: false,
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    updatedBy: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    deleted: {
      type: Sequelize.BOOLEAN,
      allowNull: true,
    },
  }, {schema: 'pmsdb'});

  return Property;
};
