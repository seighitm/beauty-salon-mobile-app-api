const {Schema, model} = require("mongoose");

const Service = model(
    "Service",
    new Schema({
        name: String,
        description: String,
        price: Number,
        duration: Number // minutes
    }, {versionKey: false})
);

module.exports = Service;
export {}
