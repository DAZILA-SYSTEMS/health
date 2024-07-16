const Sequelize = require("sequelize");
const db = require("../config/database");

const Service = db.define("service", {
  name: {
    type: Sequelize.STRING,
  },
  details: {
    type: Sequelize.STRING,
  },
  amount: {
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
  catLinker: {
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

Service.sync().then(() => {
  console.log("service table created");
});
module.exports = Service;
