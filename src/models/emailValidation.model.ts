const {Schema, model} = require("mongoose");
const {ModelConstants} = require("../utils");

const EmailValidation = model(
    ModelConstants.EMAIL_VALIDATION,
    new Schema({
        createdAt: String,
        secretKey: String,
        user: {
            type: Schema.Types.ObjectId,
            ref: ModelConstants.USER
        }
    }, {versionKey: false})
);

module.exports = EmailValidation;
export {}
