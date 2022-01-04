const {Schema, model, ObjectId} = require("mongoose");
const {ModelConstants} = require("../utils");

const Cart = model(
    "Cart",
    new Schema({
        counter: Number,
        service: {
            type: ObjectId,
            ref: ModelConstants.SERVICE
        },
        user: {
            type: ObjectId,
            ref: "User"
        },
        staff:{
            type: ObjectId,
            ref: "User"
        },
        price: String,
        dateTime: String,
        createdAt: String,
        status: String,
    }, {versionKey: false}),
);

module.exports = Cart;
export {}
