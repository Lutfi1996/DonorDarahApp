'use strict';

const Response = require('../config/response')
const ObjectID = require('mongodb').ObjectID;
const clientModel = require('../models/m_client.model');

const now = new Date();

const ClientController = {
    GetAll : (req, res, next) => {
        global.dbo.collection('m_client').find({status : false}).toArray((err, data) => {
            if(err){
                return next(new Error());
            }
            
            let modelCollection = data.map((entity) => {
                return new clientModel(entity);
            });

            Response.send(res, 200, modelCollection);
        });
    },

    GetAllByID : (req, res, next) => {
        let id = req.params.id;
        global.dbo.collection('m_client').find({status : false, '_id' : ObjectID(id)}).toArray((err, data) => {
            if(err){
                return next(new Error());
            }
            let model = data.map((entity) => {
                return new clientModel(entity);
            });
            Response.send(res, 200, model);
        });
    },

    CreatedClient : (req, res, next) => {
        let reqdata = req.body;
        var data = {};

        data.nama_client = reqdata.nama_client; 
        data.created_date = now;
        data.created_by = global.user.username; 
        data.updated_date = null; 
        data.updated_by = null;
        data.status = false;

        var model = new clientModel(data);
        
        global.dbo.collection('m_client').insertOne(model, function(err, data) {
            if(err){
                return next(new Error());
            }
            Response.send(res, 200, data);
        });
    },

    UpdateClient : (req, res, next) => {
        let id = req.params.id;
        let reqdata = req.body;
        var oldmodel = {}; //untuk mendapat yg baru
        var updatenodel = {};
        
        let model = {
            "nama_client" : reqdata.nama_client, 
            "updated_date" : now, 
            "updated_by" : global.user.username
        }
        global.dbo.collection('m_client').findOneAndUpdate({'_id' : ObjectID(id)}, {$set : model}, function (err, db){
            if(err){
                return next(new Error());
            }
            Response.send(res, 200, db);
        });
    },

    DeleteClient : (req, res, next) => {
        let id = req.params.id;
        let model = {
            "status" : true, 
            "updated_date" : now, 
            "updated_by" : global.user.username
        }
        global.dbo.collection('m_client').findOneAndUpdate({'_id' : ObjectID(id)}, {$set : model}, function (err, db){
            if(err){
                return next(new Error());
            }
            Response.send(res, 200, db);
        });
    }


    
};
module.exports = ClientController;

