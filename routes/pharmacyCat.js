const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const router = express.Router();
const PharmacyCat = require("../models/PharmacyCat");
const verifyStaff = require("../middleware/verifyStaff");
const { Op } = require("sequelize");

router.post("/add", verifyToken, verifyStaff, (req, res) => {
  //create a pharmacyCat
  PharmacyCat.create({
    name: req.body.name,
    details: req.body.details,
    credLinker: req.credLinker,
    instLinker: req.body.instLinker,
    live: 1,
    linker: req.body.linker,
    trace: req.body.trace,
    deleted: req.body.deleted || 0,
    status: 0,
  })
    .then((pharmacyCat) => {
      req.io
        .to(req.body.instLinker)
        .emit("message", { ...pharmacyCat, messageType: "pharmacyCat" });
      res.json({ pharmacyCat, status: 201 });
    })
    .catch((err) =>
      res.json({
        status: 500,
        message: "PharmacyCat couldn't be created",
      })
    );
});

//edit pharmacyCat
router.post("/edit", verifyToken, verifyStaff, (req, res) => {
  PharmacyCat.findOne({
    where: { id: req.body.id, instLinker: req.body.instLinker },
  })
    .then((pharmacyCat) => {
      if (pharmacyCat) {
        pharmacyCat.name = req.body.name ? req.body.name : pharmacyCat.name;
        pharmacyCat.details = req.body.details
          ? req.body.details
          : pharmacyCat.details;
        pharmacyCat.credLinker = req.credLinker;
        pharmacyCat.trace = req.body.trace ? req.body.trace : pharmacyCat.trace;
        pharmacyCat.live = 1;
        pharmacyCat.deleted = req.body.deleted
          ? req.body.deleted
          : pharmacyCat.deleted;
        pharmacyCat.save();
        req.io
          .to(req.body.instLinker)
          .emit("message", { ...pharmacyCat, messageType: "pharmacyCat" });
        res.json({ pharmacyCat, status: 200 });
      } else {
        res.json({ status: 404, message: "PharmacyCat not found" });
      }
    })
    .catch((err) =>
      res.json({
        status: 500,
        message: "PharmacyCat couldn't be edited",
      })
    );
});

//get pharmacyCats
router.post("/get", verifyToken, verifyStaff, (req, res) => {
  PharmacyCat.findAll({
    where: {
      instLinker: req.body.instLinker,
      trace: { [Op.gt]: req.body.online },
    },
  })
    .then((pharmacyCats) => {
      res.json({ pharmacyCats, status: 200 });
    })
    .catch((err) =>
      res.json({
        status: 500,
        message: "Unknown error",
      })
    );
});

module.exports = router;
