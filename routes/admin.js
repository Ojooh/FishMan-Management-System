var express = require('express');
var router = express.Router();
var AdminHandler = require('../controllers/admin_controller');
var LoginHandler = require('../controllers/login_controller');
let ah = new AdminHandler()
let lh = new LoginHandler()

/* GET Dashboard page. */
router.get('/', ah.getDashboard);

/* GET Users page. */
router.get('/users', ah.getUsers);

/* POST NEW USER. */
router.post('/add_user', lh.registerUser);

/* edit  USER. */
router.get('/edit_user/:id/', ah.getUser);

/* POST UPDATED USER. */
router.post('/edit_user', lh.registerUser);

/* POST UPDATED USER. */
router.post('/delete_item', ah.destroyItem);

/* GET stock */
router.get('/stock', ah.getStock);

/* POST TO ADD NEW TYPE */
router.post('/add_type', ah.addType);

/* POST TO ADD NEW PRODUCT */
router.post('/add_product', ah.addProduct);


module.exports = router;
