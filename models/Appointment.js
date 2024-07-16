const Sequelize = require("sequelize");
const db = require("../config/database");

const Appointment = db.define("appointment", {
  name: {
    type: Sequelize.STRING,
  },
  contact: {
    type: Sequelize.STRING,
  },
  email: {
    type: Sequelize.STRING,
  },
  credLinker: {
    type: Sequelize.STRING,
  },
  instLinker: {
    type: Sequelize.STRING,
  },
  date: {
    type: Sequelize.STRING,
  },
  serviceLinker: {
    type: Sequelize.STRING,
  },
  details: {
    type: Sequelize.STRING,
  },
  trace: {
    type: Sequelize.STRING,
  },
  live: {
    type: Sequelize.STRING,
  },
  linker: {
    type: Sequelize.STRING,
  },
  deleted: {
    type: Sequelize.STRING,
  },
  status: {
    type: Sequelize.STRING,
  },
});

Appointment.sync().then(() => {
  console.log("appointment table created");
});
module.exports = Appointment;
