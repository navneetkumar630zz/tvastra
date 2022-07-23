// init code
const mongoose = require("mongoose");

// hospital schedma
const hospitalSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true
    },
    description: String,
    specialities: [String],
    nBeds: Number,
    address: String,
    phone: Number,
    picture: String,
    treatments: [String]
}, {
    strict: "throw",
    strictQuery: "throw"
});

// creating model
mongoose.model("hospitals", hospitalSchema);

// export module
module.exports = mongoose.model("hospitals");