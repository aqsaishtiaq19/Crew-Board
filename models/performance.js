const mongoose = require("mongoose");

const performanceSchema = new mongoose.Schema({
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
        required: true
    },

    month: {
        type: String,
        required: true
    },

    score: {
        type: Number,
        required: true
    },

    feedback: {
        type: String
    }
});

module.exports = mongoose.model(
    "Performance",
    performanceSchema
);