const { Router } = require('express');
const { check }  = require('express-validator');

const { register, searchByAreaOrName, getAll } = require('../controllers/consultor');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

router.post( '/new', [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    check('areas', 'Las áreas son obligatorias').not().isEmpty(),
    validarCampos
], register);

router.get('/search', searchByAreaOrName);
router.get('/', getAll);

module.exports = router;