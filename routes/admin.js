const path = require('path');
const express = require('express');

const productsController = require('../controllers/products');

//const rootDir = require('../util/path');   this can be removed since we do not use path.join
// as we shifted to use ejs templates, sendFile not required anymore

const router = express.Router();

// /admin/add-product => GET
router.get('/add-product', productsController.getAddProduct);

// /admin/add-product => POST
router.post('/add-product', productsController.postAddProduct);

module.exports = router;

// note that router.get also does the same job as use