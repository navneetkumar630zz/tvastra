// ----------  I M P O R T   S E C T I O N  ---------------
const mongoose = require("mongoose");
const assert = require("assert");
const db_url = process.env.DB_URL;

// connecting to database -----
mongoose.connect(db_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}, function(err, data){
    // checking error
    assert.equal(err, null, "DB Connection fail... :"+err);

    // Ok
    console.log("Database is connected");
})