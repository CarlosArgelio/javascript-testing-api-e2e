const request = require('supertest');
const createApp = require('../src/app');

describe('Test for /users path', () => {

  let app = null;
  let server = null;
  let api = null;

  beforeAll(() => {
    app = createApp();
    server = app.listen(3001);
    api = request(app);
  });

  describe('POST /login', () => {
    test('should return a 401', async () => {
      // Arrange
      const inputData = {
        email: "emailfake@mail.com",
        password: "fakePassword123"
      }
      // Act
      const { statusCode } = await api.post('/api/v1/auth/login').send(inputData);
      // Assert
      expect(statusCode).toEqual(401);
    });

    test('should return a 200', async () => {
      // Arrange
      const inputData = {
        email: "admin@mail.com",
        password: "admin123"
      }
      // Act
      const { statusCode, body } = await api.post('/api/v1/auth/login').send(inputData);
      // Assert
      expect(statusCode).toEqual(200);
      expect(body.access_token).toBeTruthy();
      expect(body.user.email).toEqual(inputData.email);
      expect(body.user.password).toBeUndefined();
    });
  });

  afterAll(() => {
    server.close();
  });
});
