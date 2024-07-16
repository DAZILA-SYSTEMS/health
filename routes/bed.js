const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const router = express.Router();
const Bed = require("../models/Bed");
const verifyAdmin = require("../middleware/verifyAdmin");
const { Op } = require("sequelize");

router.post("/add", verifyToken, verifyAdmin, (req, res) => {
  //create an bed
  Bed.create({
    bedNo: req.body.bedNo,
    credLinker: req.credLinker,
    wardLinker: req.body.wardLinker,
    instLinker: req.body.instLinker,
    live: 1,
    linker: req.body.linker,
    trace: req.body.trace,
    deleted: req.body.deleted || 0,
    status: 0,
  })
    .then((bed) => {
      req.io
        .to(req.body.instLinker)
        .emit("message", { ...bed, messageType: "bed" });
      res.json({ bed, status: 201 });
    })
    .catch((err) =>
      res.json({
        status: 500,
        message: "Bed couldn't be created",
      })
    );
});

//edit bed
router.post("/edit", verifyToken, verifyAdmin, (req, res) => {
  Bed.findOne({
    where: { id: req.body.id, instLinker: req.body.instLinker },
  })
    .then((bed) => {
      if (bed) {
        bed.bedNo = req.body.bedNo ? req.body.bedNo : bed.bedNo;
        bed.wardLinker = req.body.wardLinker
          ? req.body.wardLinker
          : bed.wardLinker;
        bed.credLinker = req.credLinker;
        bed.trace = req.body.trace ? req.body.trace : bed.trace;
        bed.live = 1;
        bed.deleted = req.body.deleted ? req.body.deleted : bed.deleted;
        bed.save();
        req.io.to(req.body.instLinker).emit("message", {
          ...bed,
          messageType: "bed",
        });
        res.json({ bed, status: 200 });
      } else {
        res.json({ status: 404, message: "Bed not found" });
      }
    })
    .catch((err) =>
      res.json({
        status: 500,
        message: "Bed couldn't be edited",
      })
    );
});

//get beds
router.post("/get", verifyToken, (req, res) => {
  Bed.findAll({
    where: {
      instLinker: req.body.instLinker,
      trace: { [Op.gt]: req.body.online },
    },
  })
    .then((beds) => {
      res.json({ beds, status: 200 });
    })
    .catch((err) =>
      res.json({
        status: 500,
        message: "Unknown error",
      })
    );
});

module.exports = router;
