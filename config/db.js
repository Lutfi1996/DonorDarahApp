'use strict';

// Load mongo driver
let dbo = null; //krn awalnya tidak ada nilai, akan diisi jika db sudah ada conect atau errornya
const MongoClient = require('mongodb').MongoClient;

const DBConnection = {
    connect : (conn) => {
        MongoClient.connect(global.config.dbconn, {useNewUrlParser : true}, (err, db) => {
            if(!err)
            {
                dbo = db.db(global.config.dbname);
            }
            conn(err, db);
        });
    },
    getconnection : () => {
        return dbo;
    }
};

module.exports = DBConnection;
