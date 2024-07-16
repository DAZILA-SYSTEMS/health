const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const router = express.Router();
const Appointment = require("../models/Appointment");
const verifyStaff = require("../middleware/verifyStaff");
const { Op } = require("sequelize");

//register a appointment
router.post("/add", verifyToken, verifyStaff, (req, res) => {
  Appointment.create({
    name: req.body.name,
    instLinker: req.body.instLinker,
    date: req.body.date,
    serviceLinker: req.body.serviceLinker,
    details: req.body.details,
    credLinker: req.credLinker,
    trace: req.body.trace,
    linker: req.body.linker,
    email: req.body.email,
    contact: req.body.contact,
    live: 1,
    status: req.body.status,
    deleted: 0,
  })
    .then((credential) => {
      req.io
        .to(req.body.instLinker)
        .emit("message", { ...credential, messageType: "appointment" });
      res.json({ appointment: credential, status: 201 });
    })
    .catch((err) => res.json({ status: "500", message: "Error has occured" }));
});

//edit a appointment
router.post("/edit", verifyToken, verifyStaff, (req, res) => {
  Appointment.findOne({
    where: { id: req.body.id, instLinker: req.body.instLinker },
  })
    .then((appointment) => {
      if (appointment) {
        appointment.name = req.body.name ? req.body.name : appointment.name;
        appointment.date = req.body.date ? req.body.date : appointment.date;
        appointment.serviceLinker = req.body.serviceLinker
          ? req.body.serviceLinker
          : appointment.serviceLinker;
        appointment.details = req.body.details
          ? req.body.details
          : appointment.details;
        appointment.email = req.body.email ? req.body.email : appointment.email;
        appointment.contact = req.body.contact
          ? req.body.contact
          : appointment.contact;
        appointment.credLinker = req.credLinker;
        appointment.trace = req.body.trace ? req.body.trace : appointment.trace;
        appointment.live = 1;
        appointment.status = req.body.status
          ? req.body.status
          : appointment.status;
        appointment.deleted = req.body.deleted
          ? req.body.deleted
          : appointment.deleted;
        appointment.save();
        req.io
          .to(req.body.instLinker)
          .emit("message", { ...appointment, messageType: "appointment" });
        res.json({ appointment: appointment, status: 200 });
      } else {
        res.json({ status: 404, message: "appointment not found" });
      }
    })
    .catch((err) =>
      res.json({
        status: 500,
        message: "appointment couldn't be edited",
      })
    );
});

//get appointments
router.post("/get", verifyToken, verifyStaff, (req, res) => {
  Appointment.findAll({
    where: {
      instLinker: req.body.instLinker,
      trace: { [Op.gt]: req.body.online },
    },
  })
    .then((appointments) => {
      res.json({ appointments, status: 200 });
    })
    .catch((err) =>
      res.json({
        status: 500,
        message: "Unknown error",
      })
    );
});
module.exports = router;
