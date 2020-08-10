const fs = require ('fs');
const path = require ('path');
const bcrypt = require ('bcrypt');
const {check, validationResult, body} = require('express-validator');
let db = require('../database/models');
const { Op } = require("sequelize");
const User = require('../database/models/User');

//let usuariosJson = fs.readFileSync(path.join(__dirname, '../data/usuarios.json'), 'utf-8');
//let usuarios = JSON.parse(usuariosJson);

let usersController = {
  index: (req, res, next) => {
    res.send('bienvenido usuario')
  },
  login: (req, res, next) => {
    res.render('login')
  },
  ingresar: (req, res, next) => {
    let errors = validationResult(req);
    if(errors.isEmpty()) {

      db.User.findAll()
      .then(function(usuarios){
        for(let i = 0; i < usuarios.length; i++) {
            if(usuarios[i].email == req.body.email && bcrypt.compareSync(req.body.password, usuarios[i].password)) {
              let usuarioALoguear = usuarios[i]
              if(usuarios[i].category == 1) {
                req.session.usuarioAdmin = usuarioALoguear
              } else {
                req.session.usuario = usuarioALoguear
              }
						    if(req.body.remember != undefined){
                  res.cookie('remember', usuarios[i].id, { maxAge: 1000 * 60 * 60})
                }
              return res.redirect('/')
            }
        }
        return res.render('login', {
            errors: {
                email: {
                    msg: 'Credenciales inválidas. Inserta un email registrado y su respectiva contraseña'
                }
            },
            old: req.body
        })
      })
    } else {
        res.render('login', {
            errors: errors.mapped(),
            old: req.body
        })
    }
  
},
  register: function(req, res, next) {
    res.render('registro');
  },
  saveUser: function (req, res, next){
    
    db.User.create({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10),
      category: 0,
      image: (req.files[0] != undefined) ? req.files[0].filename : "default-image.jpg",
      status: 1
    })
    .then(function(result){
      res.redirect('/')
    })
    /*
    let nuevoUsuario = {
      email: req.body.userEmail,
      password: bcrypt.hashSync(req.body.userPassword, 10),
      avatar: req.files[0].filename
    }

    usuarios.push(nuevoUsuario)
    fs.writeFileSync(path.join(__dirname, '../data/usuarios.json'), JSON.stringify(usuarios))
    
    res.redirect('/')*/
  }
}

module.exports = usersController;