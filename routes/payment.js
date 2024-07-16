const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const router = express.Router();
const Payment = require("../models/Payment");
const OnlinePayment = require("../models/OnlinePayment");
const verifyStaff = require("../middleware/verifyStaff");
const { Op } = require("sequelize");

router.post("/add", verifyToken, verifyStaff, (req, res) => {
	//create an payment
	Payment.create({
		name: req.body.name,
		details: req.body.details,
		amount: req.body.amount,
		code: req.body.code,
		mode: req.body.mode,
		credLinker: req.credLinker,
		patientLinker: req.body.patientLinker,
		insLinker: req.body.insLinker,
		instLinker: req.body.instLinker,
		status: req.body.status,
		live: 1,
		linker: req.body.linker,
		trace: req.body.trace,
		deleted: req.body.deleted || 0,
		status: req.body.status,
	})
		.then((payment) => {
			req.io
				.to(req.body.instLinker)
				.emit("message", { ...payment, messageType: "payment" });
			res.json({ payment, status: 201 });
		})
		.catch((err) =>
			res.json({
				status: 500,
				message: "Payment couldn't be created",
			})
		);
});

//edit payment
router.post("/edit", verifyToken, verifyStaff, (req, res) => {
	Payment.findOne({
		where: { id: req.body.id, instLinker: req.body.instLinker },
	})
		.then((payment) => {
			if (payment) {
				payment.name = req.body.name ? req.body.name : payment.name;
				payment.details = req.body.details ? req.body.details : payment.details;
				payment.amount = req.body.amount ? req.body.amount : payment.amount;
				payment.code = req.body.code ? req.body.code : payment.code;
				payment.mode = req.body.mode ? req.body.mode : payment.mode;
				payment.credLinker = req.credLinker;
				payment.insLinker = req.body.insLinker
					? req.body.insLinker
					: payment.insLinker;
				payment.trace = req.body.trace ? req.body.trace : payment.trace;
				payment.live = 1;
				payment.deleted = req.body.deleted ? req.body.deleted : payment.deleted;
				payment.status = req.body.status ? req.body.status : payment.status;
				payment.save();
				req.io
					.to(req.body.instLinker)
					.emit("message", { ...payment, messageType: "payment" });
				res.json({ payment, status: 200 });
			} else {
				res.json({ status: 404, message: "Payment not found" });
			}
		})
		.catch((err) =>
			res.json({
				status: 500,
				message: "Payment couldn't be edited",
			})
		);
});

//get payments
router.post("/get", verifyToken, verifyStaff, (req, res) => {
	Payment.findAll({
		where: {
			instLinker: req.body.instLinker,
			trace: { [Op.gt]: req.body.online },
		},
	})
		.then((payments) => {
			res.json({ payments, status: 200 });
		})
		.catch((err) =>
			res.json({
				status: 500,
				message: "Unknown error",
			})
		);
});

//get mpesa online payments
router.post("/mpesa", verifyToken, verifyStaff, (req, res) => {
	OnlinePayment.findAll({
		where: {
			instLinker: req.body.instLinker,
			trace: { [Op.gt]: req.body.online },
		},
	})
		.then((mpesaPayments) => {
			res.json({ mpesaPayments, status: 200 });
		})
		.catch((err) =>
			res.json({
				status: 500,
				message: "Unknown error",
			})
		);
});

module.exports = router;
