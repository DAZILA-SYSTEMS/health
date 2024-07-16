const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const verifyAdmin = require("../middleware/verifyAdmin");
const router = express.Router();
const Inst = require("../models/Inst");

//register an institution
router.post("/register", verifyToken, (req, res) => {
  //create an institution
  Inst.create({
    name: req.body.name,
    motto: req.body.motto,
    userLinker: req.userLinker,
    clientId: req.body.clientId,
    live: 1,
    linker: req.body.linker,
    sub: req.body.sub,
    trace: req.body.linker,
    deleted: 0,
  })
    .then((inst) => {
      res.json({ inst, status: 201 });
    })
    .catch((err) =>
      res.json({ status: 500, message: "Institution couldn't be created", err })
    );
});

//edit institution
router.post("/edit", verifyToken, verifyAdmin, (req, res) => {
  Inst.findOne({ where: { linker: req.body.linker } })
    .then((inst) => {
      if (inst) {
        inst.name = req.body.name ? req.body.name : inst.name;
        inst.motto = req.body.motto ? req.body.motto : inst.motto;
        inst.email = req.body.email ? req.body.email : inst.email;
        inst.contact = req.body.contact ? req.body.contact : inst.contact;
        inst.website = req.body.website ? req.body.website : inst.website;
        inst.vision = req.body.vision ? req.body.vision : inst.vision;
        inst.mission = req.body.mission ? req.body.mission : inst.mission;
        inst.corevalues = req.body.corevalues
          ? req.body.corevalues
          : inst.corevalues;
        inst.trace = req.body.trace ? req.body.trace : inst.trace;
        inst.live = 1;
        inst.save();
        res.json({ inst: inst, status: 200 });
      } else {
        res.json({ status: 404, message: "Institution not found" });
      }
    })
    .catch((err) =>
      res.json({ status: 500, message: "Institution couldn't be edited", err })
    );
});

//get software by software Id
router.post("/get", (req, res) => {
  Inst.findAll({ where: { clientId: req.body.softwareId } })
    .then((insts) => {
      res.json({ insts: insts, status: 200 });
    })
    .catch((err) =>
      res.json({ status: 500, message: "error loading institution", err })
    );
});

module.exports = router;
