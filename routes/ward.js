const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const verifyAdmin = require("../middleware/verifyAdmin");
const router = express.Router();
const Ward = require("../models/Ward");
const { Op } = require("sequelize");

router.post("/add", verifyToken, verifyAdmin, (req, res) => {
  //create a ward
  Ward.create({
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
    .then((ward) => {
      req.io
        .to(req.body.instLinker)
        .emit("message", { ...ward, messageType: "ward" });
      res.json({ ward, status: 201 });
    })
    .catch((err) =>
      res.json({
        status: 500,
        message: "Ward couldn't be created",
      })
    );
});

//edit ward
router.post("/edit", verifyToken, verifyAdmin, (req, res) => {
  Ward.findOne({
    where: { id: req.body.id, instLinker: req.body.instLinker },
  })
    .then((ward) => {
      if (ward) {
        ward.name = req.body.name ? req.body.name : ward.name;
        ward.details = req.body.details ? req.body.details : ward.details;
        ward.credLinker = req.credLinker;
        ward.trace = req.body.trace ? req.body.trace : ward.trace;
        ward.live = 1;
        ward.deleted = req.body.deleted ? req.body.deleted : ward.deleted;
        ward.save();
        req.io
          .to(req.body.instLinker)
          .emit("message", { ...ward, messageType: "ward" });
        res.json({ ward, status: 200 });
      } else {
        res.json({ status: 404, message: "Ward not found" });
      }
    })
    .catch((err) =>
      res.json({
        status: 500,
        message: "Ward couldn't be edited",
      })
    );
});

//get wards
router.post("/get", verifyToken, (req, res) => {
  Ward.findAll({
    where: {
      instLinker: req.body.instLinker,
      trace: { [Op.gt]: req.body.online },
    },
  })
    .then((wards) => {
      res.json({ wards, status: 200 });
    })
    .catch((err) =>
      res.json({
        status: 500,
        message: "Unknown error",
      })
    );
});

module.exports = router;
