const express = require('express');
const router = express.Router();
const { createScaffoldRentalOrder, getAllScaffoldRentalOrders } = require('../controllers/scaffoldRentalController');

router.post('/', createScaffoldRentalOrder);
router.get('/', getAllScaffoldRentalOrders);

module.exports = router;
