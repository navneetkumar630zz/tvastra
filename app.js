// -----------  I M P O R T   S E C T I O N  -------------------------
require("dotenv").config();
require("./database");
const express = require("express");
const app = express();
const compression = require("compression");
const cors = require("cors");
const bodyParser = require("body-parser");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const flash = require("connect-flash");
const path = require("path");
const mainRoute = require("./backend/routes/mainRoute");

// ----------------  M I D D L E W A R E   S E T U P  ---------------------------
app.use(cors());
app.use(compression());
app.use(bodyParser.urlencoded({  extended: true }));
app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(express.static(path.resolve(__dirname, "client")));
app.use(cookieParser());
app.use(session({ secret: "TvastraSecretKey", resave: false, saveUninitialized: false }));
app.use(flash());

// -------------------------  S E T  ----------------------------------
app.set("views", path.resolve(__dirname, "client/views"));
app.set("view engine", "ejs");
app.engine("html", require("ejs").renderFile);

// ---------------------  R O U T I N G  ------------------------
app.use((req, res, next)=>{
    res.locals.user = req.session.user;
    res.locals.schedules = req.session.schedules;
    next()
})
app.use("/", mainRoute);

// -----------   S T A R T I N G   S E R V E R  -----------------------
app.set("port", process.env.PORT || 2000);
app.listen(app.get("port"),_=>{
    console.log("Application listening on port : ", app.get("port"));
});

// ---------------  E X P O R T  S E C T I O N  --------------------
module.exports = app;