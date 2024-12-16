// config/db.config.js

const {
  DB_HOST: db_host,
  DB_USER: db_user,
  DB_PASSWORD: db_password,
  DB_NAME: db_name,
} = process.env;

module.exports = {
  HOST: db_host,
  USER: db_user,
  PASSWORD: db_password,
  DB: db_name,
  dialect: "postgres",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  retry: {
    max: 5,
    match: [
      /ETIMEDOUT/,
      /ECONNREFUSED/,
      /ECONNRESET/,
      /ENOTFOUND/,
      /EHOSTUNREACH/,
      /EPIPE/,
      /PROTOCOL_CONNECTION_LOST/,
    ], 
    backoffBase: 1000, 
    backoffExponent: 1.5, 
    timeout: 60000,
  },
};
