// init code
const mongoose = require("mongoose");

// appointment schema
const appointmentSchema = new mongoose.Schema({
    dateCreated: {
        type: Date,
        default: Date.now
    },
    doctor: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "users"
    },
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "users"
    },
    slot: {
        type: mongoose.SchemaTypes.ObjectId,
    },
    patient: {
        name: String,
        mobile: Number,
        email: String
    },
    hospital: String,
    date: Date,
    startTime: String,
    endTime: String,
    status: {
        type: String,
        enum: ["booked", "completed"],
        default: "booked"
    }
},{
    strict: "throw",
    strictQuery: "throw"
});

// creating model
mongoose.model("appointments", appointmentSchema);

// export module
module.exports = mongoose.model("appointments")