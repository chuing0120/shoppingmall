var express = require('express');
var async = require('async');
var router = express.Router();

router.get('/', function(req, res, next) {
    var products = [];
    var sql = "SELECT id, name, description, category, price " +
               "FROM products.products";
    pool.getConnection(function(err, connection){
        if(err) {
            next(err);
        } else {
            connection.query(sql, function(err, rows, fields) {
                if (err) {
                    connection.release();
                    next(err);
                } else {
                    connection.release();
                    async.each(rows, function(row, callback) {
                        var product = {
                            "id": row['id'],
                            "name": row['name'],
                            "description": row['description'],
                            "category": row['category'],
                            "price": row['price']
                        };
                        products.push(product);
                        callback();
                    }, function(err) {
                        if(err) {
                            next(err);
                        } else {
                            res.json(products);
                        }
                    });
                }
            });
        }
    });
});

module.exports = router;