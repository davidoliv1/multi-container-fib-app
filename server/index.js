import { keys } from './keys.js';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { Pool } from 'pg';
import redis from 'redis';

const app = express();
app.use(cors());
app.use(bodyParser.json());

const pgClient = new Pool({
    user: keys.pgUser,
    host: keys.pgHost,
    database: keys.pgDatabase,
    password: keys.pgPassword,
    port: keys.pgPort,
    ssl:
    process.env.NODE_ENV !== 'production'
        ? false
        : { rejectUnauthorized: false },
});

pgClient.on("connect", (client) => {
  client
    .query("CREATE TABLE IF NOT EXISTS values (number INT)")
    .catch((err) => console.error(err));
});

const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000
});

const redisPublisher = redisClient.duplicate();

app.get('/', (req, res) => {
  res.send('Hi');
});

app.get('/values/all', async (req, res) => {
  const values = await pgClient.query('SELECT * from values');
  res.send(values.rows);
});

app.get('/values/current', async () => {
  redisClient.hGetAll('values', (err, values) => {
    res.send(values);
  });
});

app.post('/values', async (req, res) => {
  const { index } = req.body;

  if(parseInt(index) > 40) {
    return res.status(422).send('Index too high!');
  };

  redisClient.hSet('values', index, 'Nothing yet!');
  redisPublisher.publish('insert', index);
  pgClient.query('INSER INTO values(number) VALUES ($1)', [index]);

  res.send({ working: true });
});

app.listen(5000, () => {
  console.log('Listening on port 5000');
});