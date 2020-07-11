const fs = require('fs');
const path = require('path');

const productosFilePath = path.join(__dirname, '../data/productsDataBase.json');
const productos = JSON.parse(fs.readFileSync(productosFilePath, 'utf-8'));

const controller = {
	index: (req, res) => {
		res.render('index', {
			productos: productos
		});
	},
	productoDetalle: (req, res) => {
		res.render('producto_detalle', {
			productos: products
		});
	},	
	carrito: (req, res) => {
		res.render('carrito', {
			productos: productos
		});
	}
};

module.exports = controller;
