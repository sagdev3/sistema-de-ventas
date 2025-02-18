const express = require('express');
const router = express.Router();
const saleController = require('../controllers/saleController');

router.post('/', saleController.registerSale);
router.post('/subtract', saleController.subtractSale);
router.get('/agent/:agentId', saleController.getAgentSalesForMonth);
router.post('/clean', saleController.cleanCounters);

module.exports = router;
