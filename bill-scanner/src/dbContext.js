import redis from 'redis';
import { promisify } from 'util';

let redisClient = {};
const REDIS_IP = '0.0.0.0'; // Move to a config file
const REDIS_PORT = '6379'; // Move to a config file

export function initCache() {
    const connectionString = `redis://${REDIS_IP}:${REDIS_PORT}`;
    return new Promise((resolve, reject) => {
      try {
        redisClient = redis.createClient(connectionString);
        redisClient.once('ready',
          () => {
            console.log(`Redis connected on ${connectionString} and ready to accept commands`);
            resolve();
          }
        );
        redisClient.on('error',
          (error) => {
            console.log('Redis:ConnectionError', error);
            reject(error);
          }
        );
      } catch (error) {
        console.log('Redis:ConnectionError', error);
        reject(error);
      }
    });
  }

  export function cacheClient() {
    return redisClient;
  }
  
  let promisifiedRedis = null;
  export const redisPromise = () => {
    if (!promisifiedRedis) {
      promisifiedRedis = {
        set: promisify(cacheClient().set).bind(cacheClient()),
        get: promisify(cacheClient().get).bind(cacheClient()),
      };
    }
    return promisifiedRedis;
  };

  