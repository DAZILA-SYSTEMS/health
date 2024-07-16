const Sequelize = require("sequelize");
const db = require("../config/database");

const ServiceCat = db.define("serviceCat", {
  name: {
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

ServiceCat.sync().then(() => {
  console.log("serviceCat table created");
});
module.exports = ServiceCat;
