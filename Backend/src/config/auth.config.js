// config/auth.config.js

const secret_key = process.env.SECRET_KEY;

module.exports = {
    secret: secret_key,
};