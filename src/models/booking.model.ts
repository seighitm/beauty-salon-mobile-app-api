const {Schema, model} = require("mongoose");

const Booking = model(
    "Booking",
    new Schema({
        dateTime: String,
        status: String,
        price: String,
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
