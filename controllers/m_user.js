'use strict';

const Response = require('../config/response')
const ObjectID = require('mongodb').ObjectID;
const usersModel = require('../models/m_users.model');
const bcrypt = require('bcryptjs');

// JSON Web Token
const jwt = require('jsonwebtoken');
const secret = require('../config/token');

const now = new Date();

const UserController = {
    Login : (req, res, next) => {
        var userenm = req.body.username; //harus sama dengan sisi postman/clientnya
        var password = req.body.password; //sesuai dgn yg ada di db
        console.log(req.body.username);
        if(userenm == null || password == null){
            Response.send(res, 404, 'User tidak ditemukan');
        }else{
            global.dbo.collection('m_user').findOne({username : userenm}, (err, data) => {
                if(data){
                    console.log(data.username);
                    console.log(data.password);

                    if(bcrypt.compareSync(password, data.password)){
                        global.dbo.collection('m_role').findOne({'_id' : ObjectID(data.id_role)}, (err, role)=> {
                            if(role){
                                data.rolename = role.role;

                                //Generate JWT Token //yg harus dibawa kemana mana
                                let token = jwt.sign(data, secret.secretkey,{
                                    expiresIn : 86400 //s //akan expire dlm 24 jam
                                }); //secretkey = yg harus dibawa saat mau bikin token
                                
                                delete data.password; //untuk menghapus key password, krn yg dipakai token key saja
                                let doc = {
                                    userdata : data,
                                    token : token
                                };

                                Response.send(res, 200, doc);
                            }else{
                                Response.send(res, 404, "Role Tidak Ditemukan");
                            }
                        });
                    }else{
                        Response.send(res, 404, "Password Tidak Sesuai");
                    }
                }else{
                    Response.send(res, 404, "User Tidak Ditemukan");
                }
            });
        }
    },

    Logout : (req, res, next) => {
        let doc = {
            status : "Logout berhasil",
            userdata : null,
            token : null
        };

        Response.send(res, 200, doc);
    },

    GetAllUser : (req, res, next) => {
        global.dbo.collection('m_user').find({status : false}).toArray((err, data) => {
            if(err){
                return next(new Error());
            }
            
            let modelCollection = data.map((entity) => {
                return new usersModel(entity);
            });

            Response.send(res, 200, modelCollection);
        });
    },

    GetAllById : (req, res, next) => {
        let id = req.params.id;
        global.dbo.collection('m_user').find({status : false, '_id' : ObjectID(id)}).toArray((err, data) => {
            if(err){
                return next(new Error());
            }
            let model = data.map((entity) => {
                return new usersModel(entity);
            });
            Response.send(res, 200, model);
        });
    },
    
    CreateUser : (req, res, next) => {
        let body = req.body;
        var data = {};
        
        data.nama_lengkap = body.nama_lengkap;
        data.email = body.email;
        data.username = body.username;
        data.password = bcrypt.hashSync(body.password, 8); //8 = salt //hashsync = untuk generate passwordnya
        data.id_role = ObjectID(body.id_role);
        data.created_date = now;
        data.created_by = global.user.username; 
        data.updated_date = null; 
        data.updated_by = null;
        data.status = false;

        // console.log(data);
        var model = new usersModel(data);

        global.dbo.collection('m_user').insertOne(model, function(err, data) {
            if(err){
                return next(new Error());
            }
            Response.send(res, 200, data);
        });
    },

    UpdateUser : (req, res, next) => {
        let id = req.params.id;
        let body = req.body;
        var oldmodel = {};
        var updatemodel = {};

        global.dbo.collection('m_user').find({status : false, '_id' : ObjectID(id)}).toArray((err, data) => {
            if(err)
            {
                return next(new Error());
            }

            oldmodel = data.map((entity) => {
                return new usersModel(entity);
            });

            updatemodel._id = ObjectID(id);

            if(body.nama_lengkap == null || body.nama_lengkap == undefined || body.nama_lengkap == "")
            {
                updatemodel.nama_lengkap = oldmodel[0].nama_lengkap;
            }
            else
            {
                updatemodel.nama_lengkap = body.nama_lengkap;
            }

            if(body.email == null || body.email == undefined || body.email == "")
            {
                updatemodel.email = oldmodel[0].email;
            }
            else
            {
                updatemodel.email = body.email;
            }

            if(body.username == null || body.username == undefined || body.username == "")
            {
                updatemodel.username = oldmodel[0].username;
            }
            else
            {
                updatemodel.username = body.username;
            }

            if(body.password == null || body.password == undefined || body.password == "")
            {
                updatemodel.password = oldmodel[0].password;
            }
            else
            {
                updatemodel.password = bcrypt.hashSync(body.password, 8);
            }

            updatemodel.id_role = ObjectID(oldmodel[0].id_role);
            updatemodel.created_date = oldmodel[0].created_date;
            updatemodel.created_by = oldmodel[0].created_by;
            updatemodel.updated_date = now;
            updatemodel.updated_by = global.user.username;
            updatemodel.status = false;

            var model = new usersModel(updatemodel);

            global.dbo.collection('m_user').findOneAndUpdate
            (
                {'_id' : ObjectID(id)},
                {$set: model},
                function(err, data){
                    if(err)
                    {
                        return next(new Error());
                    }

                    Response.send(res, 200, data);
                }
            );
        });
    },
    
    DeleteUser : (req, res, next) => {
        let id = req.params.id;
        var oldmodel = {};
        var deletemodel = {};

        global.dbo.collection('m_user').find({status : false, '_id' : ObjectID(id)}).toArray((err, data) => {
            if(err)
            {
                return next(new Error());
            }

            oldmodel = data.map((entity) => {
                return new usersModel(entity);
            });

            deletemodel._id = ObjectID(id);
            deletemodel.nama_lengkap = oldmodel[0].nama_lengkap;
            deletemodel.email = oldmodel[0].email;
            deletemodel.username = oldmodel[0].username;
            deletemodel.password = oldmodel[0].password;
            deletemodel.created_date = oldmodel[0].created_date;
            deletemodel.created_by = oldmodel[0].created_by;
            deletemodel.updated_date = now;
            deletemodel.updated_by = global.user.username;
            deletemodel.status = true;

            var model = new clientModel(deletemodel);

            global.dbo.collection('m_client').findOneAndUpdate
            (
                {'_id' : ObjectID(id)},
                {$set: model},
                function(err, data){
                    if(err)
                    {
                        return next(new Error());
                    }

                    Response.send(res, 200, data);
                }
            );
        });
    }
};

module.exports = UserController;
