const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const router = express.Router();
const Entry = require("../models/Entry");
const verifyStaff = require("../middleware/verifyStaff");
const { Op } = require("sequelize");

router.post("/add", verifyToken, verifyStaff, (req, res) => {
  //create an entry
  Entry.create({
    type: req.body.type,
    details: req.body.details,
    amount: req.body.amount,
    supplier: req.body.supplier,
    quantity: req.body.quantity,
    productLinker: req.body.productLinker,
    patientLinker: req.body.patientLinker,
    credLinker: req.credLinker,
    instLinker: req.body.instLinker,
    live: 1,
    linker: req.body.linker,
    trace: req.body.trace,
    deleted: req.body.deleted || 0,
    status: 0,
  })
    .then((entry) => {
      req.io
        .to(req.body.instLinker)
        .emit("message", { ...entry, messageType: "entry" });
      res.json({ entry, status: 201 });
    })
    .catch((err) =>
      res.json({
        status: 500,
        message: "Entry couldn't be created",
      })
    );
});

//edit entry
router.post("/edit", verifyToken, verifyStaff, (req, res) => {
  Entry.findOne({
    where: { id: req.body.id, instLinker: req.body.instLinker },
  })
    .then((entry) => {
      if (entry) {
        entry.type = req.body.type ? req.body.type : entry.type;
        entry.details = req.body.details ? req.body.details : entry.details;
        entry.amount = req.body.amount ? req.body.amount : entry.amount;
        entry.supplier = req.body.supplier ? req.body.supplier : entry.supplier;
        entry.quantity = req.body.quantity ? req.body.quantity : entry.quantity;
        entry.productLinker = req.body.productLinker
          ? req.body.productLinker
          : entry.productLinker;
        entry.patientLinker = req.body.patientLinker
          ? req.body.patientLinker
          : entry.patientLinker;
        entry.credLinker = req.credLinker;
        entry.trace = req.body.trace ? req.body.trace : entry.trace;
        entry.live = 1;
        entry.deleted = req.body.deleted ? req.body.deleted : entry.deleted;
        entry.save();
        req.io.to(req.body.instLinker).emit("message", {
          ...entry,
          messageType: "entry",
        });
        res.json({ entry, status: 200 });
      } else {
        res.json({ status: 404, message: "Entry not found" });
      }
    })
    .catch((err) =>
      res.json({
        status: 500,
        message: "Entry couldn't be edited",
      })
    );
});

//get entrys
router.post("/get", verifyToken, verifyStaff, (req, res) => {
  Entry.findAll({
    where: {
      instLinker: req.body.instLinker,
      trace: { [Op.gt]: req.body.online },
    },
  })
    .then((entries) => {
      res.json({ entries, status: 200 });
    })
    .catch((err) =>
      res.json({
        status: 500,
        message: "Unknown error",
      })
    );
});

module.exports = router;
