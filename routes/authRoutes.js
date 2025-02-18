const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.registerLeader);
router.post('/login', authController.loginLeader);

module.exports = router;
