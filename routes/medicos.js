/*
  Medicos
  ruta: '/api/medicos'
*/



const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const {  getMedico, crearMedico, actualizarMedico, borrarMedico } = require('../controllers/medicos');

const router = Router();

 router.get('/', getMedico); 
 router.post('/', 
    [
      validarJWT,
      check('nombre','El nombre del medico es necesrio').not().isEmpty(),
      check('hospital','El hospital debe ser válido').isMongoId(),
      validarCampos
    ],
    crearMedico
 );

 router.put('/:id', 
      [
        validarJWT,
      check('nombre','El nombre del medico es necesrio').not().isEmpty(),
      check('hospital','El hospital debe ser válido').isMongoId(),
      validarCampos
      ],
      actualizarMedico
    );

       router.delete('/:id', 
       borrarMedico
        );


module.exports= router;