var express = require('express');
var router = express.Router();
var AdminHandler = require('../controllers/admin_controller');
var LoginHandler = require('../controllers/login_controller');
let ah = new AdminHandler()
let lh = new LoginHandler()

/* GET Dashboard page. */
router.get('/', ah.getDashboard);

/* POST PERM DELETE ITEM. */
router.post('/delete_item', ah.destroyItem);

/* POST TOGGLE ITEM STATE. */
router.post('/toggle_state', ah.toggleItemState);

/* GET Users page. */
router.get('/users', ah.getUsers);

/* POST NEW USER. */
router.post('/add_user', lh.registerUser);

/* edit  USER. */
router.get('/edit_user/:id/', ah.getUser);

/* POST UPDATED USER. */
router.post('/edit_user', lh.registerUser);

/* GET stock */
router.get('/stock', ah.getStock);

/* POST TO ADD NEW TYPE */
router.post('/add_type', ah.addType);


/* POST TO update TYPE */
router.post('/edit_type', ah.editType);

/* POST TO ADD NEW PRODUCT */
router.post('/add_product', ah.addProduct);

/* GET PRODUCT LOG*/
router.post('/get_prod_log', ah.getProdLog);

/* POST TO update TYPE */
router.post('/edit_product', ah.editProduct);

/* GET vault */
router.get('/vault', ah.getVault);

/* POST TO ADD NEW vault record */
router.post('/add_vault', ah.addVaultRecord);

/* GET PRODUCT by type*/
router.post('/get_prod_by_type', ah.getProdByType);

/* GET vault */
router.get('/pos', ah.getPOS);

/* GET search PRODUCT by type*/
router.post('/search_prod_by_type', ah.searchProdByType);

module.exports = router;
