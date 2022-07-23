// init code
const mongoose = require("mongoose");

// slot schema
const slotScema = new mongoose.Schema({
    startTime: String,
    endTime: String,
    enable: {
        type: Boolean,
        default: true
    },
    booked: {
        type: Boolean,
        default: false
    },
    bookedBy: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "users"
    },
    appointmentId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "appointments"
    }
});

// schedule schema
const scheduleSchema = new mongoose.Schema({
    createdBy: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "users"
    },
    dateCreated: {
        type: Date,
        default: Date.now()
    },
    day: String,
    hospital: String,
    startTime: String,
    endTime: String,
    interval: Number,
    slots: [ slotScema ],
    enable: {
        type: Boolean,
        default: true
    }
},{
    strict: "throw",
    strictQuery: "throw"
});

// schedule model
mongoose.model("schedules", scheduleSchema);

// module exports
module.exports = mongoose.model("schedules");