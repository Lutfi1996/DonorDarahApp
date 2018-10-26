'use strict';

function model (entity)
{
    this._id            =   entity._id;
    this.nama_lengkap    =   entity.nama_lengkap;
    this.no_ktp          =   entity.no_ktp;
    this.tanggal_lahir     =   entity.tanggal_lahir;
    this.alamat   =   entity.alamat;
    this.jenis_kelamin   =   entity.jenis_kelamin;
    this.no_telp   =   entity.no_telp;
    this.tanggal_donor   =   entity.tanggal_donor;
    this.status_donor   =   entity.status_donor;
    this.id_goldarah   =   entity.id_goldarah;
    this.created_date   =   entity.created_date;
    this.created_by     =   entity.created_by;
    this.updated_date   =   entity.updated_date;
    this.updated_by     =   entity.updated_by;
    this.status         =   entity.status;
}

model.prototype.getData = function()
{
    return {
        _id : this._id,
        nama_lengkap    :   this.nama_lengkap,
        no_ktp          :   this.no_ktp,
        tanggal_lahir   : this.tanggal_lahir,
        alamat          : this.alamat,
        jenis_kelamin   : this.jenis_kelamin,
        no_telp         : this.no_telp,
        tanggal_donor   : this.tanggal_donor,
        status_donor    : this.status_donor,
        id_goldarah     : this.id_goldarah,
        created_date    : this.created_date,
		created_by      : this.created_by,
		updated_date    : this.updated_date,
		updated_by      : this.updated_by,
        status          : this.status
    };
};

module.exports = model;