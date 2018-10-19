'use strict';

const Response = require('../config/response')
const ObjectID = require('mongodb').ObjectID;
const menuModel = require('../models/m_menu.model');
const roleModel = require('../models/m_role.model');

const valRoleMenu = {
    checkMenuRole : (req, res, next) => {
        // var id_role = req.params.id_role;

        // if(nama_client == null){
        //     Response.send(res, 403, "You are not authorized");
        // }else{
            global.dbo.collection('m_role').aggregate(
                    {
                    $lookup:
                    {
                      from : "m_menu_access",
                      localField : "_id",
                      foreignField : "id_role",
                      as : "role_lookup"
                    }
                  },
                  {
                    $unwind : "$role_lookup"
                  },
                  {
                    $lookup:
                    {
                      from : "m_menu",
                      localField : "role_lookup.id_menu",
                      foreignField : "_id",
                      as : "menu_lookup"
                    }
                  },
                  {
                    $unwind : "$menu_lookup"
                  },
                  //{
                  //  $group : 
                  //  {
                  //    _id : "$menu_lookup.id_menu"
                  //  }
                  //},
                  {
                      $match :
                      {
                          '_id' : ObjectID(id_role)
                      }
                  },
                  {
                    $project:
                    {
                     'id_role' : "$_id",
                     'nama_role' : "$role",
                     'id_menu' : "$menu_lookup._id",
                     'nama_menu' : "$menu_lookup.menu_name"
                    }
                  }
                //   {
                //     $match : { nama_role : "Staff" }
                , (err, data) => {
                if(data){
                    // let doc = {
                    //     message : "existing",
                    //     content : { "_id" : ObjectID(data._id), "nama" : data.nama_client }
                    // };
                    Response.send(res, 200, data);
                    next();
                }else{
                    Response.send(res, 200, "not exist");
                }
            });
    },
};

module.exports = valRoleMenu;