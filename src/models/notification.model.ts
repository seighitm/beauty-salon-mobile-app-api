const {Schema, model} = require("mongoose");
const {ModelConstants} = require("../utils");

const Notification = model(
    ModelConstants.NOTIFICATION,
    new Schema({
        dateTime: String,
        message: String,
        client: {
            type: Schema.Types.ObjectId,
            ref: ModelConstants.USER
        },
        staff: {
            type: Schema.Types.ObjectId,
            ref: ModelConstants.USER
        }
    }, {versionKey: false})
);

module.exports = Notification;
export {}
