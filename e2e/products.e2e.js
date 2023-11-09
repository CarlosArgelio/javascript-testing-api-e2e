const request = require('supertest');
const createApp = require('../src/app');
const { models } = require('./../src/db/sequelize');
const { upSeed, downSeed } = require('./util/umzug');

describe('Test for /products path', () => {

  let app = null;
  let server = null;
  let api = null;

  beforeAll(async () => {
    app = createApp();
    server = app.listen(3001);
    api = request(app);
    await upSeed();
  });

  describe('GET /products', () => {
    test('should return a user', async () => {
      const { statusCode, body } = await api.get(`/api/v1/products`);
      expect(statusCode).toEqual(200);
      const products = await models.Product.findAll();
      expect(body.length).toEqual(products.length);
      expect(body[0].category).toBeTruthy();
    });
  });


  afterAll(async () => {
    downSeed();
    server.close();
  });
});
