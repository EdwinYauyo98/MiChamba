const dbConnection = require('../../config/dbConnection');

require('../../config/dbConnection');


const e = require("express")

module.exports = app => {
    const connection = dbConnection();
    app.get('/getusers', (req, res) => {
        connection.query('SELECT * FROM USUARIOS', (err, result) => {
            console.log(result);
            res.json(result);
        });
    }); 

    app.post('/adduser', (req,res) => {

        const {dni, nombre, apellido, nick , password, idDISTRITO, idContacto} = req.body;
        connection.query('INSERT INTO USUARIOS SET?', {
            dni:dni,
            nombre:nombre,
            apellido: apellido,
            nick: nick,
            password: password,
            idDISTRITO: idDISTRITO,
            idContacto: idContacto
        }, (err, result) => {
            if(!err){
                res.json("Usuario_añadido");
            } else{
                res.json("Usuario_no_añadido");
            }
        });
    });
}