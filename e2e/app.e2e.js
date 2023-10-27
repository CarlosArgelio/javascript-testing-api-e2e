const request = require('supertest');
const createApp = require('../src/app');
const { config } = require('../src/config/config');

describe('Test for app', () => {

  let app = null;
  let server = null;
  let api = null;

  beforeAll(() => {
    app = createApp();
    server = app.listen(3001);
    api = request(app);
  });

  test('GET /hello', async () => {
    const response = await api.get('/hello');
    console.log(response.text);
    expect(response).toBeTruthy();
    expect(response.statusCode).toEqual(200);
    expect(response.body.name).toEqual('carlos');
    expect(response.headers['content-type']).toMatch(/json/);
  })

  describe('GET /nueva-ruta', () => {
    test('should return 401', async () => {
      const { statusCode } = await api.get('/nueva-ruta');
      expect(statusCode).toEqual(401);
    })

    test('should return 401 with apiKey invalid', async () => {
      const { statusCode } = await api.get('/nueva-ruta').set({
        api: '1212'
      });
      expect(statusCode).toEqual(401);
    })

    test('should return 200', async () => {
      const { statusCode } = await api.get('/nueva-ruta').set({
        api: config.apiKey
      });
      expect(statusCode).toEqual(200);
    })
  });


  afterAll(() => {
    server.close();
  });
});
