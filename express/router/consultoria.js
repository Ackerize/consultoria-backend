const { Router } = require('express');
const { check }  = require('express-validator');

const { getAll, getAllByUser, create, toggleStatus } = require('../controllers/consultoria');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

router.post( '/new', [
    check('startDate', 'La fecha de inicio es obligatoria').not().isEmpty(),
    check('endDate', 'La fecha de fin es obligatoria').not().isEmpty(),
    check('consultor', 'El consultor es obligatorio').not().isEmpty(),
    check('consultor', 'El consultor debe ser un ID válido').isMongoId(),
    check('cliente', 'El cliente es obligatorio').not().isEmpty(),
    check('cliente', 'El cliente debe ser un ID válido').isMongoId(),
    check('area', 'El área de experiencia es obligatoria').not().isEmpty(),
    validarCampos
], create);

router.get('/', getAll);
router.get('/user', getAllByUser);
router.patch('/toggle/:id', toggleStatus);

module.exports = router;