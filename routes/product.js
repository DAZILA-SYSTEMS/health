const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const router = express.Router();
const Product = require("../models/Product");
const verifyStaff = require("../middleware/verifyStaff");
const { Op } = require("sequelize");

router.post("/add", verifyToken, verifyStaff, (req, res) => {
  //create an product
  Product.create({
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
    .then((product) => {
      req.io
        .to(req.body.instLinker)
        .emit("message", { ...product, messageType: "product" });
      res.json({ product, status: 201 });
    })
    .catch((err) =>
      res.json({
        status: 500,
        message: "Product couldn't be created",
      })
    );
});

//edit product
router.post("/edit", verifyToken, verifyStaff, (req, res) => {
  Product.findOne({
    where: { id: req.body.id, instLinker: req.body.instLinker },
  })
    .then((product) => {
      if (product) {
        product.name = req.body.name ? req.body.name : product.name;
        product.details = req.body.details ? req.body.details : product.details;
        product.amount = req.body.amount ? req.body.amount : product.amount;
        product.catLinker = req.body.catLinker
          ? req.body.catLinker
          : product.catLinker;
        product.credLinker = req.credLinker;
        product.trace = req.body.trace ? req.body.trace : product.trace;
        product.live = 1;
        product.deleted = req.body.deleted ? req.body.deleted : product.deleted;
        product.save();
        req.io.to(req.body.instLinker).emit("message", {
          ...product,
          messageType: "product",
        });
        res.json({ product, status: 200 });
      } else {
        res.json({ status: 404, message: "Product not found" });
      }
    })
    .catch((err) =>
      res.json({
        status: 500,
        message: "Product couldn't be edited",
      })
    );
});

//get products
router.post("/get", verifyToken, verifyStaff, (req, res) => {
  Product.findAll({
    where: {
      instLinker: req.body.instLinker,
      trace: { [Op.gt]: req.body.online },
    },
  })
    .then((products) => {
      res.json({ products, status: 200 });
    })
    .catch((err) =>
      res.json({
        status: 500,
        message: "Unknown error",
      })
    );
});

module.exports = router;
