const sequelize = require('./../../src/db/sequelize');
const { models } = require('./../../src/db/sequelize');

const upSeed = async () => {
  await sequelize.sync({ force: true });
}

const downSeed = () => {

}

module.exports = { upSeed, downSeed }
