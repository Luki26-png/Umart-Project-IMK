import express from 'express';

const admin = express.Router()

admin.get('/new-product', (_req, res)=>{
    res.render('admin/tambah_produk.pug');
});

export default admin;