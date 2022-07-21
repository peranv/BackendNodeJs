/*
  http://localhost:3001/api/todo/:busqueda

*/

const { Router } = require('express');
const router = Router();
const { getTodo, getDocumentosColeccion } = require('../controllers/busquedas')
const { validarJWT } = require('../middlewares/validar-jwt')

router.get('/:busqueda', validarJWT, getTodo) 

router.get('/coleccion/:tabla/:busqueda', validarJWT, getDocumentosColeccion) 






module.exports= router;


