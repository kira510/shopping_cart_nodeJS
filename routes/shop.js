const path = require('path');

const express = require('express');

const productsController = require('../controllers/products');

//const rootDir = require('../util/path');

const router = express.Router();

router.get('/', productsController.getProducts);

module.exports = router;
