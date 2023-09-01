var express = require('express');
var router = express.Router();
var menusController = require('../controllers/menu');

router.get('/', menusController.getMenu);
router.get('/:id', menusController.showMenu);
router.post('/', menusController.createMenu);
router.put('/:id', menusController.updateMenu);
router.delete('/:id', menusController.deleteMenu);

module.exports = router;
