const {Schema, model, ObjectId} = require("mongoose");
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
        isActive: Boolean,
        cart: [{
            type: ObjectId,
            ref: "Cart"
        }],
        bookingServices: [{
            type: ObjectId,
            ref: "Cart"
        }]
    }, {versionKey: false}),
);

module.exports = User;
export {}
