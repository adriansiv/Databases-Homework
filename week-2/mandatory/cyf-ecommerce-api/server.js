const express = require("express");
const app = express();
const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'cyf-ecommerce-api',
    password: 'adrian260769',
    port: 5432
});

app.get("/", function(req, res) {
    res.send("Hello, world!");
});

app.get("/customers", function(req, res) {
    pool.query('SELECT * FROM customers', (error, result) => {
        res.json(result.rows);
    });
});
app.get("/suppliers", function(req, res) {
    pool.query('SELECT * FROM suppliers', (error, result) => {
        res.json(result.rows);
    });
});

app.get("/products", function(req, res) {
    pool.query('SELECT * FROM products p INNER JOIN suppliers s ON s.id = p.supplier_id', (error, result) => {
        res.json(result.rows);
    });
});

app.listen(3000, function() {
    console.log("Server is listening on port 3000. Ready to accept requests!");
});