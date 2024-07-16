const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const verifyAdmin = require("../middleware/verifyAdmin");
const router = express.Router();
const InsComp = require("../models/InsComp");
const { Op } = require("sequelize");

router.post("/add", verifyToken, verifyAdmin, (req, res) => {
  //create a insComp
  InsComp.create({
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
    .then((insComp) => {
      req.io
        .to(req.body.instLinker)
        .emit("message", { ...insComp, messageType: "insComp" });
      res.json({ insComp, status: 201 });
    })
    .catch((err) =>
      res.json({
        status: 500,
        message: "InsComp couldn't be created",
      })
    );
});

//edit insComp
router.post("/edit", verifyToken, verifyAdmin, (req, res) => {
  InsComp.findOne({
    where: { id: req.body.id, instLinker: req.body.instLinker },
  })
    .then((insComp) => {
      if (insComp) {
        insComp.name = req.body.name ? req.body.name : insComp.name;
        insComp.details = req.body.details ? req.body.details : insComp.details;
        insComp.credLinker = req.credLinker;
        insComp.trace = req.body.trace ? req.body.trace : insComp.trace;
        insComp.live = 1;
        insComp.deleted = req.body.deleted ? req.body.deleted : insComp.deleted;
        insComp.save();

        req.io
          .to(req.body.instLinker)
          .emit("message", { ...insComp, messageType: "insComp" });
        res.json({ insComp, status: 200 });
      } else {
        res.json({ status: 404, message: "InsComp not found" });
      }
    })
    .catch((err) =>
      res.json({
        status: 500,
        message: "InsComp couldn't be edited",
      })
    );
});

//get insComps
router.post("/get", verifyToken, (req, res) => {
  InsComp.findAll({
    where: {
      instLinker: req.body.instLinker,
      trace: { [Op.gt]: req.body.online },
    },
  })
    .then((insComps) => {
      res.json({ insComps, status: 200 });
    })
    .catch((err) =>
      res.json({
        status: 500,
        message: "Unknown error",
      })
    );
});

module.exports = router;
