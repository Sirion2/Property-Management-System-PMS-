// models/agent.model.js

module.exports = (sequelize, Sequelize) => {
    const Agent = sequelize.define("agents", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      phoneNumber: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      profileImage: {
        type: Sequelize.BLOB,
        allowNull: false,
      },
      rol: {
        type: Sequelize.ENUM("0x1bc", "0x284", "0x308"),
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM("0x01", "0x02"),
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      createdBy: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: true
      },
      updatedBy: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
    }, {schema: 'pmsdb'});
  
    return Agent;
  };
  