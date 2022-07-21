

const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');

const getUsuarios = async(req, res) =>{
    const desde = Number(req.query.desde) || 0;
     /*const usuarios = await Usuario.find({},'nombre email role google')
                                  .skip(desde)
                                  .limit(5);
    const total = await Usuario.count(); */

    const [usuarios, total] = await Promise.all([
        Usuario.find({},'nombre email role google img')
        .skip(desde)
        .limit(5),

        Usuario.countDocuments()
    ])
    res.json({
        ok: true,
        usuarios,
        total
    });
}

const crearUsuario = async(req, res=response) => {
   // console.log(req.body);
   const {email, password} = req.body; 
  
   
   try {
    const existeEmail = await Usuario.findOne({email});
    if(existeEmail)
    {
        return res.status(400).json({
            ok: false,
            msg: 'El correo ya esta registrado'
        })
    }
    const usuario = new Usuario(req.body);

    //Encriptar contraseña 
    const salt = bcrypt.genSaltSync();
    usuario.password= bcrypt.hashSync(password, salt);
    
    await usuario.save();
   // Generar el TOKEN - JWT
    const token = await generarJWT(usuario.id);
 
    res.json({
         ok:true,
         usuario,
         token
     });
   } catch (error) {
    console.log(error);
    res.status(500).json({
        ok: false,
        msg: 'Error Inesperado'
    })
   }
}

const actualizarUsuario = async(req, res = response)=>{

    const  uid= req.params.id;

    try {
        //validar token y comprobar si es usuario correcto
        const usuarioDB = await Usuario.findById(uid);
        if(!usuarioDB)
        {
            return res.status(404).json({
                ok:false,
                msg:'No existe un usuario por ese Id'
            })
        }
        
        //Actualizaciones
        const {password, google, email, ...campos} = req.body;

        if(usuarioDB.email !== email){
          const existeEmail = await Usuario.findOne({email}) 
          if(existeEmail){
              return req.status(400).json({
                  ok:false,
                  msg:'Ya existe un usuario con ese Email'
              })
          }
        }

        if(!usuarioDB.google){
            campos.email = email;
        }else if(usuarioDB.email !== email){
          return res.status(400).json({
              ok:false,
              msg:'Usuarios de google no pueden cambiar su correo'
          })
        }

        
        const usuarioActualizado  = await Usuario.findByIdAndUpdate(uid, campos, {new:true});



        res.json({
            ok:true,
            usuario: usuarioActualizado
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'Error, revisar logs'
        })
    }

}
const borrarUsuario = async(req, res=response) =>{

    const uid = req.params.id;
    try {

        const usuarioDB = await Usuario.findById(uid);
        if(!usuarioDB)
        {
            return res.status(404).json({
                ok:false,
                msg:'No existe un usuario por ese Id'
            })
        }
        await Usuario.findByIdAndDelete(uid);

        res.json({
           ok:true,
           msg:'Usuario eliminado'
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg: 'Hable con el administrador'
        })
    }
}

module.exports = {
    getUsuarios,
    crearUsuario,
    actualizarUsuario,
    borrarUsuario,
}