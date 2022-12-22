/* eslint-disable import/no-extraneous-dependencies */
import http from 'http';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const data = {
  branch: 'default',
  modules: {
    main: fs.readFileSync('./dist/main.js', 'utf-8'),
  },
};

const req = http.request({
  hostname: process.env.SCREEPS_HOST,
  port: process.env.SCREEPS_PORT,
  path: '/api/user/code',
  method: 'POST',
  auth: `${process.env.SCREEPS_EMAIL}:${process.env.SCREEPS_PASSWORD}`,
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
  },
  timeout: 10000,
});
req.write(JSON.stringify(data));

req.on('error', (e) => {
  console.log(e);
  process.exit(1);
});

req.on('timeout', () => {
  console.log('Timeout, took longer than 10 seconds to deploy.');
  process.exit(1);
});

req.end();
