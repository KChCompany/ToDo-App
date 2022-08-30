const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taskSchema = new Schema({
    text: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    completed: {
        type: Boolean,
        default: false,
    },
    changed: {
        type: Boolean,
        default: false,
    }
});

module.exports = mongoose.model("task", taskSchema);
