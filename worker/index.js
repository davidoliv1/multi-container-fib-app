import { keys } from './keys.js';
import redis from 'redis';

const redisClient = redis.createClient({
  url: `redis://${keys.redisHost}:${keys.redisPort}`,
});

const sub = redisClient.duplicate();

await redisClient.connect();
await sub.connect();

function fib(index) {
    if(index < 2) {
        return 1;
    }
    return fib(index - 1) + fib(index - 2);
}

await sub.subscribe('insert', async (message) => {
  const index = parseInt(message);
  const result = fib(index);
  await redisClient.hSet('values', index, result);
});