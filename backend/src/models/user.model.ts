const {Schema, model} = require("mongoose");

const User = model(
    "User",
    new Schema({
        username: String,
        email: String,
        password: String,
        numberPhone: String,
        photo: String,
        role: String
    }, {versionKey: false})
);

module.exports = User;
export {}
