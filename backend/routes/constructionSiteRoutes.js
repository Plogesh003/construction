const express = require('express');
const router = express.Router();
const { createConstructionSite, getAllConstructionSites } = require('../controllers/constructionSiteController');

router.post('/', createConstructionSite);
router.get('/', getAllConstructionSites);

module.exports = router;
