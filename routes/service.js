const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const router = express.Router();
const Service = require("../models/Service");
const verifyAdmin = require("../middleware/verifyAdmin");
const { Op } = require("sequelize");

router.post("/add", verifyToken, verifyAdmin, (req, res) => {
  //create an service
  Service.create({
    name: req.body.name,
    details: req.body.details,
    amount: req.body.amount,
    credLinker: req.credLinker,
    catLinker: req.body.catLinker,
    instLinker: req.body.instLinker,
    live: 1,
    linker: req.body.linker,
    trace: req.body.trace,
    deleted: req.body.deleted || 0,
    status: 0,
  })
    .then((service) => {
      req.io
        .to(req.body.instLinker)
        .emit("message", { ...service, messageType: "service" });
      res.json({ service, status: 201 });
    })
    .catch((err) =>
      res.json({
        status: 500,
        message: "Service couldn't be created",
      })
    );
});

//edit service
router.post("/edit", verifyToken, verifyAdmin, (req, res) => {
  Service.findOne({
    where: { id: req.body.id, instLinker: req.body.instLinker },
  })
    .then((service) => {
      if (service) {
        service.name = req.body.name ? req.body.name : service.name;
        service.details = req.body.details ? req.body.details : service.details;
        service.amount = req.body.amount ? req.body.amount : service.amount;
        service.catLinker = req.body.catLinker
          ? req.body.catLinker
          : service.catLinker;
        service.credLinker = req.credLinker;
        service.trace = req.body.trace ? req.body.trace : service.trace;
        service.live = 1;
        service.deleted = req.body.deleted ? req.body.deleted : service.deleted;
        service.save();
        req.io.to(req.body.instLinker).emit("message", {
          ...service,
          messageType: "service",
        });
        res.json({ service, status: 200 });
      } else {
        res.json({ status: 404, message: "Service not found" });
      }
    })
    .catch((err) =>
      res.json({
        status: 500,
        message: "Service couldn't be edited",
      })
    );
});

//get services
router.post("/get", verifyToken, (req, res) => {
  Service.findAll({
    where: {
      instLinker: req.body.instLinker,
      trace: { [Op.gt]: req.body.online },
    },
  })
    .then((services) => {
      res.json({ services, status: 200 });
    })
    .catch((err) =>
      res.json({
        status: 500,
        message: "Unknown error",
      })
    );
});

module.exports = router;
