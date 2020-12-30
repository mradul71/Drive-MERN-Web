import { stringify } from "uuid";

const moongoose = require("mongoose");

const fileSchema = new moongoose.Schema({
    parentFolder: {type: String},
    name: {type: String, required: true},
    path: {type: String, required: true},
    size: {type: Number, required: true},
    uuid: {type: String, required: true},
    downloadURL: {type: String},
    date: {type: String}
});

export default moongoose.model('File', fileSchema);