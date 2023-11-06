const request = require('supertest');
const createApp = require('../src/app');
const { models } = require('./../src/db/sequelize');
const { upSeed, downSeed } = require('./util/umzug');


describe('Test for /profile path', () => {

  let app = null;
  let server = null;
  let api = null;
  let accessToken = null;

  beforeAll(async () => {
    app = createApp();
    server = app.listen(3001);
    api = request(app);
    await upSeed();
  });

  describe('GET /my-user admin user', () => {

    beforeAll(async () => {
      // Arrange
      const user = await models.User.findByPk('1')
      const inputData = {
        email: user.email,
        password: "admin123"
      }
      // Act
      const { body: bodyLogin } = await api.post('/api/v1/auth/login').send(inputData);
      accessToken = bodyLogin.access_token
    })

    test('should return 401', async () => {
      const { statusCode } = await api.get(`/api/v1/profile/my-user`).set({
        Authorization: `Bearer eyIamBadToken`
      })
      expect(statusCode).toEqual(401);
    });

    test('should return a user with access token valid', async () => {
      const user = await models.User.findByPk('1')
      const { statusCode, body } = await api.get(`/api/v1/profile/my-user`).set({
        Authorization: `Bearer ${accessToken}`
      })
      expect(statusCode).toEqual(200);
      // check DB
      expect(body.email).toBe(user.email);
    });

    afterAll(() => {
      accessToken = null;
    })
  });

  describe('GET /my-order', () => {
    test('should return 401', async () => {
      const { statusCode } = await api.get(`/api/v1/profile/my-order`).set({
        Authorization: `Bearer eyIamBadToken`
      })
      expect(statusCode).toEqual(401);
    });

    test('should return a user with access token valid', async () => {
      // Arrange
      const user = await models.User.findByPk('1')
      const inputData = {
        email: user.email,
        password: "admin123"
      }
      // Act
      const { body: bodyLogin } = await api.post('/api/v1/auth/login').send(inputData);
      const accessToken = bodyLogin.access_token

      const { statusCode, body } = await api.get(`/api/v1/profile/my-user`).set({
        Authorization: `Bearer ${accessToken}`
      })
      expect(statusCode).toEqual(200);
      // check DB
      expect(body.email).toBe(user.email);
    });
  });

  afterAll(async () => {
    server.close();
    await downSeed();
  });
});
