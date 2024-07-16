const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const verifyStaff = require("../middleware/verifyStaff");
const router = express.Router();
const Health = require("../models/Health");
const { Op } = require("sequelize");

router.post("/add", verifyToken, verifyStaff, (req, res) => {
  //create a health
  Health.create({
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
    .then((health) => {
      req.io
        .to(req.body.instLinker)
        .emit("message", { ...health, messageType: "health" });
      res.json({ health, status: 201 });
    })
    .catch((err) =>
      res.json({
        status: 500,
        message: "Health couldn't be created",
      })
    );
});

//edit health
router.post("/edit", verifyToken, verifyStaff, (req, res) => {
  Health.findOne({
    where: { id: req.body.id, instLinker: req.body.instLinker },
  })
    .then((health) => {
      if (health) {
        health.note = req.body.note ? req.body.note : health.note;
        health.patientLinker = req.body.patientLinker
          ? req.body.patientLinker
          : health.patientLinker;
        health.credLinker = req.credLinker;
        health.trace = req.body.trace ? req.body.trace : health.trace;
        health.live = 1;
        health.deleted = req.body.deleted ? req.body.deleted : health.deleted;
        health.save();
        req.io
          .to(req.body.instLinker)
          .emit("message", { ...health, messageType: "health" });
        res.json({ health, status: 200 });
      } else {
        res.json({ status: 404, message: "Health not found" });
      }
    })
    .catch((err) =>
      res.json({
        status: 500,
        message: "Health couldn't be edited",
      })
    );
});

//get healths
router.post("/get", verifyToken, (req, res) => {
  Health.findAll({
    where: {
      instLinker: req.body.instLinker,
      trace: { [Op.gt]: req.body.online },
    },
  })
    .then((healths) => {
      res.json({ healths, status: 200 });
    })
    .catch((err) =>
      res.json({
        status: 500,
        message: "Unknown error",
      })
    );
});

module.exports = router;
