var express = require('express');
var router = express.Router();
const axiosController = require('../controllers/axios');

router.get('/', axiosController.getAxios);
router.get('/use-redis', axiosController.getAxiosRedis);

module.exports = router;
