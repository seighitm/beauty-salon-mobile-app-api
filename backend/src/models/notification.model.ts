const {Schema, model} = require("mongoose");

const Notification = model(
    "Notification",
    new Schema({
        dateTime: String,
        message: String,
        client: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        staff: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    }, {versionKey: false})
);

module.exports = Notification;
export {}
