const mongoose = require("mongoose");

const folderSchema = new mongoose.Schema({
    name: {type: String, required: true},
    parentFolder: {type: mongoose.Schema.Types.ObjectId, ref: 'Folder'}
})
const folderModel = mongoose.model('Folder', folderSchema);
export default folderModel;