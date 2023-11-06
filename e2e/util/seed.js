const bcrypt = require('bcrypt');

const sequelize = require('./../../src/db/sequelize');
const { models } = sequelize;

const upSeed = async () => {
  try {
    await sequelize.sync({ force: true }); // create tables
    const password = 'admin123';
    const hash = await bcrypt.hash(password, 10);
    await models.User.create({
      email: 'admin@mail.com',
      password: hash,
      role: 'admin'
    });
    await models.Category.bulkCreate([
      {
        name: 'Categoria 1',
        image: 'https://picsum.photos/200/300'
      },
      {
        name: 'Categoria 2',
        image: 'https://picsum.photos/200/300'
      }
    ]);
  } catch (error) {
    console.log('Error ', error);
  }
}

const downSeed = async () => {
  await sequelize.drop();
}

module.exports = { upSeed, downSeed }
