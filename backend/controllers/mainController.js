module.exports = {

    // get requests
    pageNotFound,
    home,
    searchSuggestions,
    doctors,
    hospitals,
    login,
    signup,
    contactUs,
    treatment,
    appointment,
    aboutus,
    doctorsProfile,
    faq,
    aboutHospital,
    submitYourQuery,
    tvastraPlus,
    loginWithOtp,
    otpPage,
    resetPassword,
    profile,
    medicalReports,
    showReport,
    myAppointments,
    settings,
    doctorDetails,
    schedules,
    bookAppointment,
    reschedule,

    // post requests and params
    createSchedule,
    deleteSchedule,
    disableSchedule,
    disableSlot,
    bookAppointmentPost,
    rescheduleAppointment,
    deleteAppointment,
    addRecord,
    deleteRecord,
    addReportPic,
    deleteReportPic
};

// importing section

const User = require("../models/user");
const Schedule = require("../models/schedule");
const Appointment = require("../models/appointment");
const MedicalRecord = require("../models/medicalReport");
const Hospital = require("../models/hospital");
const moment = require("moment");

// moment init and function
function getTimeSlots (start, end, interval){
    var startTime = moment(start, "hh:mm A", true);
    var endTime = moment(end, "hh:mm A", true);
    var timeSlots = [];
    if(endTime.isBefore(startTime)){
        endTime.add(1, "day");
    };
    while(startTime <= endTime){
        timeSlots.push(new moment(startTime).format("hh:mm A"));
        startTime.add(interval, "minutes");
    };
    return timeSlots;
}

// ---------- G E T   R E Q U E S T S ---------------
function pageNotFound (req, res){
    return res.status(404).render("notFoundPage");
};

function home (req, res){
    return res.render("index", { message: req.flash("msg") });
};

function searchSuggestions (req, res) {
    const queryStr = new RegExp(req.query.search, "i");
    User.find({
        role: "doctor",
        $or: [
            { name: queryStr},
            { hospitals: queryStr}
        ]
    })
    .select("name hospitals")
    .lean()
    .exec((err, users)=>{
        if(err) throw err;
        return res.status(200).json(users);
    })
}

function doctors (req, res){

    var perPage = 3;
    var pageNo = req.params.pageNo || 1;

    // setting query
    let query = { role: "doctor" };
    if(req.query.city) query.city = req.query.city;
    if(req.query.specializations) query.specializations = req.query.specializations;
    if(req.query.hospitals) query.hospitals = req.query.hospitals;
    if(req.query.experience){
        var expArr = [{ experience: { $gt: req.query.experience }}];
        if(typeof req.query.experience == "object"){
            expArr = [];
            req.query.experience.forEach(e=>{
                expArr.push({ experience: { $gt: e }});
            });
        }
        query.$or = expArr;
    };

    // setting sort value
    var sortValue = req.query.sort || "name";

    // execute doctor query
    User.find(query)
    .sort(sortValue)
    .skip((perPage * pageNo) - perPage)
    .limit(perPage)
    .select("name specializations hospitals qualifications experience state country avtar avgFees")
    .exec((err, user)=>{
        if(err){
            console.error(err);
            return res.status(500);
        }
        if(user){
            Schedule.find((err, schedule)=>{
                if(err){
                    console.error(err);
                    return res.status(500);
                }else{
                    // getting date form day
                    for(i=0;i<schedule.length;i++){
                        var d = schedule[i].day
                        var dayIndex = 0; // for Sunday
                        switch (d) {
                            case "Monday":
                                dayIndex = 1
                                break;
                            case "Tuesday":
                                dayIndex = 2
                                break;
                            case "Wednessday":
                                dayIndex = 3
                                break;
                            case "Thrusday":
                                dayIndex = 4
                                break;
                            case "Friday":
                                dayIndex = 5
                                break;
                            case "Saturday":
                                dayIndex = 6
                                break;
                            default:
                                break;
                        }
                        var date = new Date();
                        var a = dayIndex - date.getDay();
                        if(a<0){
                            a = 7+a;
                        }
                        date.setDate(date.getDate() + a);
                        // setting a date property to schedule
                        schedule[i].date = date;
                    }
                    // find all doctors for aside filters data
                    User.find({ role: "doctor" },"city specializations hospitals experience" ,(err, allDoctors)=>{
                        if(err){
                            console.error(err);
                            req.flash("msg", "Something went wrong! Please reload the page");
                            return res.render("doctor", {
                                message: req.flash("msg"),
                                doctor: user,
                                schedule: schedule,
                                moment: moment,
                                currentPage: pageNo,
                                pagesCount: pageNo,
                                allDoctors: allDoctors
                            });
                        }else
                        {
                            // get the number of all query results for pagination
                            User.countDocuments(query, (err, count)=>{
                                if(err) return res.status(500);
                                return res.render("doctor", {
                                    message: req.flash("msg"),
                                    doctor: user,
                                    schedule: schedule,
                                    moment: moment,
                                    currentPage: pageNo,
                                    pagesCount: Math.ceil(count / perPage),
                                    allDoctors: allDoctors,
                                    filters: req.query,
                                    totalResultCount: count
                                });
                            });
                        };
                    });
                };
            });
        };
    });
};
async function hospitals (req, res){

    var perPage = 3;
    var pageNo = req.params.pageNo || 1;

    try {
        const hospitals = await Hospital.find()
            .skip((perPage * pageNo) - perPage)
            .limit(perPage);
        const count = await Hospital.countDocuments();
        
        return res.render("hospital", {
            hospitals,
            currentPage: pageNo,
            pagesCount: Math.ceil(count / perPage)
        });
        
    } catch (error) {
        console.error(error);
        return res.render("hospital", {
            hospitals: []
        });
    };
};
function login(req, res){
    return res.render("login", { message: req.flash("msg") });
};
function signup(req, res){
    return res.render("signup", { message: req.flash("msg") });
}
function contactUs(req, res){
    return res.render("contactUs");
}
function treatment(req, res){
    return res.render("treatment");
}
function appointment(req, res){
    return res.render("appointment");
}
function aboutus(req, res){
    return res.render("aboutus");
}
function doctorsProfile (req, res){
    User.findById(req.query.doctorId, (err, doctor)=>{
        if(err){
            console.error(err);
            return res.status(500);
        }else{
            return res.render("doctor's-profile", {
                doctor: doctor
            });
        }
    })
}
function faq (req, res){
    return res.render("FAQ");
}
function aboutHospital (req, res){
    return res.render("about-hospital");
}
function submitYourQuery (req, res){
    return res.render("submit-your-query");
}
function tvastraPlus (req, res){
    return res.render("tvastra-plus");
}
function loginWithOtp (req, res){ // get req for development purpose
    return res.render("login-with-otp");
}
function otpPage (req, res){ // get req for development purpose
    return res.render("otpPage", {
        message: req.flash("msg"),
        subject: "forgotPassword",
        requestId: "jgr87grkj"
    });
}
function resetPassword (req, res){
    return res.render("resetPassword");
}
function profile (req, res){
    if(req.session.user.role=="admin" && req.query.userId){
        User.findById(req.query.userId, (err, user)=>{
            if(err || !user){
                console.error(err);
                return res.sendStatus(500)
            };
            return res.render("profile", {
                user,
                isAdmin: true,
                message: req.flash("msg"),
                requestId: null
            });
        });
    }else
    return res.render("profile", {
        message: req.flash("msg"),
        isAdmin: false,
        requestId: null
    });
};

function myAppointments (req, res){
    let query = {user: req.session.user._id};

    if(req.session.user.role=="admin" && req.query.userId) query.user = req.query.userId;

    Appointment.find(query).populate("doctor", "name").exec((err, appointments)=>{
        if(err){
            console.error(err);
            return res.status(500).render("myAppointments", {
                errorMsg: "Something went wrong!",
                successMsg: [],
                appointments: []
            });
        }else
        {
            // checking and updating for completed appointments
            for(var i=0; i<appointments.length; i++){
                console.log("Length of appointments is : " + appointments.length + " - " + i);
                if(appointments[i].status != "completed"){
                    if(new Date(appointments[i].date).getDate() < new Date().getDate()){
                        appointments[i].status = "completed";

                        // updating appointments and slots in background
                        appointments[i].save(er=>console.error(er));
                        console.log("value of i = ",i);
                        Schedule.findOne({
                            slots: {"$elemMatch": {_id: appointments[i].slot}}
                        }, (err, schedule)=>{
                            if(err){
                                console.error(err);
                            }else{
                                console.log(i+" : "+appointments[i])
                                var slot = schedule.slots.id(appointments[i].slot);
                                slot.booked = false;
                                schedule.save(er=>console.error(er));
                            }
                        });

                    }
                }
            }

            return res.render("myAppointments", {
                errorMsg: req.flash("errorMsg"),
                successMsg: req.flash("successMsg"),
                appointments: appointments.sort((a,b)=> a.date-b.date)
            })
        }
    });
};

function medicalReports (req, res){
    const query = {createdBy: req.session.user._id};

    if(req.session.user.role=="admin" && req.query.userId) query.createdBy = req.query.userId;

    MedicalRecord.find(query, (err, records)=>{
        if(err){
            console.error(err);
            return res.status(500).render("medicalReports",{
                errorMsg: "Can't get data",
                successMsg: req.flash("successMsg"),
                records: []
            })
        };
        return res.render("medicalReports",{
            errorMsg: req.flash("errorMsg"),
            successMsg: req.flash("successMsg"),
            records
        });
    });
};

function showReport (req, res){
    MedicalRecord.findById(req.query.id, "photos title", (err, record)=>{
        if(err){
            console.error(err);
            return res.status(500).render("showReport", {
                records: []
            });
        };
        return res.render("showReport", {
            record
        });
    });
};

function settings (req, res){
    return res.render("settings", { message: req.flash("msg") });
};

function doctorDetails (req, res){ // get req for development purpose
    return res.render("doctorDetails", { message: req.flash("msg") });
};

function schedules (req, res){
    Schedule.find({
        createdBy: req.session.user._id
    }, (err, schedules)=>{
        if(err || !schedules){
            console.log(schedules);
            console.log(err);
            return res.render("schedules", {
                schedules: [],
                moment: moment,
                errorMsg: req.flash("errorMsg"),
                successMsg: req.flash("successMsg")
            });
        }else
        {
            return res.render("schedules", {
                schedules: schedules,
                moment: moment,
                errorMsg: req.flash("errorMsg"),
                successMsg: req.flash("successMsg")
            });
        }
    });
};

function bookAppointment (req, res){
    Schedule.findById(req.query.scheduleId, (err, schedule)=>{
        if(err || !schedule){
            console.error(err);
            return res.redirect("/doctors");
        };
        if(schedule){
            User.findById(schedule.createdBy, "avtar name hospitals qualifications", (err, doctor)=>{
                if(err){
                    console.error(err);
                    return res.redirect("/doctors");
                }
                if(doctor){

                    // Validation for self appointment
                    if(doctor._id==req.session.user._id){
                        req.flash("msg", "You can't appoint yourself");
                        return res.redirect("/doctors");
                    };

                    var slot = schedule.slots.id(req.query.slotId);
                    return res.render("bookAppointment", {
                        slot: slot,
                        schedule: {
                            _id: schedule._id,
                            date: new Date(req.query.date),
                            hospital: schedule.hospital,
                        },
                        doctor: doctor
                    });
                }
            })
        }
    });
};

function reschedule (req, res){
    Appointment.findById(req.query.appointmentId).populate("doctor").exec((err, appointment)=>{
        if(err){
            console.error(err);
            req.flash("msg", "Something went wrong!");
            return res.redirect(500, "/doctors");
        }else
        if(appointment){
            Schedule.find({
                createdBy: appointment.doctor._id,
                enable: true
            },
            (err, schedule)=>{
                if(err){
                    console.error(err);
                    req.flash("msg", "Something went wrong!");
                    return res.redirect(500, "/doctors");
                }else
                if(schedule){
                    // getting date form day
                    for(i=0;i<schedule.length;i++){
                        var d = schedule[i].day
                        var dayIndex = 0; // for Sunday
                        switch (d) {
                            case "Monday":
                                dayIndex = 1
                                break;
                            case "Tuesday":
                                dayIndex = 2
                                break;
                            case "Wednessday":
                                dayIndex = 3
                                break;
                            case "Thrusday":
                                dayIndex = 4
                                break;
                            case "Friday":
                                dayIndex = 5
                                break;
                            case "Saturday":
                                dayIndex = 6
                                break;
                            default:
                                break;
                        }
                        var date = new Date();
                        var a = dayIndex - date.getDay();
                        if(a<0){
                            a = 7+a;
                        }
                        date.setDate(date.getDate() + a);
                        // setting a date property to schedule
                        schedule[i].date = date;
                    }
                    return res.render("reschedule", {
                        doctor: appointment.doctor,
                        schedule: schedule,
                        appointment: {
                            _id: appointment._id,
                            date: appointment.date,
                            hospital: appointment.hospital,
                            startTime: appointment.startTime,
                            endTime: appointment.endTime
                        },
                        oldSlotId: req.query.slotId,
                        moment: moment
                    });
                }
            });
        }
    });
};

// ------------------- P O S T   R E Q U E S T S  A N D   P A R A M S --------------------

async function createSchedule (req, res){
    const {day, hospital, startTime, endTime, interval} = req.body;
    
    if(!(day && hospital && startTime && endTime && interval)){
        req.flash("errorMsg", "Please fill all details");
        return res.redirect("/schedules");
    };

    var slots = [];
    const start = getTimeSlots(startTime, endTime, interval);
    for(i=0; i<start.length; i++){
        var end = start[i+1]
        if(!start[i+1]){
            end = endTime;
        }
        slots.push({
            startTime: start[i],
            endTime: end,
        })
    };

    let days = day;
    if(typeof day === "string"){
        days = [day];
    };
    try{
        for( d of days){

            // validation for schedule overlapping
            await Schedule.find({
                createdBy: req.session.user._id,
                day: d
            },async (err, sch)=>{
                if(err){
                    console.error(err);
                    req.flash("errorMsg", "Something went wrong! Please try again");
                    return res.redirect("/schedules");
                }else{
                    if(sch){
                        // checking schedule overlapping
                        for(i=0; i<sch.length; i++){
                            if(moment(startTime,"hh:mm A").isAfter(moment(sch[i].startTime,"hh:mm A")) && moment(startTime,"hh:mm A").isBefore(moment(sch[i].endTime,"hh:mm A")) || moment(endTime,"hh:mm A").isAfter(moment(sch[i].startTime,"hh:mm A")) && moment(endTime,"hh:mm A").isBefore(moment(sch[i].endTime,"hh:mm A"))){
                                req.flash("errorMsg", "Time is overlapping with previous schedule");
                                console.log("Time overlapped!");
                                return res.redirect("/schedules");
                            }
                        }
                    }

                    await Schedule.create({
                        createdBy: req.session.user._id,
                        day: d,
                        hospital: hospital,
                        startTime: startTime,
                        endTime: endTime,
                        interval: interval,
                        slots: slots
                    }, (err, schedule)=>{
                        if(err){
                            console.error(err);
                            req.flash("errorMsg", "Something went wrong, Please try again");
                            return res.redirect("/schedules");
                        };
                    });
                }
            });
        };
    }
    catch(err){
        console.error(err);
        req.flash("errorMsg", "Something went wrong, Please try again");
        return res.redirect("/schedules");
    }
    finally{
        req.flash("successMsg", "Schedule created successfully");
        return res.redirect("/schedules");
    }
};

function deleteSchedule (req, res){
    const id = req.query.id;
    Schedule.findByIdAndDelete(id, (err, schedule)=>{
        if(err){
            console.error(err);
            req.flash("errorMsg", "Error while delting schedule, please try again");
            return res.redirect("/schedules");
        };
        if(schedule){
            req.flash("successMsg", "Schedule deleted successfully");
            return res.redirect("/schedules");
        }
    })
};

function disableSchedule (req, res){
    const id = req.query.id;
    Schedule.findById(id, (err, schedule)=>{
        if(err){
            console.log(err);
            req.flash("errorMsg", "Error, please try again");
            return res.redirect("/schedules");
        };
        if(schedule){
            if(schedule.enable){
                schedule.update({ enable: false }, (err, sch)=>{
                    if(err){
                        console.log(err);
                        req.flash("errorMsg", "Error while disabling schedule, please try again");
                        return res.redirect("/schedules");
                    };
                    if(sch){
                        return res.redirect("/schedules");
                    }
                })
            }else{
                schedule.update({ enable: true }, (err, sch)=>{
                    if(err){
                        console.log(err);
                        req.flash("errorMsg", "Error while enabling schedule, please try again");
                        return res.redirect("/schedules");
                    };
                    if(sch){
                        return res.redirect("/schedules");
                    }
                })
            }
        }
    })
};

function disableSlot (req, res){
    const {scheduleId, slotId} = req.query;
    Schedule.findById(scheduleId, (err, schedule)=>{
        if(err || !schedule){
            console.log(schedule);
            console.error(err);
            req.flash("errorMsg", "Something went wrong, Please try again");
            return res.redirect("/schedules");
        }else
        {
            const slot = schedule.slots.id(slotId);
            if(slot.enable){
                slot.enable = false;
            }else{
                slot.enable = true;
            }
            schedule.save()
            .then(sch=>{
                var result;
                slot.enable? result="enabled": result="disabled";
                return res.status(200).send(result);
            }).catch(err=>{
                console.error(err);
                return res.sendStatus(500);
            });
        };
    });
};

function bookAppointmentPost (req, res){

    // first check if the slot is already booked
    Appointment.find({ slot: req.body.slotId, status: "booked" }, (err, appointments)=>{

        if(err){
            console.error(err);
            req.flash("msg", "Something went wrong! Please try again");
            return res.redirect("/doctors");
        }else

        if(appointments.length>0){
            req.flash("msg", "Slot already booked. Try another");
            return res.redirect("/doctors");
        }

        // if slot is not already booked
        Appointment.create({

            doctor: req.body.doctorId,
            user: req.session.user._id,
            slot: req.body.slotId,
            patient: {
                name: req.body.name,
                mobile: req.body.patientMobile,
                email: req.body.email
            },
            hospital: req.body.hospital,
            date: req.body.date,
            startTime: req.body.startTime,
            endTime: req.body.endTime

        }, (err, appointment)=>{

            if(err){
                console.error(err);
                req.flash("msg", "Error while creating appointment");
                return res.redirect("/doctors");
            }else

            if(appointment){
                console.log(appointment);

                // updating schedule (slot) in background
                Schedule.findById(req.body.scheduleId, (err, schedule)=>{
                    if(err) {
                        return console.error(err);
                    }
                    else {
                        var slot = schedule.slots.id(req.body.slotId);
                        slot.booked = true
                        slot.bookedBy = req.session.user._id
                        slot.appointmentId = appointment._id

                        schedule.save(er=>console.error(er));
                    };
                });

                return res.render("appointmentStatus",
                {
                    message: "Appointment booked successfully",
                    date: req.body.date,
                    time: req.body.startTime,
                    doctor: {
                        avtar: req.body.doctorAvtar,
                        name: req.body.doctorName,
                        hospitals: req.body.doctorHospitals,
                        qualifications: req.body.doctorQualifications
                    },
                    hospital: req.body.hospital,
                    name: req.body.name,
                    mobile: req.body.patientMobile,
                    appointmentId: appointment._id,
                    slotId: req.body.slotId // for rescheduling
                });
            };
        });
    });
};

function rescheduleAppointment (req, res){

    // first update old slot in background
    Schedule.findOne({
        slots: {"$elemMatch": {_id: req.query.oldSlotId}}
    }, (err, schedule)=>{
        if(err || !schedule){
            console.log(schedule);
            console.error(err);
        }else
        {
            var slot = schedule.slots.id(req.query.oldSlotId);
            slot.booked = false;
            slot.bookedBy = null;
            slot.appointmentId = null;
            schedule.save(er=>console.error(er));
        }
    });
    // update new slot in background
    Schedule.findOne({
        $or: [{ slots: {"$elemMatch": {_id: req.query.slotId}}}]
    }, (err, schedule)=>{
        if(err || !schedule){
            console.log(schedule);
            console.error(err);
        }else
        {
            var slot = schedule.slots.id(req.query.slotId);
            slot.booked = true;
            slot.bookedBy = req.session.user._id;
            slot.appointmentId = req.query.appointmentId;
            schedule.save(er=>console.error(er));
        }
    });
    // update appointment
    Appointment.findByIdAndUpdate(req.query.appointmentId,
        {
            slot: req.query.slotId,
            date: req.query.date,
            hospital: req.query.hospital,
            startTime: req.query.time.split("-")[0],
            endTime: req.query.time.split("-")[1],
        },
        (err, appointment)=>{
        if(err || !appointment){
            console.log(appointment);
            console.error(err);
            req.flash("errorMsg", "Appointment not found");
            return res.redirect("/myAppointments");
        }else
        {
            req.flash("successMsg", "Rescheduled appointment successfully");
            return res.redirect("/myAppointments");
        }
    });
};

function deleteAppointment (req, res){

    // delete appointment
    Appointment.findByIdAndDelete(req.query.appointmentId, (err, appointment)=>{
        if(err || !appointment){
            console.log(appointment);
            console.error(err);
            req.flash("errorMsg", "Appointment not found");
            return res.redirect("/myAppointments");
        }else
        {
            // update the slot in background
            Schedule.findOne({
                $or: [{ slots: {"$elemMatch": {_id: appointment.slot}}}]
            }, (err, schedule)=>{
                if(err || !schedule){
                    console.log(schedule);
                    console.error(err);
                }else
                {
                    var slot = schedule.slots.id(appointment.slot);
                    slot.booked = false;
                    slot.bookedBy = null;
                    slot.appointmentId = null;
                    schedule.save(er=>console.error(er));
                }
            });

            req.flash("successMsg", "Appointment canceled successfully");
            return res.redirect("/myAppointments");
        }
    });
};

function addRecord (req, res){
    MedicalRecord.create({
        createdBy: req.session.user._id,
        name: req.body.name,
        title: req.body.title,
        date: req.body.date,
        reportType: req.body.reportType,
        photos: req.files.map(e=>e.filename)
    }, (err, record)=>{
        if(err || !record){
            console.error(record + '\n' + err);
            req.flash("errorMsg", "Something went wrong! Please try again");
            return res.redirect("/medicalReports");
        }else{
            req.flash("successMsg", "Record added successfully");
            return res.redirect("/medicalReports");
        }
    })
};

function deleteRecord (req, res){
    MedicalRecord.findByIdAndDelete(req.query.id, (err, record)=>{
        if(err){
            console.error(err);
            req.flash("errorMsg", "Something went wrong! Please try again");
            return res.status(500).redirect("/medicalReports");
        };
        req.flash("successMsg", "Record deleted successfully");
        return res.redirect("/medicalReports");
    })
};

function addReportPic (req, res) {
    MedicalRecord.findById(req.body.reportId, (err, record)=>{
        if(err || !record){
            console.error(record + "\n" + err);
            return res.redirect("/showReport?id="+req.body.reportId );
        };
        record.photos.push(...req.files.map(e=>e.filename));
        record.save()
        .then(rec=>{
            return res.redirect("/showReport?id="+req.body.reportId )
        })
        .catch(er=>{
            console.error(er);
            return res.redirect("/showReport?id="+req.body.reportId )
        });
    })
};

function deleteReportPic (req, res){
    MedicalRecord.findById(req.query.recordId, (err, record)=>{
        if(err){
            console.error(err);
            return res.status(500).send("Fail");
        };
        var i = record.photos.indexOf(req.query.ind);
        record.photos.splice(i,1);
        record.save()
        .then(rec=>{
            return res.status(200).send("Done");
        })
        .catch(er=>{
            console.error(er);
            return res.status(500).send("Fail");
        })
    })
};