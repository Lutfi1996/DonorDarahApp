'use strict';

const Response = require('../config/response')
const ObjectID = require('mongodb').ObjectID;

// JSON Web Token
const jwt = require('jsonwebtoken');
const secret = require('../config/token');
const now = new Date();

const RoleController = {
    GetAllRole : (req, res, next) => {
        global.dbo.collection('m_role').find({status : false}).toArray((err, db) => {
            if(err){
                return next(new Error());
            }
            Response.send(res, 200, db);
        });
    },
    GetRoleById : (req, res, next) => {
        let id = req.params.id;
        global.dbo.collection('m_role').find({status : false, '_id' : ObjectID(id)}).toArray((err,db) => {
            if(err){
                return next(new Error());
            }
            Response.send(res, 200, db);
        });
    },
    CreateRole : (req, res, next) => {
        let reqdata = req.body;
        var data = {};

        data.role = reqdata.role;
        data.created_date = now;
        data.created_by = global.user.username;
        data.updated_date = null;
        data.updated_by = null;
        data.status = false;

        var model = new roleModel(data);

        global.dbo.collection('m_role').insertOne(model, function(err, data){
            if(err)
            {
                return next(new Error());
            }

            Response.send(res, 200, data);
        });
    },
    UpdateRole : (req, res, next) => {
        let id = req.params.id;
        let reqdata = req.body;
        var oldmodel = {};
        var updatemodel = {};

        global.dbo.collection('m_role').find({status : false, '_id' : ObjectID(id)}).toArray((err, data) => {
            if(err)
            {
                return next(new Error());
            }

            oldmodel = data.map((entity) => {
                return new clientModel(entity);
            });

            updatemodel._id = ObjectID(id);
            updatemodel.role = reqdata.role;
            updatemodel.created_date = oldmodel[0].created_date;
            updatemodel.created_by = oldmodel[0].created_by;
            updatemodel.updated_date = now;
            updatemodel.updated_by = global.user.username;
            updatemodel.status = false;

            var model = new clientModel(updatemodel);

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
    },
    DeleteRole : (req, res, next) => {
        let id = req.params.id;
        var oldmodel = {};
        var deletemodel = {};

        global.dbo.collection('m_role').find({status : false, '_id' : ObjectID(id)}).toArray((err, data) => {
            if(err)
            {
                return next(new Error());
            }

            oldmodel = data.map((entity) => {
                return new clientModel(entity);
            });

            deletemodel._id = ObjectID(id);
            deletemodel.role = oldmodel[0].role;
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
module.exports = RoleController;