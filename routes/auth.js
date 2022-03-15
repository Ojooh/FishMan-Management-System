var express = require('express');
var router = express.Router();
var LoginHandler = require('../controllers/login_controller');
let lh = new LoginHandler()

/* GET login page. */
router.get('/', lh.loginPage);

/* GET login page. */
router.get('/login', lh.loginPage);

/* POST to login user. */
router.post('/', lh.logIn);

/* POST to login user. */
router.post('/login', lh.logIn);

/* POST to register user. */
router.post('/register_user', lh.registerUser);

/* LOGOUT. */
router.get('/logout', lh.logOut);

module.exports = router;



