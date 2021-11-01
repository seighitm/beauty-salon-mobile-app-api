const {Schema, model} = require("mongoose");

const Category = model(
    "Category",
    new Schema({
        name: String,
        photo: String,
        services: [{
            type: Schema.Types.ObjectId,
            ref: 'Service'
        }],
        staffs: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }]
    }, {versionKey: false})
);

module.exports = Category;
export {}
