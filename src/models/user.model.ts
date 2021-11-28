const {Schema, model} = require("mongoose");
const {ModelConstants} = require("../utils");

const User = model(
    ModelConstants.USER,
    new Schema({
        username: String,
        email: String,
        password: String,
        numberPhone: String,
        photo: String,
        role: String,
        isActive: Boolean
    }, {versionKey: false})
);

module.exports = User;
export {}
