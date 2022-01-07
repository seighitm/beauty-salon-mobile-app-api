const {Schema, model, ObjectId} = require("mongoose");
const {ModelConstants} = require("../utils");

const Cart = model(
    "Cart",
    new Schema({
        counter: Number,
        serviceName: String,
        service: {
            type: ObjectId,
            ref: ModelConstants.SERVICE
        },
        user: {
            type: ObjectId,
            ref: "User"
        },
        staffName: String,
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
