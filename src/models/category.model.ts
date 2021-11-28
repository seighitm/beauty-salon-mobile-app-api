const {Schema, model} = require("mongoose");
const {ModelConstants} = require("../utils");

const Category = model(
    ModelConstants.CATEGORY,
    new Schema({
        name: String,
        photo: String,
        services: [{
            type: Schema.Types.ObjectId,
            ref: ModelConstants.SERVICE
        }],
        staffs: [{
            type: Schema.Types.ObjectId,
            ref: ModelConstants.USER
        }]
    }, {versionKey: false})
);

module.exports = Category;
export {}
