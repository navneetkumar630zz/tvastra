module.exports = {
    adminDashboard,
    adminUsers,
    adminDoctors,
    adminHospitals,
    editHospital,
    editHospitalPost,
    allAppointments
};

const User = require("../models/user");
const Schedule = require("../models/schedule");
const Appointment = require("../models/appointment");
const Hospital = require("../models/hospital");

async function adminDashboard (req, res){
    try {
        const usersCount = await User.countDocuments({role: "user"});
        const doctorsCount = await User.countDocuments({role: "doctor"});
        const appointments = await Appointment.find().select("patient user").lean();

        return res.status(200).render("adminDashboard", {
            usersCount,
            doctorsCount,
            appointments,
            message: req.flash("msg")
        });
        
    } catch (err) {
        return res.status(500).render("adminUsers", {
            users: [],
            message: "Something went wrong!"
        });
    }
};

function adminUsers (req, res){
    User.find({role: "user"}, (err, users)=>{
        if(err){
            return res.status(500).render("adminUsers", {
                users: [],
                message: "Something went wrong!"
            });
        }
        console.log(users);
        return res.status(200).render("adminUsers", {
            users: users,
            message: req.flash("msg")
        });
    });
};

function adminDoctors (req, res){
    User.find({role: "doctor"}, (err, users)=>{
        if(err){
            return res.status(500).render("adminUsers", {
                doctors: [],
                message: "Something went wrong!"
            });
        }
        return res.status(200).render("adminDoctors", {
            doctors: users,
            message: req.flash("msg")
        });
    });
};

async function adminHospitals (req, res){
    try {
        const doctors = await User.find({role: "doctor"}).select("hospitals").lean();
        const hospitals = await Hospital.find().select("-description -phone").lean();
        return res.status(200).render("adminHospitals", {
            doctors,
            hospitals,
            errorMsg: req.flash("errorMsg"),
            successMsg: req.flash("successMsg")
            
        });
    } catch (error) {
        console.error(error);
        return res.status(500).render("adminHospitals", {
            doctors: [],
            errorMsg: "Something went wrong!",
            successMsg: req.flash("successMsg")
        });
    }
};

function editHospital (req, res){
    if(req.query.hospitalId){
        Hospital.findById(req.query.hospitalId, (err, hospital)=>{
            if(err || !hospital){
                console.error(err);
                req.flash("errorMsg", "Something went wrong!");
                return res.redirect("/adminHospitals");
            };
            hospital.oldName = hospital.name
            return res.status(200).render("editHospital", {
                hospital
            })
        })
    }else
    if(req.query.hospitalName){
        return res.status(200).render("editHospital", {
            hospital: {
                name: req.query.hospitalName,
                oldName: req.query.hospitalName
            }
        });
    }else{
        req.flash("errorMsg", "Information not found");
        return res.redirect("/adminHospitals");
    }
};

async function editHospitalPost(req, res) {
    console.log(req.body);
    if(!req.body.name || !req.body.oldName){
        req.flash("errorMsg", "Name not found");
        return res.redirect("/adminHospitals");
    }
    const query = {name: req.body.name};
    // creating query for only recieved fields
    if(req.body.nBeds) query.nBeds = req.body.nBeds;
    if(req.body.description) query.description = req.body.description;
    if(req.body.address) query.address = req.body.address;
    if(req.body.phone) query.phone = req.body.phone;
    if(req.body.specialities) query.specialities = JSON.parse(req.body.specialities).map(item=> item.value);
    if(req.body.treatments) query.treatments = JSON.parse(req.body.treatments).map(item=> item.value);
    if(req.file) query.picture = req.file.filename;
    console.log(query);

    // checking whether all fields are empty
    if(Object.keys(query).length==1) return res.redirect("/adminHospitals");

    try{
        if(req.query.hospitalId){
            await Hospital.findByIdAndUpdate(req.query.hospitalId, query);
        }else{
            await Hospital.create(query);
        };
        if(req.body.name != req.body.oldName){
            const users = await User.find({ role: "doctor", hospitals: req.body.oldName });
            console.log(users);
            for(i=0;i<users.length;i++){
                console.log(users[i].hospitals.indexOf(req.body.oldName));
                users[i].hospitals.splice(users[i].hospitals.indexOf(req.body.oldName), 1, req.body.name);
                await users[i].save();
            };
            await Schedule.updateMany({ hospital: req.body.oldName }, { hospital: req.body.name });
            await Appointment.updateMany({ hospital: req.body.oldName }, { hospital: req.body.name });
        };

        req.flash("successMsg", "Hospital updated successfully");
        return res.redirect("/adminHospitals");

    } catch (err){
        console.error(err);
        req.flash("errorMsg", "Something went wrong");
        return res.redirect("/adminHospitals");
    };
}

function allAppointments (req, res){
    Appointment.find({doctor: req.query.userId}).select("-slot -dateCreated -doctor").populate("user", "name").exec((err, appointments)=>{
        if(err || !appointments){
            console.error(err);
            req.flash("msg", "Something went wrong!");
            return res.redirect("/adminDoctors");
        };
        if(appointments){
            return res.status(200).render("allAppointments", {
                appointments,
                message: req.flash("msg")
            });
        }
    });
};