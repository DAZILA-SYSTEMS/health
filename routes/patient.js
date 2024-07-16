const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const router = express.Router();
const Credential = require("../models/Credential");
const verifySuperAdmin = require("../middleware/verifySuperAdmin");
const verifyStaff = require("../middleware/verifyStaff");
const { Op } = require("sequelize");

//register a patient
router.post("/add", verifyToken, verifyStaff, (req, res) => {
  Credential.create({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    surname: req.body.surname,
    patientReg: req.body.patientReg,
    instLinker: req.body.instLinker,
    credLinker: req.credLinker,
    trace: req.body.trace,
    linker: req.body.linker,
    email: req.body.email,
    contact: req.body.contact,
    guardianName: req.body.guardianName,
    guardianContact: req.body.guardianContact,
    live: 1,
    patient: 1,
    age: req.body.age,
    gender: req.body.gender,
    ward: req.body.ward,
    bed: req.body.bed,
    status: req.body.status,
    deleted: 0,
  })
    .then((credential) => {
      req.io
        .to(req.body.instLinker)
        .emit("message", { ...credential, messageType: "patient" });
      res.json({ cred: credential, status: 201 });
    })
    .catch((err) => res.json({ status: "500", message: "Error has occured" }));
});

//edit a patient
router.post("/edit", verifyToken, verifyStaff, (req, res) => {
  Credential.findOne({
    where: { id: req.body.id, instLinker: req.body.instLinker },
  })
    .then((patient) => {
      if (patient) {
        patient.firstname = req.body.firstname
          ? req.body.firstname
          : patient.firstname;
        patient.lastname = req.body.lastname
          ? req.body.lastname
          : patient.lastname;
        patient.surname = req.body.surname ? req.body.surname : patient.surname;
        patient.patientReg = req.body.patientReg
          ? req.body.patientReg
          : patient.patientReg;
        patient.email = req.body.email ? req.body.email : patient.email;
        patient.contact = req.body.contact ? req.body.contact : patient.contact;
        patient.patient = req.body.patient ? req.body.patient : patient.patient;
        patient.ward = req.body.ward ? req.body.ward : patient.ward;
        patient.bed = req.body.bed ? req.body.bed : patient.bed;
        patient.age = req.body.age ? req.body.age : patient.age;
        patient.gender = req.body.gender ? req.body.gender : patient.gender;
        patient.guardianName = req.body.guardianName
          ? req.body.guardianName
          : patient.guardianName;
        patient.guardianContact = req.body.guardianContact
          ? req.body.guardianContact
          : patient.guardianContact;
        patient.credLinker = req.credLinker;
        patient.trace = req.body.trace ? req.body.trace : patient.trace;
        patient.live = 1;
        patient.status = req.body.status ? req.body.status : patient.status;
        patient.deleted = req.body.deleted ? req.body.deleted : patient.deleted;
        patient.save();
        req.io
          .to(req.body.instLinker)
          .emit("message", { ...patient, messageType: "patient" });
        res.json({ cred: patient, status: 200 });
      } else {
        res.json({ status: 404, message: "patient not found" });
      }
    })
    .catch((err) =>
      res.json({
        status: 500,
        message: "patient couldn't be edited",
      })
    );
});

//get patients
router.post("/get", verifyToken, verifyStaff, (req, res) => {
  Credential.findAll({
    where: {
      instLinker: req.body.instLinker,
      trace: { [Op.gt]: req.body.online },
      /* [Op.or]: [
        {
          patient: 1,
        },
      ],*/
    },
  })
    .then((creds) => {
      res.json({ creds, status: 200 });
    })
    .catch((err) =>
      res.json({
        status: 500,
        message: "Unknown error",
      })
    );
});
module.exports = router;
