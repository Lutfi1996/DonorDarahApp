'use strict';

const Response = require('../config/response')
const ObjectID = require('mongodb').ObjectID;
const clientModel = require('../models/m_client.model');
const roleModel = require('../models/m_role.model');

const validate = {
    checkClient : (req, res, next) => {
        var nama_client = req.params.name;

        // if(nama_client == null){
        //     Response.send(res, 403, "You are not authorized");
        // }else{
            global.dbo.collection('m_client').findOne({ nama_client : nama_client}, (err, data) => {
                if(data){
                    let doc = {
                        message : "existing",
                        content : { "_id" : ObjectID(data._id), "nama" : data.nama_client }
                    };
                    Response.send(res, 200, doc);
                }else{
                    Response.send(res, 200, "not exist");
                }
            });
    },

    //role = name
    checkRoleName : (req, res, next) => {
        var nama = req.params.name;

        global.dbo.collection('m_role').findOne({ role : nama}, (err, data) => {
            if(data){
                let doc = {
                    message : "existing",
                    content : { "_id" : ObjectID(data._id),
                                "role" : data.role
                            }
                };
                Response.send(res, 200, doc);
            }else{
                Response.send(res, 200, "not exist");
            }
        });
    }
};

module.exports = validate;