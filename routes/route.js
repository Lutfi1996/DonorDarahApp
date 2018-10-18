'use strict';

var winston = require('../config/winston');
var morgan = require('morgan');
var client = require('../controllers/m_client');
var user = require('../controllers/m_user');
var role = require('../controllers/m_role');
var pendonor = require('../controllers/t_pendonor');
var middleware = require('../middleware/checktoken');
var validasi = require('../controllers/validate');
// Import Restify Module
const restify = require('restify');

module.exports = exports = function(server){
    //CORS (Cross Origin Resource sharing) => sudah ada lib di restify
    var corsMiddleware = require('restify-cors-middleware');
    var cors = corsMiddleware({
        origin : ['*'], //annonymous
        allowHeaders : ['authorization'] // mengikuti yg ada di check token
    });

    server.pre(cors.preflight);
    server.use(cors.actual);

    //client route
    server.get('/api/client/', middleware.checkToken, client.GetAll);  //bebas
    server.get('/api/client/:id', middleware.checkToken, client.GetAllByID);
    server.post('/api/client/insert', middleware.checkToken, client.CreatedClient);
    server.put('/api/client/update/:id', middleware.checkToken, client.UpdateClient);
    server.del('/api/client/delete/:id', middleware.checkToken, client.DeleteClient)

    //User Route
    server.post('/api/user/login', user.Login); // post? karena kita akan mengirimkan un dan psswd
    server.get('/api/user/logout', middleware.checkToken, user.Logout);
    server.get('/api/user/', middleware.checkToken, user.GetAllUser);
    server.get('/api/user/:id', middleware.checkToken, user.GetAllById);
    server.post('/api/user/insert', middleware.checkTokenAndRole, user.CreateUser);
    server.put('/api/user/update/:id', middleware.checkToken, user.UpdateUser);
    server.put('/api/user/delete/:id', middleware.checkToken, user.DeleteUser);
    

    //Role Route
    server.get('/api/role/', middleware.checkToken, role.GetAllRole);
    server.get('/api/role/:id', middleware.checkToken, role.GetRoleById);
    server.post('/api/role/insert', middleware.checkToken, role.CreateRole);
    server.put('/api/role/update/:id', middleware.checkToken, role.UpdateRole);
    server.del('/api/role/delete/:id', middleware.checkToken, role.DeleteRole);

    //Pendonor Route
    server.get('/api/pendonor/', middleware.checkToken, pendonor.GetAll);
    server.get('/api/pendonor/:id', middleware.checkToken, pendonor.GetAllById);
    server.post('/api/pendonor/insert', middleware.checkToken, pendonor.CreatePendonor);
    server.put('/api/pendonor/update/:id', middleware.checkToken, pendonor.UpdatePendonor);
    server.del('/api/pendonor/delete/:id', middleware.checkToken, pendonor.DeletePendonor);

    // Validate Route
    // Client
    server.get('/api/validate/checkclient/:name', validasi.checkClient);
    server.get('/api/validate/checkrole/:name', validasi.checkRoleName);



    // error handler
    server.use(function(err, req, res, next) {
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};

        winston.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

        if (err.name === 'UnauthorizedError') {
            res.status(401).json({ status: 0, code: 401, type: "unauthorised", message: err.name + ": " + err.message });
        } else {
            res.status(404).json({ status: 0, code: 404, type: "ENOENT", message: "file not found" });
        }

        res.status(err.status || 500);
        res.render('error');
    });

    server.use(morgan('combined', { stream: winston.stream }));
};