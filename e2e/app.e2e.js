const request = require('supertest');
const express = require('express');

const app = express();

app.get('/hello', (req, res) => {
  res.status(200).json({name: 'carlos'});
});

app.listen(3001);
const api = request(app);

describe('Test for app', () => {
  test('GET /hello', async () => {
    const response = await api.get('/hello');
    console.log(response.text);
    expect(response).toBeTruthy();
    expect(response.statusCode).toEqual(200);
    expect(response.body.name).toEqual('carlos');
    expect(response.headers['content-type']).toMatch(/json/);
  })
});
