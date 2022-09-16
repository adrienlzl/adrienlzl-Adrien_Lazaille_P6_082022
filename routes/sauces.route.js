const express = require('express');
const router = express.Router();


const auth = require('../middleware/auth.middleware');
const multer = require('../middleware/multer.middleware');

const stuffCtrl = require('../controllers/sauces.controller');

router.get('/:id', auth, stuffCtrl.getOneSauce);
router.get('/', auth, stuffCtrl.getAllStuff);
router.post('/', multer, auth, stuffCtrl.createSauce);
router.put('/:id', multer, auth, stuffCtrl.modifySauce);
router.delete('/:id', auth, stuffCtrl.deleteSauce);
router.post('/:id/like', auth, stuffCtrl.likeSauce);


module.exports = router;