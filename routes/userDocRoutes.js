var express = require("express");
var router = express.Router();

const Doctor = require("../models/docSchema");
const User = require("../models/userSchema");
const Patient = require("../models/patientSchema");
const Appointment = require("../models/appointmentSchema");
////+++////

//Doctor routes
router.get("/userDocSection/doctor/createProfile", function(req, res) {
    res.render("userDocSection/docfiles/profile");
});

router.get("/userDocSection/patientList/", function(req, res) {
    // Patient.find().where(appointment[0].docId).equals(req.user._id).exec(err, foundPatient) {
    //     if (err)
    //         console.log(err);
    //     else
    res.render("userDocSection/docfiles/patientList");

    // }
});

router.get("/userDocSection/patientList/patientInfo/:id", function(req, res) {
    res.render("userDocSection/docfiles/patientInfo");
});

router.get("/userDocSection/reports/:id", function(req, res) {
    res.render("userDocSection/reports");
});

router.post("/sendEmail", (req, res) => {
    const Data = {
        name: req.body.name,
        email: req.body.email,
        subject: req.body.subject,
        text: req.body.text,
    };

    sendMail(
        Data.name,
        Data.email,
        Data.subject,
        Data.text,
        function(err, data) {
            if (err) {
                res.status(500).json({ message: "Internal Error" });
            } else {
                res.redirect("/userDocSection/patientInfo");
                res.status({ message: "Email sent!!!" });
            }
        }
    );
});

router.get("/userDocSection/consultDoc/presc", function(req, res) {
    res.render("userDocSection/docfiles/prescription");
});

// -------------Doctor Profile Post Routes ------------------//

router.post("/userDocSection/createProfile", function(req, res) {
    let newDocPro = {
        speciality: req.body.speciality,
        workingAt: req.body.workingAt,
        workAtHosp: req.body.workAtHosp,
        timing: {
            timingFrom: req.body.timingFrom,
            timingTo: req.body.timingTo,
        },
        qual: req.body.qual,
        experience: req.body.experience,
        handler: {
            id: req.user._id,
            username: req.user.username,
        },
    };

    Doctor.create(newDocPro, function(err, newProfessionalDoc) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/userDocSection/docDashboards");
        }
    });
});

////+++////

//patient routes

//all doctors
router.get("/userDocSection/docList/", function(req, res) {
    Doctor.find(function(err, foundDoctors) {
        if (err)
            console.log(err);
        else {
            // console.log(foundDoctors);
            User.findById(foundDoctors[0].handler.id, function(err, foundUser) {
                if (err)
                    console.log(err)
                else {
                    res.render("userDocSection/patientfiles/docList", { doctors: foundDoctors, user: foundUser });
                }
            });
        }
    });

});
router.get("/userDocSection/docList/docInfo/:id", function(req, res) {
    Doctor.findById(req.params.id, function(err, foundDoctor) {
        if (err)
            console.log(err);
        else {
            console.log(foundDoctor);
            User.findById(foundDoctor.handler.id, function(err, foundUser) {
                if (err)
                    console.log(err);
                else {
                    res.render("userDocSection/patientfiles/appointment", { doctor: foundDoctor, user: foundUser });
                }
            })

        }
    });

});

//my doctor
router.get("/userDocSection/myDoctor", function(req, res) {
    // var Appointment = []
    //   Appointment.find().where(relation.patientId).equals(req.user._id).exec(err, foundAppointment) {
    //       if (err)
    //           console.log(err);
    //       else {
    //           // Doctor.find().where(foundAppointment.docId).equals()
    //           console.log(foundAppointment);
    //       }
    //   }
});

router.get("/userDocSection/changeDoc/:id", function(req, res) {
    res.render("userDocSection/patientfiles/changeDoc");
});

router.get("/userDocSection/searchDoc", function(req, res) {
    res.render("userDocSection/searchDoc");
});

router.get("/userDocSection/prescrip/:id", function(req, res) {
    res.render("userDocSection/patientfiles/prescription");
});

//book appointment button
router.post("/userDocSection/createAppointment/", function(req, res) {
    let newPatient = {
        handler: {
            id: req.user._id,
            username: req.user.username
        },
        //  curDoc: [String], //Currently appointed doctors.
        disease: [{
            relDoc: req.body.docId,
            diseaseName: req.body.disease
        }],
    }
    let newAppointment = {
        relation: {
            docId: req.body.docId,
            patientId: req.user._id
        }
    }
    Patient.create(newPatient, function(err, createdPatient) {
        if (err)
            console.log(err);
        else {
            Appointment.create(newAppointment, function(err, createAppointment) {
                if (err)
                    console.log(err);
                else
                    res.redirect("/userDocSection/patientDashboard");

            });
        }
    });

});

//universal routes
router.get("/userDocSection/appointments/:id", function(req, res) {
    res.render("userDocSection/appointments");
});

module.exports = router;