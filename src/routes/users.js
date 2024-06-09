const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { userSignup, userLogin, userLogout } = require('../api/users');

router.post('/signup', userSignup);
router.post('/login', userLogin);
router.post('/logout', auth, userLogout);

module.exports = router;