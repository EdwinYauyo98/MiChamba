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

    app.get('/getserv', (req, res) => {
        connection.query('SELECT * FROM SERVICIOS', (err, result) => {
            console.log(result);
            res.json(result);
        });
    });

    app.get('/getdist', (req, res) => {
        connection.query('SELECT * FROM DISTRITOS', (err, result) => {
            console.log(result);
            res.json(result);
        });
    });

    app.get('/getcli', (req, res) => {
        connection.query('SELECT * FROM CLIENTES', (err, result) => {
            console.log(result);
            res.json(result);
        });
    });

    app.get('/getworker', (req, res) => {
        connection.query('SELECT * FROM WORKERS', (err, result) => {
            console.log(result);
            res.json(result);
        });
    });

    app.post('/consultaworker', (req,res) => {

        const {idservicio} = req.body;
        connection.query('SELECT * FROM USUARIOS WHERE idusuario IN (SELECT idusuario FROM WORKERS WHERE idservicio=?)', 
            idservicio
        , (err, result) => {
            if(!err){
                res.json(result);
            } else{
                res.json(err);
            }
        });
    });


    app.post('/login', (req,res) => {

        const {nick,password} = req.body;
        connection.query('SELECT * FROM USUARIOS WHERE nick=? and password=?',
           [nick, password], 
         (err, result) => {
            if(err)
                console.log(err);
            if(result.length!==0){
                res.json("login correcto");
            }
            else
            res.json("login incorrecto");
        });
    });


    app.post('/registro', (req,res) => {
        
        const {dni, nombre, apellido, nick , password, iddistrito,cuenta_int} = req.body;
        var validacion="";
        connection.query('SELECT * FROM USUARIOS WHERE dni=?',
        dni
        ,(err, result) => {
            if(result.length!==0){
                validacion="usuario duplicado";
                res.json(validacion);
            }
        });
        
        if(validacion!=="usuario duplicado"){
            console.log("q onda");
            connection.query('INSERT INTO USUARIOS SET?', {
                dni:dni,
                nombre:nombre,
                apellido: apellido,
                nick: nick,
                password: password,
                iddistrito: iddistrito,
                cuenta_int: cuenta_int
            }, (err, result) => {
                if(!err){
                    res.json("usuario añadido");
                } else{
                    res.json("usuario no añadido");
                    console.log(err);
                }
            });
        }

            
    });
}
