const mongoose = require("mongoose");

const medicalReportScema = new mongoose.Schema({
    createdBy: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "users"
    },
    title: String,
    name: String,
    date: Date,
    reportType: String,
    photos: [String]
},{
    strict: "throw",
    strictQuery: "throw",
});

mongoose.model("medicalReports", medicalReportScema);

module.exports = mongoose.model("medicalReports");