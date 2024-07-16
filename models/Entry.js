const Sequelize = require("sequelize");
const db = require("../config/database");

const Entry = db.define("entry", {
  type: {
    type: Sequelize.STRING,
  },
  details: {
    type: Sequelize.STRING,
  },
  supplier: {
    type: Sequelize.STRING,
  },
  amount: {
    type: Sequelize.STRING,
  },
  quantity: {
    type: Sequelize.STRING,
  },
  productLinker: {
    type: Sequelize.STRING,
  },
  patientLinker: {
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
  status: {
    type: Sequelize.STRING,
  },
  instLinker: {
    type: Sequelize.STRING,
  },
  credLinker: {
    type: Sequelize.STRING,
  },
  deleted: {
    type: Sequelize.STRING,
  },
});

Entry.sync().then(() => {
  console.log("entry table created");
});
module.exports = Entry;
