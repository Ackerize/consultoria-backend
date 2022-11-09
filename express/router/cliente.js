const { Router } = require('express');
const { check }  = require('express-validator');

const { register, getAll, searchByName } = require('../controllers/cliente');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

router.post( '/new', [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    validarCampos
], register);

router.get('/', getAll);
router.get('/search', searchByName);


module.exports = router;