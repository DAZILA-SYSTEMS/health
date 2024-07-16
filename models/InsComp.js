const Sequelize = require("sequelize");
const db = require("../config/database");

const InsComp = db.define("insComp", {
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

InsComp.sync().then(() => {
  console.log("insComp table created");
});
module.exports = InsComp;
