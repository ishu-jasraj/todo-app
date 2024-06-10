const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { userSignup, userLogin, userLogout, verifyLogin } = require('../api/users');

router.post('/signup', userSignup);
router.post('/login', userLogin);
router.get('/magic', verifyLogin);
// router.post('/magic', userLogin);
router.post('/logout', auth, userLogout);

module.exports = router;