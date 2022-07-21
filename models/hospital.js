const { Schema, model } = require('mongoose');

const HospistalSchema = Schema({
    nombre:{
        type: String,
        required: true
    },
    img:{
        type: String,
    },
    usuario:{
        required:true,
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }
}, { collection:'hospitales' });

HospistalSchema.method('toJSON', function(){
  const {__v, ...object} = this.toObject();
  return object;
})

module.exports = model('Hospital', HospistalSchema);