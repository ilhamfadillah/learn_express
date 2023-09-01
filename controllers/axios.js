const axios = require('axios');
const Redis = require('redis');
const redisClient = Redis.createClient({ host: "127.0.0.1", port: 6379 });

redisClient.connect();

redisClient.on("error", function (err) {
  console.log("Error " + err);
});

redisClient.on("ready", function () {
  console.log("Redis client terhubung ke server");
});

redisClient.on("end", function () {
  console.log("Redis client terputus dari server. Menutup semua koneksi.");
});

const DEFAULT_EXPIRATION = 3600;

exports.getAxios = async function (req, res, next) {
  await axios.get('https://fakestoreapi.com/products', {
    timeout: 1000 // in milliseconds
  }).then(function (response) {
    res.status(200).json({ data: response.data });
  }).catch(function (err) {
    res.json({ error: "not connected!" });
  }).finally(function () { });
};

exports.getAxiosRedis = async function (req, res, next) {
  await redisClient.get('products').then(async function (products) {
    if (products != null) {
      return res.json(JSON.parse(products));
    } else {
      const { data } = await axios.get('https://fakestoreapi.com/products');
      redisClient.set("products", JSON.stringify(data), {
        EX: 3600,
        NX: true
      });
      return res.json(data);
    }
  })
};