// middleware/verifySignUp.js

const db = require("../models");
const Agent = db.agent;

checkDuplicateEmail = (req, res, next) => {
    Agent.findOne({
        where: {
            email: req.body.email
        }
    }).then(email => {
        if (email) {
            res.status(400).send({
                message: "Email already in use."
            });
            return;
        }
        next();
    });
};

const verifySignUp = {
    checkDuplicateEmail: checkDuplicateEmail
}
module.exports = verifySignUp;