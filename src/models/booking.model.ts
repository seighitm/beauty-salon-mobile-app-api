const {Schema, model} = require("mongoose");

const Booking = model(
    "Booking",
    new Schema({
        createdAt: String,
        dateTime: String,
        status: String,
        price: String,
        serviceDuration: String,
        service: {
            type: Schema.Types.ObjectId,
            ref: 'Service'
        },
        staff: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        client:{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    }, {versionKey: false})
);

module.exports = Booking;
export {}
