// --------------  I M P O R T   S E C T I O N  -----------------------
const express = require("express");
const router = express.Router();
const multer = require("multer");
const validator = require("../controllers/validator");
const loginController = require("../controllers/loginController");
const mainController = require("../controllers/mainController");
const adminController = require("../controllers/adminController");
const middle = require("../controllers/middle");
const path = require("path");

// initializing multer
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, "./client/uploads");
    },
    filename: function(req, file, cb){
        cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    }
});
const fileFilter = function(req, file, cb){
    if(
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg" ||
        file.mimetype === "image/png"
    ){
        cb(null, true);
    }else{
        cb(null, false);
    }
};
const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});

// -------------------  R O U T I N G   S E C T I O N  ------------------
// get requests
router.route("/").get(middle.checkLogin, mainController.home);
router.route("/searchSuggestions").get(mainController.searchSuggestions);
router.route("/doctors").get(middle.checkLogin, mainController.doctors);
router.route("/doctors/:pageNo").get(middle.checkLogin, mainController.doctors);
router.route("/hospitals").get(middle.checkLogin, mainController.hospitals);
router.route("/hospitals/:pageNo").get(middle.checkLogin, mainController.hospitals);
router.route("/login").get(middle.onLogin, mainController.login);
router.route("/signup").get(middle.onLogin, mainController.signup);
router.route("/contactus").get(middle.checkLogin, mainController.contactUs);
router.route("/treatment").get(middle.checkLogin, mainController.treatment);
router.route("/appointment").get(middle.checkLogin, mainController.appointment);
router.route("/aboutus").get(middle.checkLogin, mainController.aboutus);
router.route("/doctorsprofile").get(middle.checkLogin, mainController.doctorsProfile);
router.route("/faq").get(middle.checkLogin, mainController.faq);
router.route("/about-hospital").get(middle.checkLogin, mainController.aboutHospital);
router.route("/submitquery").get(middle.checkLogin, mainController.submitYourQuery);
router.route("/tvastra-plus").get(middle.checkLogin, mainController.tvastraPlus);
// router.route("/loginWithOtp").get(mainController.loginWithOtp); // for development purpose
// router.route("/resetPassword").get(mainController.resetPassword); // for development purpose
router.route("/logout").get(loginController.logout);
router.route("/otpPage").get(mainController.otpPage); // for development purpose
router.route("/profile").get(middle.checkLogin, mainController.profile);
router.route("/myAppointments").get(middle.checkLogin, mainController.myAppointments);
router.route("/medicalReports").get(middle.checkLogin, mainController.medicalReports);
router.route("/settings").get(middle.checkLogin, mainController.settings);
// router.route("/doctorDetails").get(middle.checkLogin, mainController.doctorDetails); // for development purpose
router.route("/schedules").get(middle.checkLogin, mainController.schedules);
router.route("/deleteSchedule").get(middle.checkLogin, mainController.deleteSchedule);
router.route("/disableSchedule").get(middle.checkLogin, mainController.disableSchedule);
router.route("/disableSlot").get(middle.checkLogin, mainController.disableSlot);
router.route("/bookAppointment").get(middle.checkLogin, mainController.bookAppointment);
router.route("/reschedule").get(middle.checkLogin, mainController.reschedule);
router.route("/rescheduleAppointment").get(middle.checkLogin, mainController.rescheduleAppointment);
router.route("/cancelAppointment").get(middle.checkLogin, mainController.deleteAppointment);
router.route("/deleteRecord").get(middle.checkLogin, mainController.deleteRecord);
router.route("/showReport").get(middle.checkLogin, mainController.showReport);
router.route("/deleteReportPic").get(middle.checkLogin, mainController.deleteReportPic);
router.route("/adminDashboard").get(middle.checkLogin, adminController.adminDashboard);
router.route("/adminUsers").get(middle.checkLogin, adminController.adminUsers);
router.route("/adminDoctors").get(middle.checkLogin, adminController.adminDoctors);
router.route("/adminHospitals").get(middle.checkLogin, adminController.adminHospitals);
router.route("/editHospital").get(middle.checkLogin, adminController.editHospital);
router.route("/allAppointments").get(middle.checkLogin, adminController.allAppointments);

// post requests
router.route("/signup").post(validator.signup, loginController.signup);
router.route("/login").post(validator.login, loginController.login);
router.route("/loginWithOtp").post(loginController.loginWithOtp);
router.route("/otpPage").post(loginController.otpPage);
router.route("/forgotPassword").post(loginController.forgotPassword);
router.route("/resetPassword").post(validator.resetPassword, loginController.resetPassword);
router.route("/doctorDetails").post(upload.single("avtar"), loginController.doctorDetails);
router.route("/updateProfile").post(upload.single("avtar"), loginController.updateProfile);
router.route("/changePassword").post(validator.changePassword, loginController.changePassword);
router.route("/changePhoneNo").post(loginController.changePhoneNo);
router.route("/verifyAndChangePhoneNo").post(loginController.verifyAndChangePhoneNo);
router.route("/createSchedule").post(mainController.createSchedule);
router.route("/bookAppointment").post(mainController.bookAppointmentPost);
router.route("/addRecord").post(upload.array("reportPic", 5), mainController.addRecord);
router.route("/addReportPic").post(upload.array("reportPic", 5), mainController.addReportPic);
router.route("/editHospital").post(upload.single("picture"), adminController.editHospitalPost);

// Error page route
router.route("*").get(mainController.pageNotFound);

// --------------------  E X P O R T   S E C T I O N  ------------------------
module.exports = router;