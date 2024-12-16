// models/index.js

const config = require("../config/db.config");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: config.dialect,
  pool: {
    max: config.pool.max,
    min: config.pool.min,
    acquire: config.pool.acquire,
    idle: config.pool.idle,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.agent = require("../models/agent.model") (sequelize, Sequelize);
db.property = require("../models/property.model") (sequelize, Sequelize);

// db.property.belongsTo(db.agent, { foreignKey: 'assignedTo' });  // Relación entre propiedades y agentes
// db.agent.hasMany(db.property, { foreignKey: 'assignedTo' });    // Un agente tiene muchas propiedades


db.property.belongsTo(db.agent, { 
  foreignKey: 'assignedTo', 
  as: 'agentAssigned' // Alias for clarity
});  

db.agent.hasMany(db.property, { 
  foreignKey: 'assignedTo', 
  as: 'assignedProperties' // Alias for clarity
});

// Relación updatedBy
db.property.belongsTo(db.agent, { foreignKey: 'updatedBy', as: 'latestEditor' }); // un apropiedad tiene un agente
db.agent.hasMany(db.property, { foreignKey: 'updatedBy', as: 'updatedProperties' }); // un agente tiene muchas propiedades

module.exports = db;