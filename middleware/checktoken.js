'use strict';

const Response = require('../config/response');

// JSON Web Token
const jwt = require('jsonwebtoken');
const secret = require('../config/token');

const AuthMiddleware = {
    checkToken : (req, res, next) => {
        console.log(req.headers); //headers? karena get. nanti token di taruh di key
        var token = req.headers.authorization;

        if(token == null){
            Response.send(res, 403, "You are not authorized");
        }else{
            jwt.verify(token, secret.secretkey, (err, decrypt) =>{
                if(decrypt != undefined){
                    req.usedata = decrypt;
                    global.user = decrypt;
                    next();
                }else{
                    Response.send(res, 403, 'You are not authorized')
                }
            });
        }
    },

    checkTokenAndRole : (req, res, next) => {
        console.log(req.headers); //headers? karena get. nanti token di taruh di key
        var token = req.headers.authorization;

        if(token == null){
            Response.send(res, 403, "You are not authorized");
        }else{
            jwt.verify(token, secret.secretkey, (err, decrypt) =>{
                if(decrypt != undefined){
                    if(decrypt.rolename == 'admin'){
                        req.usedata = decrypt;
                        global.user = decrypt;
                        next();
                    }else{
                        Response.send(res, 403, 'You are not authorized because you role is not ADMIN')
                    }
                }else{
                    Response.send(res, 403, 'You are not ADMIN')
                }
            });
        }
    }
};

module.exports = AuthMiddleware;