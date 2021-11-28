const {Schema, model} = require("mongoose");
const {ModelConstants} = require("../utils");

const Service = model(
    ModelConstants.SERVICE,
    new Schema({
        name: String,
        description: String,
        price: Number,
        duration: Number // minutes
    }, {versionKey: false})
);

module.exports = Service;
export {}
