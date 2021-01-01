const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const noteModel = new Schema({
    name: {
        type: String,
        required: [true, "Please enter not name."]
    },
    content: {
        type: String,
        required: [true, "Please enter note content."]
    }
}, { timestamps: true })

module.exports = mongoose.model('Notes', noteModel)