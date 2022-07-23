// init code
const mongoose = require("mongoose");

// user schema
const userSchema = new mongoose.Schema({
    dateCreated: {
        type: Date,
        default: Date.now()
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },

    gender: String,

    dob: Date,

    mobile: {
        type: Number,
        required: true,
        unique: true
    },

    timezone: String,

    country: String,

    state: String,

    city: String,

    colony: String,

    houseNo: String,

    avtar: String,

    role: {
        type: String,
        enum: ["user", "doctor"],
        default: "user"
    },

    bio: String,

    hospitals: [String],

    achievements: [String],

    experience: Number,

    qualifications: [String],

    awards: [String],

    specializations: [String],

    avgFees: Number
},{
    strict: "throw",
    strictQuery: "throw"
});

// user model
mongoose.model("users", userSchema);

// module exports
module.exports = mongoose.model("users");