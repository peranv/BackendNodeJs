/* Path: '/api/login' */

const { check } = require('express-validator');

const { Router } = require('express');
const { login, googleSignIn, renewToken } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();


router.post('/',
  [
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'El passoword es obligatorio').not().isEmpty(),
    validarCampos
  ],
  login
);

router.post('/google',
  [
    check('token', 'El toke de google es obligatorio').not().isEmpty(),
    validarCampos
  ],
  googleSignIn
);

router.get('/renew',
    validarJWT,
    renewToken
  
);



module.exports = router;