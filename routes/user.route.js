const express = require('express');
const router = express.Router();
const password = require("../middleware/password.middleware")

const userCtrl = require('../controllers/user.controller');

router.post('/signup',password, userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;