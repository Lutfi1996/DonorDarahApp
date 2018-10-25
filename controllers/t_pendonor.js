'use strict';

const Response = require('../config/response')
const ObjectID = require('mongodb').ObjectID;
const pendonorModel = require('../models/t_pendonor.model');
const bcrypt = require('bcryptjs');

// JSON Web Token
const jwt = require('jsonwebtoken');
const secret = require('../config/token');

const now = new Date();

const PendonorController = {
    GetAll : (req, res, next) => {
        global.dbo.collection('t_pendonor').aggregate([
            {
              $lookup:
              {
                from : "m_goldarah",
                localField : "id_goldarah",
                foreignField : "_id",
                as : "goldar_lookup"
              }
            },
            {
              $unwind : "$goldar_lookup"
            },
            {
              $match :
              {
                status : false
              }
            },
            {
              $project:
              {
                nama_lengkap    : "$nama_lengkap",
                no_ktp          : "$no_ktp",
                tanggal_lahir   : "$tanggal_lahir",
                alamat          : "$alamat",
                jenis_kelamin   : "$jenis_kelamin",
                no_telp         : "$no_telp",
                tanggal_donor   : "$tanggal_donor",
                status_donor    : "$status_donor",
                id_goldarah     : "$id_goldarah",
                created_date    : "$created_date",
                created_by      : "$created_by",
                updated_date    : "$updated_date",
                updated_by      : "$updated_by",
                status          : "$status",
                golongan        : "$goldar_lookup.golongan",
                _id             : 1
              }
            }
            ]).toArray((err, data) => {
            if(err){
                return next(new Error());
            }
            
            let modelCollection = data.map((entity) => {
                return new pendonorModel(entity);
            });
            // console.log(data)
            Response.send(res, 200, data);
        });
    },

    GetAllById : (req, res, next) => {
        let id = req.params.id;
        global.dbo.collection('t_pendonor').find({status : false, '_id' : ObjectID(id)}).toArray((err, data) => {
            if(err){
                return next(new Error());
            }
            let model = data.map((entity) => {
                return new pendonorModel(entity);
            });
            Response.send(res, 200, model);
        });
    },

    CreatePendonor : (req, res, next) => {
        let body = req.body;
        // var date = JSON.useDateParser()
        var data = {};

        data.nama_lengkap = body.nama_lengkap;
        data.no_ktp = body.no_ktp;
        data.tanggal_lahir = new Date(body.tanggal_lahir);
        data.alamat = body.alamat;
        data.jenis_kelamin = body.jenis_kelamin;
        data.no_telp = body.no_telp;
        data.tanggal_donor = now;
        data.status_donor = "Baru";
        data.id_goldarah = ObjectID(body.id_goldarah);
        data.created_date = now;
        data.created_by = global.user.username; 
        data.updated_date = null; 
        data.updated_by = null;
        data.status = false;

        var model = new pendonorModel(data);

        global.dbo.collection('t_pendonor').insertOne(model, function(err, data){
            if(err){
                return next(new Error());
            }
            Response.send(res, 200, data);
        });
    },

    UpdatePendonor : (req, res, next) => {
        let id = req.params.id;
        let body = req.body;
        var oldmodel = {};
        var updatemodel = {};

        global.dbo.collection('t_pendonor').find({status : false, '_id' : ObjectID(id)}).toArray((err, data) => {
            if(err)
            {
                return next(new Error());
            }

            oldmodel = data.map((entity) => {
                return new pendonorModel(entity);
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

            if(body.no_ktp == null || body.no_ktp == undefined || body.no_ktp == "")
            {
                updatemodel.no_ktp = oldmodel[0].no_ktp;
            }
            else
            {
                updatemodel.no_ktp = body.no_ktp;
            }

            if(body.tanggal_lahir == null || body.tanggal_lahir == undefined || body.tanggal_lahir == "")
            {
                updatemodel.tanggal_lahir = oldmodel[0].tanggal_lahir;
            }
            else
            {
                updatemodel.tanggal_lahir = body.tanggal_lahir;
            }

            if(body.alamat == null || body.alamat == undefined || body.alamat == "")
            {
                updatemodel.alamat = oldmodel[0].alamat;
            }
            else
            {
                updatemodel.alamat = body.alamat;
            }
            
            if(body.jenis_kelamin == null || body.jenis_kelamin == undefined || body.jenis_kelamin == "")
            {
                updatemodel.jenis_kelamin = oldmodel[0].jenis_kelamin;
            }
            else
            {
                updatemodel.jenis_kelamin = body.jenis_kelamin;
            }

            if(body.no_telp == null || body.no_telp == undefined || body.no_telp == "")
            {
                updatemodel.no_telp = oldmodel[0].no_telp;
            }
            else
            {
                updatemodel.no_telp = body.no_telp;
            }

            updatemodel.tanggal_donor = oldmodel[0].tanggal_donor;
            updatemodel.status_donor = oldmodel[0].status_donor;
            updatemodel.id_goldarah = ObjectID(oldmodel[0].id_goldarah);
            updatemodel.created_date = oldmodel[0].created_date;
            updatemodel.created_by = oldmodel[0].created_by;
            updatemodel.updated_date = now;
            updatemodel.updated_by = global.user.username;
            updatemodel.status = false;

            var model = new pendonorModel(updatemodel);

            global.dbo.collection('t_pendonor').findOneAndUpdate
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
    DeletePendonor : (req, res, next) => {
        let id = req.params.id;
        var oldmodel = {};
        var deletemodel = {};

        global.dbo.collection('t_pendonor').find({status : false, '_id' : ObjectID(id)}).toArray((err, data) => {
            if(err)
            {
                return next(new Error());
            }

            oldmodel = data.map((entity) => {
                return new pendonorModel(entity);
            });

            deletemodel._id = ObjectID(id);
            deletemodel.nama_lengkap = oldmodel[0].nama_lengkap;
            deletemodel.no_ktp = oldmodel[0].no_ktp;
            deletemodel.tanggal_lahir = oldmodel[0].tanggal_lahir;
            deletemodel.alamat = oldmodel[0].alamat;
            deletemodel.jenis_kelamin = oldmodel[0].jenis_kelamin;
            deletemodel.no_telp = oldmodel[0].no_telp;
            deletemodel.tanggal_donor = oldmodel[0].tanggal_donor;
            deletemodel.status_donor = oldmodel[0].status_donor;
            deletemodel.id_goldarah = ObjectID(oldmodel[0].id_goldarah);
            deletemodel.created_date = oldmodel[0].created_date;
            deletemodel.created_by = oldmodel[0].created_by;
            deletemodel.updated_date = now;
            deletemodel.updated_by = global.user.username;
            deletemodel.status = true;

            var model = new pendonorModel(deletemodel);

            global.dbo.collection('t_pendonor').findOneAndUpdate
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
module.exports = PendonorController;