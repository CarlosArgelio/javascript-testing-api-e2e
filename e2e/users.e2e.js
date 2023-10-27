const request = require('supertest');
const createApp = require('../src/app');
const { models } = require('./../src/db/sequelize')

describe('Test for /users path', () => {

  let app = null;
  let server = null;
  let api = null;

  beforeAll(() => {
    app = createApp();
    server = app.listen(3001);
    api = request(app);
  });

  describe('GET /users/{id}', () => {
    test('should return a user', async () => {
      const user = await models.User.findByPk('1')
      const { statusCode, body } = await api.get(`/api/v1/users/${user.id}`);
      expect(statusCode).toEqual(200);
      expect(body.id).toEqual(user.id);
      expect(body.email).toBe(user.email)
    });
  });

  describe('POST /users', () => {
    test('should return a 400 bad request with password invalid', async () => {
      // Arrange
      const inputData = {
        email: "test@mail.com",
        password: "----"
      }
      // Act
      const { statusCode, body } = await api.post('/api/v1/users').send(inputData);
      // Assert
      expect(statusCode).toEqual(400);
      expect(body.message).toMatch(/password/);
    });

    test('should return a 400 bad request with email invalid', async () => {
      // Arrange
      const inputData = {
        email: "----",
        password: "IsPasswordValid123"
      }
      // Act
      const { statusCode, body } = await api.post('/api/v1/users').send(inputData);
      // Assert
      expect(statusCode).toEqual(400);
      expect(body.message).toMatch(/email/);
    });

    test('should return a 400 bad request with email and password invalid', async () => {
      // Arrange
      const inputData = {
        email: "----",
        password: "----"
      }
      // Act
      const { statusCode } = await api.post('/api/v1/users').send(inputData);
      // Assert
      expect(statusCode).toEqual(400);
    });

    test('should return a 400 bad request with empty date', async () => {
      // Arrange
      const inputData = {
        email: "",
        password: ""
      }
      // Act
      const { statusCode } = await api.post('/api/v1/users').send(inputData);
      // Assert
      expect(statusCode).toEqual(400);
    });

    test('should return a 400 bad request without inputData', async () => {
      // Arrange
      const inputData = {}
      // Act
      const { statusCode } = await api.post('/api/v1/users').send(inputData);
      // Assert
      expect(statusCode).toEqual(400);
    });

    // test with statusCode response 200
  });

  describe('PUT /users', () => {
    // test for /users
  });

  afterAll(() => {
    server.close();
  });
});
