const express = require('express');
const router = express.Router();

router.use('/users', require('./Users'));
router.use('/login', require('./Login'));

module.exports = router;
