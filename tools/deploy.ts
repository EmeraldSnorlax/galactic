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
});
console.log(process.env.SCREEPS_EMAIL);
req.write(JSON.stringify(data));
req.end();
console.log('done');
