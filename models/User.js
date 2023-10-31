const {Schema, model} = require('mongoose')


const User = new Schema({
    username: {type: String, required: true},
    lastname: {type: String, required: true},
    password: {type: String, required: true},
    email: {type: String},
    color: {type: String, unique: true},
    roles: [{type: String, ref: 'Role'}]
})

module.exports = model('User', User)
