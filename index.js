const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { dbConnection } = require('./database/config');

// Crear el servidor de express

const app = express();
app.use(cors());  //middlewere

//Lectura y parseo del body
app.use(express.json());

//mean_user
//L3cf9JVgteJ16jUx


dbConnection();


//Directorio publico

app.use(express.static('public'));


// Rutas

app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/hospitales', require('./routes/hospitales'));
app.use('/api/medicos', require('./routes/medicos'));
app.use('/api/todo', require('./routes/busquedas'));
app.use('/api/login', require('./routes/auth'));
app.use('/api/upload', require('./routes/uploads'));


app.listen(3003, ()=> {
    console.log('Express server puerto 3003: \x1b[32m%s\x1b[0m', 'online');
});