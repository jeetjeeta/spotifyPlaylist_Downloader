const redis = require("redis");
require("dotenv").config();

const redisHost = process.env.REDIS_HOST;
// ||
// "redis-17860.c258.us-east-1-4.ec2.cloud.redislabs.com";

const redisPort = process.env.REDIS_PORT;
// || 17860;
const redisPassword = process.env.REDIS_PASSWORD;
// || "5SiFtl4ruyDEJhxEE9Wmjje9qq1iugPj";

const redisClient = redis.createClient({
  url: `redis://${redisHost}:${redisPort}`,
  password: redisPassword,
});

// const redisClient2 = redis.createClient({
//   url: `redis://${redisHost}:${redisPort}`,
//   password: redisPassword,
// });

redisClient.on("error", (error) => {
  console.error(`Error1: ${error}`);
});

// redisClient2.on("error", (error) => {
//   console.error(`Error2: ${error}`);
// });

redisClient.connect();

redisClient.on("connect", () => {
  console.log("redis1 connected");
});

// redisClient2.connect();

// redisClient2.on("connect", () => {
//   console.log("redis2 connected");
//   // redisClient2.flushAll("ASYNC", function (err, succeeded) {
//   //   if (err) {
//   //     console.log(err);
//   //   }
//   //   console.log(succeeded); // will be true if successfull
//   // });
// });

module.exports = { redisClient };
