// init code
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const User = require("../models/user");
const otpManager = require("./otpManager");

// exporting functions
module.exports = {
    signup,
    login,
    loginWithOtp,
    forgotPassword,
    otpPage,
    resetPassword,
    logout,
    doctorDetails,
    updateProfile,
    changePassword,
    changePhoneNo,
    verifyAndChangePhoneNo
}

// creating functions
function signup(req, res){
    // check validation errors
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.error(errors);
        req.flash("msg", "Data is invalid");
        return res.redirect("/signup");
    }

    // hash password
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);

    // creating user in database
    User.create({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        gender: req.body.gender,
        dob: req.body.dob,
        mobile: req.body.mobile,
        country: req.body.country,
        state: req.body.state,
        city: req.body.city
    }, function(err, user){
        // check err
        if(err){
            console.error("Error while inserting data in database: " + err);
            req.flash("msg", "Email or mobile already registered")
            return res.redirect("/signup");
        }else{
            req.session.user = user;
            if(req.body.isDoctor){
                return res.render("doctorDetails", { message: req.flash("msg") });
            }
            req.flash("msg", "You have registered successfully");
            return res.redirect("/")
        }
    })
};

function doctorDetails (req, res){

    // check for required fields
    if( !(
        req.body.bio ||
        req.file ||
        req.body.hospitals ||
        req.body.experience ||
        req.body.qualifications ||
        req.body.specializations ||
        req.body.avgFees
    )){
        return res.status(400).render("doctorDetails", { message: "Please fill all required fields" });
    }

    // update the user
    User.findByIdAndUpdate(req.session.user._id, {
        role: "doctor",
        avtar: req.file.filename,
        bio: req.body.bio,
        hospitals: JSON.parse(req.body.hospitals).map(item => item.value),
        achievements: req.body.achievements? JSON.parse(req.body.achievements).map(item => item.value): undefined,
        experience: req.body.experience,
        qualifications: JSON.parse(req.body.qualifications).map(item => item.value),
        awards: req.body.awards? JSON.parse(req.body.awards).map(item => item.value): undefined,
        specializations: JSON.parse(req.body.specializations).map(item => item.value),
        avgFees: req.body.avgFees,
    }, {new: true}, (err, user)=>{
        if(err){
            console.error("Error while inserting data in database: " + err);
            return res.render("doctorDetails", { message: "Something went wrong!" })
        }else{
            req.session.user = user;
            req.flash("msg", "You have registered successfully");
            return res.redirect("/");
        }
    })
};

function login(req, res){

    // check validation errors
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.error(errors);
        req.flash("msg", "Data is invalid");
        return res.redirect("/login");
    }

    // find user in database
    User.findOne({ email: req.body.email }, async (err, user)=>{

        // check error
        if(err){
            console.error(err);
            req.flash("msg", "User not found");
            return res.redirect("/login");
        }

        if(user){
            const matched = await bcrypt.compare(req.body.password, user.password);
            if(matched){
                req.session.user = user;
                req.flash("msg", "Login successfull");
                return user.role=="admin"? res.redirect("/adminDashboard"): res.redirect("/");
            }else{
                req.flash("msg", "Password incorrect");
                return res.redirect("/login");
            }
        }else{
            req.flash("msg", "User not found");
            return res.redirect("/login");
        }
    });
};

function loginWithOtp (req, res){
    if(req.body.mobile){

        // find user in database
        User.findOne({ mobile: req.body.mobile}, function(err, user){
            if(err){
                console.error(err);
                req.flash("msg", "Number is not associated with any user");
                return res.redirect("/loginWithOtp");
            }
            if(user){
                otpManager.send(req.body.mobile)
                .then((requestId)=>{
                    req.session.email = user.email;
                    return res.render("otpPage",
                    {
                        message: req.flash("msg"),
                        subject: "loginWithOtp",
                        requestId: requestId
                    });
                })
                .catch((err)=>{
                    console.error(err);
                    req.flash("msg", "Something went wrong!");
                    return res.redirect("/loginWithOtp");
                });
            }
        });
    }
    else{
        req.flash("msg", "Please enter mobile number")
    }
};

function forgotPassword (req, res){
    if(req.body.email){
        User.findOne({ email: req.body.email }, (err, user)=>{
            if(err){
                console.error(err);
                req.flash("msg", "Email Id is not associated with any user");
                return res.redirect("/login");
            }
            if(user){
                otpManager.send(user.mobile)
                .then((requestId)=>{
                    req.session.email = req.body.email;
                    return res.render("otpPage",
                    {
                        message: req.flash("msg"),
                        subject: "forgotPassword",
                        requestId: requestId
                    });
                })
                .catch((err)=>{
                    console.error(err);
                    req.flash("msg", "Something went wrong");
                    return res.redirect("/login");
                });
            }
        });
    }
    else{
        req.flash("msg", "Plese enter the email");
        res.redirect("/login");
    }
};

function otpPage (req, res){
    const subject = req.body.subject;
    const  requestId = req.body.requestId;
    const otp = req.body.otp;
    console.log(subject);
    
    if(requestId && otp && subject){
        // verify otp
        otpManager.verify(requestId, otp)
        .then((status)=>{
            console.log("Status : ", status);
            console.log(typeof status);
            switch (status) {
                // if matched
                case '0':
                    console.log("Code matched");
                    User.findOne({email: req.session.email}, (err, user)=>{
                        if(err) throw err;
                        req.session.user = user;
                        if(subject=="forgotPassword"){
                        console.log("forgot Password is working");
                        return res.render("resetPassword", { email: user.email });
                        }
                        console.log("login with otp is working");
                        req.flash("msg", "Login Successful");
                        return res.redirect("/");
                    })
                    
                    
                // if not matched
                case '16':
                    return res.render("otpPage", { message: "Code doesn't match", requestId: requestId });
            
                // if aleady verified or id not found
                case '6':
                    return res.render("otpPage", { message: "Request ID aleady verified", requestId: requestId });

                default:
                    return res.render("otpPage", { message: "Something went wrong", requestId: requestId });
            }

        })
        .catch((err)=>{
            console.error(err);
            return res.render("otpPage", { message: "Something went wrong", requestId: requestId });            
        })
    }
    else{
        return res.render("otpPage", { message: "Please enter the OTP", requestId: requestId })
    }
};

function resetPassword (req, res){

    // check validation errors
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.error(errors);
        return res.render("resetPassword", { email: email, message: "Data is invalid" });
    }

    const email = req.body.email;
    const newPassword = req.body.newPassword;
    const confirmPassword = req.body.confirmPassword;

    if(email && newPassword && confirmPassword && newPassword===confirmPassword){
        User.findOneAndUpdate({ email: email }, { password: newPassword }, (err, user)=>{
            if(err){
                console.error(err);
                return res.render("resetPassword", { email: email, message: "User not found" });
            }
            if(user){
                req.flash("msg", "Password changed successfully");
                return res.redirect("/");
            }
        });
    }
    else{
        return res.render("resetPassword", { email: email, message: "Confirm password not matched" });
    };
};

function logout (req, res){
    delete req.session.user;
    req.flash("msg", "Logout successful");
    return res.redirect("/login");
};

async function updateProfile (req, res){
    
    let targetUser = req.session.user;
    if(req.session.user.role=="admin" && req.body.id){
        console.log("I am admin");
        targetUser = await User.findById(req.body.id);
    }
    var filename = targetUser.avtar;
    if(req.file){
        filename = req.file.filename;
    }
    User.findByIdAndUpdate(targetUser._id, {
        name: req.body.name,
        avtar: filename,
        mobile: req.body.mobile,
        email: req.body.email,
        gender: req.body.gender,
        dob: req.body.dob,
        timezone: req.body.timezone,
        houseNo: req.body.houseNo,
        colony: req.body.colony,
        city: req.body.city,
        state: req.body.state,
        country: req.body.country,
    },{ new: true }, async (err, user)=>{
        // check err
        if(err){
            console.error("Error while inserting data in database: " + err);
            req.flash("msg", "Something went wrong");
            return res.redirect("/profile");
        }else{
            if(targetUser.role=="doctor"){
                await user.update({
                    hospitals: JSON.parse(req.body.hospitals).map(item => item.value),
                    qualifications: JSON.parse(req.body.qualifications).map(item => item.value),
                    achievements: JSON.parse(req.body.achievements).map(item => item.value),
                    experience: req.body.experience,
                    specializations: JSON.parse(req.body.specializations).map(item => item.value),
                    awards: JSON.parse(req.body.awards).map(item => item.value),
                    avgFees: req.body.avgFees,
                    bio: req.body.bio,
                });
            }
            req.flash("msg", "Profile updated successfully");
            if(req.session.user.role=="admin" && req.body.id){
                return res.redirect("/profile?userId="+req.query.userId);
            }else{
                req.session.user = user
                return res.redirect("/profile");
            };
        }
    });
};

function changePassword (req, res){

    // check validation errors
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors);
        req.flash("msg", "Data is invalid");
        return res.redirect("/settings");
    }

    const {currentPassword, newPassword} = req.body;
    User.findById(req.session._id, async (err, user)=>{
        if(err){
            req.flash("msg", "User not found");
            return res.redirect("/settings");
        }
        if(user){
            var matched = await bcrypt.compare(currentPassword, user.password);
            if(matched){

                user.update({password: newPassword})
            }else{
                req.flash("msg", "Password incorrect");
                return res.redirect("/settings");
            }
        }
    })
};

function changePhoneNo(req, res) {
    if(req.session.user.mobile==req.body.newNumber){
        req.flash("msg", "This number is already yours")
        return res.redirect("/profile");
    };

    req.session.newNumber = req.body.newNumber;

    otpManager.send(req.body.newNumber)
    .then((requestId)=>{
        return res.render("profile", {
            message: [],
            requestId,
            isAdmin: false
        });
    })
    .catch((err)=>{
        console.error(err);
        req.flash("msg", "Something went wrong!");
        return res.redirect("/profile");
    });
}

function verifyAndChangePhoneNo(req, res) {
    const {requestId, otp} = req.body;
    if(requestId && otp){
        // verify otp
        otpManager.verify(requestId, otp)
        .then((status)=>{
            console.log("Status : ", status);
            console.log(typeof status);
            switch (status) {
                // if matched
                case '0':
                    console.log("Code matched");
                    User.findByIdAndUpdate(req.session.user._id, { mobile: req.session.newNumber }, {new: true}, (err, user)=>{
                        if(err || !user){
                            console.error(err);
                            req.flash("msg", "Something went wrong while updating mobile");
                            return res.redirect("/profile");
                        };
                        delete req.session.newNumber;
                        req.session.user.mobile = user.mobile;
                        req.flash("msg", "Profile updated successfully");
                        return res.redirect("/profile");
                    });
                    break;
                    
                // if not matched
                case '16':
                    return res.render("profile", {
                        message: "Code doesn't matched",
                        requestId,
                        isAdmin: false
                    });
            
                // if aleady verified or id not found
                case '6':
                    return res.render("profile", {
                        message: "Request ID already verified",
                        requestId,
                        isAdmin: false
                    });

                default:
                    return res.render("profile", {
                        message: "Something went wrong or unauthorized",
                        requestId,
                        isAdmin: false
                    });
            }

        })
        .catch((err)=>{
            console.error(err);
            return res.render("profile", {
                message: "Something went wrong",
                requestId,
                isAdmin: false
            });          
        })
    }
    else{
        return res.render("profile", {
            message: "Please enter the OTP",
            requestId,
            isAdmin: false
        });
    }
}