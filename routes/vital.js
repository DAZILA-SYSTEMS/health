const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const verifyStaff = require("../middleware/verifyStaff");
const router = express.Router();
const Vital = require("../models/Vital");
const { Op } = require("sequelize");

router.post("/add", verifyToken, verifyStaff, (req, res) => {
  //create a vital
  Vital.create({
    note: req.body.note,
    credLinker: req.credLinker,
    patientLinker: req.body.patientLinker,
    instLinker: req.body.instLinker,
    live: 1,
    linker: req.body.linker,
    trace: req.body.trace,
    deleted: req.body.deleted || 0,
    status: 0,
  })
    .then((vital) => {
      req.io
        .to(req.body.instLinker)
        .emit("message", { ...vital, messageType: "vital" });
      res.json({ vital, status: 201 });
    })
    .catch((err) =>
      res.json({
        status: 500,
        message: "Vital couldn't be created",
      })
    );
});

//edit vital
router.post("/edit", verifyToken, verifyStaff, (req, res) => {
  Vital.findOne({
    where: { id: req.body.id, instLinker: req.body.instLinker },
  })
    .then((vital) => {
      if (vital) {
        vital.note = req.body.note ? req.body.note : vital.note;
        vital.patientLinker = req.body.patientLinker
          ? req.body.patientLinker
          : vital.patientLinker;
        vital.credLinker = req.credLinker;
        vital.trace = req.body.trace ? req.body.trace : vital.trace;
        vital.live = 1;
        vital.deleted = req.body.deleted ? req.body.deleted : vital.deleted;
        vital.save();
        req.io
          .to(req.body.instLinker)
          .emit("message", { ...vital, messageType: "vital" });
        res.json({ vital, status: 200 });
      } else {
        res.json({ status: 404, message: "Vital not found" });
      }
    })
    .catch((err) =>
      res.json({
        status: 500,
        message: "Vital couldn't be edited",
      })
    );
});

//get vitals
router.post("/get", verifyToken, (req, res) => {
  Vital.findAll({
    where: {
      instLinker: req.body.instLinker,
      trace: { [Op.gt]: req.body.online },
    },
  })
    .then((vitals) => {
      res.json({ vitals, status: 200 });
    })
    .catch((err) =>
      res.json({
        status: 500,
        message: "Unknown error",
      })
    );
});

module.exports = router;
