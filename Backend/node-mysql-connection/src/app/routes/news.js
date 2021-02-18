const dbConnection = require('../../config/dbConnection');
const cors = require('cors');
require('../../config/dbConnection');


const express = require("express");
const { json } = require('body-parser');
//const bodyParser = require('body-parser');
var validacion="hola";
module.exports = app => {

    app.use(cors());

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

    app.get('/getserviciosworker', (req, res) => {
        connection.query('SELECT * FROM SERVICIOS_WORKER', (err, result) => {
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

    app.get('/getContratos', (req,res) =>{
        connection.query('SELECT * FROM CONTRATOS', (err,result)=>{
            console.log(result);
            res.json(result);
        })
    });

    app.post('/consultaworker', (req,res) => {

        const {idservicio} = req.body;
        connection.query('SELECT * FROM USUARIOS WHERE idusuario IN (SELECT idusuario FROM WORKERS WHERE idworker IN (SELECT idworker FROM SERVICIOS_WORKER WHERE idservicio=?))', 
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
        const {correo,password} = req.body;
        console.log(req.body)
        console.log(correo)
        console.log(password)
        connection.query('SELECT * FROM USUARIOS WHERE correo=? and password=?',
           [correo, password], 
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
        
        const {dni, nombre, apellido, correo, nick , password, iddistrito,cuenta_int} = req.body;
        
            
            connection.query('INSERT INTO USUARIOS SET?', {
                dni:dni,
                nombre:nombre,
                apellido: apellido,
                correo: correo,
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
        
        
            
    });

    app.post('/propContrato', (req, res) =>{
        const {estado,idworker,idcliente} = req.body;

        connection.query('INSERT INTO CONTRATOS SET?', {
            estado:estado,
            idworker:idworker,
            idcliente:idcliente
        }, (err, result)=>{
            if(!err){
                res.json("contrato propuesto");
            }else{
                res.json("contrato no propuesto");
            }
        });

    });

    app.post('/aceptContrato', (req, res) =>{
        const {estado, idworker, idcliente} = req.body;

        connection.query('UPDATE CONTRATOS SET estado=? WHERE idworker=? AND idcliente=?',[estado,idworker,idcliente], (err,result) =>{
            if(!err){
                res.json("contrato iniciado");
            }else{
                res.json("contrato no iniciado");
            }
        });
    });

    app.post('/cancelContrato', (req,res) =>{
        const {estado,idworker,idcliente} = req.body;

        connection.query('UPDATE CONTRATOS SET estado=? WHERE idworker=? AND idcliente=?',[estado,idworker,idcliente],(err,result) =>{
            if(!err){
                res.json("contrato cancelado");
            }else{
                res.json("contrato no cancelado");
            }
        });
    });

    app.post('/finContrato', (req,res)=>{
        const {estado,idworker,idcliente} = req.body;

        connection.query('UPDATE CONTRATOS SET estado=? WHERE idworker=? AND idcliente=?', [estado,idworker,idcliente], (err,result)=>{
            if(!err){
                res.json("contrato finalizado");
            }else{
                res.json("contrato no finalizado");
            }
        });
    });

    app.post('/editarRol', (req, res) =>{
        const {idusuario,rol_worker} = req.body;

        connection.query('UPDATE USUARIOS SET rol_worker=? WHERE idusuario=?', [rol_worker, idusuario] ,
        (err,result) =>{
            if (!err){
                res.json("Rol editado");
            }else{
                res.json("Rol no editado");
                console.log(err);
            }
        }
        );

        if (rol_worker == 'TRUE'){
            connection.query('INSERT INTO WORKERS SET ?', {
                idusuario:idusuario
            });
        }else{
            connection.query('DELETE FROM WORKERS WHERE idusuario=?', idusuario);
        }
    });



    // app.use(express.json());
    // app.use(express.urlencoded());

    app.post('/checkServicio', (req, res) =>
    {
    
        const {idworker,idservicio} = req.body;

        console.log(idworker);
        console.log(idservicio);

        connection.query('SELECT * FROM SERVICIOS_WORKER WHERE idworker=? AND idservicio=?',[idworker,idservicio],
        (err,result)=>
        {
            if(!err)
            {
                if(result.length==0){
                    //INSERCION DE NUEVO DATO
                    connection.query('INSERT INTO SERVICIOS_WORKER SET?',{
                        idworker:idworker,
                        idservicio:idservicio
                        },
                        (err,result)=>
                        {
                            if(!err)
                            {
                                res.json("servicios INSERTADOS con exito");
                            }
                            else
                            {
                                res.json("error de actualizacion");
                                console.log(err);
                            }
                            
                
                        });  
                }
                else{
                    res.json("IGNORADO");
                }

                //console.log(result);

            }
            else
            {
                res.json("error de consulta");
                console.log(err);
            }
            

        });             
 
    });




    app.post('/deleteServicio', (req,res)=>{

        const {idworker, idservicio} = req.body;

        connection.query('SELECT * FROM SERVICIOS_WORKER WHERE idworker=? AND idservicio=?',[idworker,idservicio], (err,result) => {
            if(!err)
            {
                console.log('exito de consulta');
                if(result.length==0){
                    res.json('tupla no existente');
                }
                else{
                    connection.query('DELETE FROM SERVICIOS_WORKER WHERE idworker=? AND idservicio=?',[idworker,idservicio],(err,result)=>{
                        if(!err){
                            res.json('tupla borrada');
                        }
                        else{
                            res.json('tupla no borrada');
                            console.log(err);
                        }
                    });
                }
            }else{
                res.json('error de consulta');
                console.log(err);
            }        
        });
    });

}
