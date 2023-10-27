const request = require('supertest');

const createApp = require('../src/app');

describe('Test for app', () => {

  let app = null;
  let server = null;
  let api = null;

  beforeEach(() => {
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

  afterEach(() => {
    server.close();
  });
});
