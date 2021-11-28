const {Schema, model} = require("mongoose");
const {ModelConstants} = require("../utils");

const Booking = model(
    ModelConstants.BOOKING,
    new Schema({
        createdAt: String,
        dateTime: String,
        status: String,
        price: String,
        serviceDuration: String,
        service: {
            type: Schema.Types.ObjectId,
            ref: ModelConstants.SERVICE
        },
        staff: {
            type: Schema.Types.ObjectId,
            ref: ModelConstants.USER
        },
        client: {
            type: Schema.Types.ObjectId,
            ref: ModelConstants.USER
        }
    }, {versionKey: false})
);

module.exports = Booking;
export {}
