const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const verifyAdmin = require("../middleware/verifyAdmin");
const router = express.Router();
const ServiceCat = require("../models/ServiceCat");
const { Op } = require("sequelize");

router.post("/add", verifyToken, verifyAdmin, (req, res) => {
  //create a serviceCat
  ServiceCat.create({
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
    .then((serviceCat) => {
      req.io
        .to(req.body.instLinker)
        .emit("message", { ...serviceCat, messageType: "serviceCat" });
      res.json({ serviceCat, status: 201 });
    })
    .catch((err) =>
      res.json({
        status: 500,
        message: "ServiceCat couldn't be created",
      })
    );
});

//edit serviceCat
router.post("/edit", verifyToken, verifyAdmin, (req, res) => {
  ServiceCat.findOne({
    where: { id: req.body.id, instLinker: req.body.instLinker },
  })
    .then((serviceCat) => {
      if (serviceCat) {
        serviceCat.name = req.body.name ? req.body.name : serviceCat.name;
        serviceCat.details = req.body.details
          ? req.body.details
          : serviceCat.details;
        serviceCat.credLinker = req.credLinker;
        serviceCat.trace = req.body.trace ? req.body.trace : serviceCat.trace;
        serviceCat.live = 1;
        serviceCat.deleted = req.body.deleted
          ? req.body.deleted
          : serviceCat.deleted;
        serviceCat.save();
        req.io
          .to(req.body.instLinker)
          .emit("message", { ...serviceCat, messageType: "serviceCat" });
        res.json({ serviceCat, status: 200 });
      } else {
        res.json({ status: 404, message: "ServiceCat not found" });
      }
    })
    .catch((err) =>
      res.json({
        status: 500,
        message: "ServiceCat couldn't be edited",
      })
    );
});

//get serviceCats
router.post("/get", verifyToken, (req, res) => {
  ServiceCat.findAll({
    where: {
      instLinker: req.body.instLinker,
      trace: { [Op.gt]: req.body.online },
    },
  })
    .then((serviceCats) => {
      res.json({ serviceCats, status: 200 });
    })
    .catch((err) =>
      res.json({
        status: 500,
        message: "Unknown error",
      })
    );
});

module.exports = router;
