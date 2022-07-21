const { response } = require('express');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt')
const Usuario = require('../models/usuario');
const { googleVerify } = require('../helpers/google-verify');


const login =async (req, res = response) => {
    const {email, password} = req.body;

    try {
         
        const usuarioDB = await Usuario.findOne({email})
        if(!usuarioDB){
            return res.status(404).json({
                ok:false,
                msg:'Email no valido'
            })
        }
        //validar  email
        const validPassword = bcrypt.compareSync(password, usuarioDB.password);
        if(!validPassword){
            return res.status(400).json({
                ok:false,
                msg:'Contraseña no válida'
            })
        }

        //generar un jwt
        const token = await generarJWT(usuarioDB.id);

        res.json({
           ok:true,
           token
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
          ok:false,
          msg: 'Hablar con admin'
        })
    }
}


const googleSignIn = async(req, res= response)=>{
    const googleToken = req.body.token;

    try {
        const { name, email, picture  } = await googleVerify(googleToken);
        const usuarioDB = await Usuario.findOne ({email});
        let usuario;

        if(!usuarioDB){
            // si no existe le usuario
            usuario= new Usuario({
                nombre:name,
                email,
                password: '@@@',
                img: picture,
                google: true
            })
        }else {
            // existe usuario
            usuario = usuarioDB;
            usuario.google = true;

        }

        //Guardar DB
        await usuario.save();

        //Generar el TOKEN - JWT
        const token = await generarJWT ( usuario.id);

        res.json({
            ok:true,
            msg:'Google Signin',
            token
        });
        
    } catch (error) {
        res.status(401).json({
            ok:false,
            msg: 'Token no es correcto'
        })
    }

   

}


const renewToken = async(req, res= response) => {

    
     const uid = req.uid;
     //Generar el TOKEN - JWT
     const token = await generarJWT ( uid);
     //Obtener usuario de UID
     const usuario = await Usuario.findById(uid);

    res.json({
        ok:true,
        uid, 
        usuario

    });
}

module.exports={
    login,
    googleSignIn,
    renewToken
}