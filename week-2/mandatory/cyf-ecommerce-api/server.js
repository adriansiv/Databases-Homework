const express = require("express");
const app = express();
const { Pool } = require('pg');

app.use(express.json());

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'cyf-ecommerce-api',
    password: 'adrian260769',
    port: 5432
});
//------------ GET --------------//
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

app.get("/orders", function(req, res) {
    pool.query('SELECT * FROM orders', (error, result) => {
        res.json(result.rows);
    });
});

app.get("/order_items", function(req, res) {
    pool.query("SELECT * FROM order_items", (error, result) => {
        res.json(result.rows);
    });
});

app.get("/products/:productId", function(req, res) {
    const productId = req.params.productId;
    
    pool.query(`SELECT * FROM products WHERE id=${productId}`, (error, result) => {
        res.json(result.rows);
    });
});


// ----------- DELETE ----------- //
app.delete("/products/:productId", (req, res) => {
    const productId = req.params.productId;
    
    pool.query(`DELETE FROM products WHERE id=${productId} RETURNING *`).then(response => res.json(response.rows))
    .catch(err => console.error("Error executing query", err.stack));
});

app.delete("/order_items", (req, res) => {
    pool
        .query(`DELETE FROM order_items RETURNING *`)
        .then(response => res.json(response.rows))
        .catch(err => console.error('Error executing query', err.stack));
}); 

app.put("/products/:productId", (req, res) => {
    const productId = req.params.productId;
    console.log(req.body)
    const product_name = req.body.product_name;
    const unit_price = req.body.unit_price;
    const supplier_id = req.body.supplier_id;

    pool
        .query(`
        UPDATE products SET product_name='${product_name}', unit_price=${unit_price}, supplier_id=${supplier_id} WHERE id=${productId};`)
        .then(response => res.json(response.rows))
        .catch(err => console.error('Error executing query', err.stack))
});



// ----------- WEEK 3 ------------- // 
// - Update the previous GET endpoint `/products` to filter the list of products by name using a query parameter, for example `/products?name=Cup`. This endpoint should still work even if you don't use the `name` query parameter! //

app.get("/products", function(req, res) {
    const name = req.query.name;
    pool.query(`SELECT * from products WHERE product_name='${name}';`)
    .then(response => res.json(response.rows))
    .catch(err => console.error("Error executing query", err.stack));
});

// - Add a new GET endpoint `/customers/:customerId` to load a single customer by ID. //

app.get("/customers/:customerId", function(req, res) {
    const customerId = req.params.customerId;
    
    pool.query(`SELECT * FROM customers WHERE id=${customerId}`, (error, result) => {
        res.json(result.rows);
    });
});

// - Add a new POST endpoint `/customers` to create a new customer. //

app.post("/customers", (req, res) => {
    const name = req.body.name;
    const address = req.body.address;
    const city = req.body.city;
    const country = req.body.country;

    pool
        .query(`INSERT INTO customers (name, address, city, country)VALUES ('${name}', '${address}', '${city}', '${country}') RETURNING *;`)
        .then(response => res.json(response.rows))
        .catch(err => console.error('Error executing query', err.stack));
});

// - Add a new POST endpoint `/products` to create a new product (with a product name, a price and a supplier id). Check that the price is a positive integer and that the supplier ID exists in the database, otherwise return an error. //

app.post("/products", (req, res) => {    
    const product_name = req.body.product_name;
    const unit_price = req.body.unit_price;
    const supplier_id = req.body.supplier_id;
    

    if (!Number.isInteger(unit_price) || unit_price <= 0) {
        return res
          .status(400)
          .send(`The unit price of products should be a positive integer.`);
      }
      if (supplier_id) {
          return res
          .status(400)
          .send("The Supplier ID should exists.")
      }
    pool
        .query(`INSERT INTO products (product_name, unit_price, supplier_id)VALUES ('${product_name}', ${unit_price}, ${supplier_id}) RETURNING *;`)
        .then(response => res.json(response.rows))
        .catch(err => console.error('Error executing query', err.stack));
}); 

// - Add a new POST endpoint `/customers/:customerId/orders` to create a new order (including an order date, and an order reference) for a customer. Check that the customerId corresponds to an existing customer or return an error. //
app.post("/customers/:customerId/orders", (req, res) => {
    const customerId = req.params.customerId;
    const order_date = req.body.order_date;
    const order_reference = req.body.order_reference;
    let query = `INSERT INTO orders (order_date, order_reference, customer_id) VALUES ('${order_date}', '${order_reference}', ${customerId}) RETURNING *`;

    if(customerId) {
        return query = `INSERT INTO orders (order_date, order_reference, customer_id) VALUES ('${order_date}', '${order_reference}', ${customerId}) RETURNING *`
    }

    pool
        .query(query)
        .then(response => res.json(response.rows))
        .catch(err => console.error('Error executing query', err.stack));
});


// - Add a new PUT endpoint `/customers/:customerId` to update an existing customer (name, address, city and country). //

app.put("/customers/:customerId", (req, res) => {
    const customerId = req.params.customerId;
    const name = req.body.name;
    const address = req.body.address;
    const city = req.body.city;
    const country = req.body.country;

    pool
        .query(`
        UPDATE customers SET name='${name}', address='${address}', city='${city}', country = '${country}' WHERE id=${customerId} RETURNING *;`)
        .then(response => res.json(response.rows))
        .catch(err => console.error('Error executing query', err.stack))
});
// - Add a new DELETE endpoint `/orders/:orderId` to delete an existing order along all the associated order items. //
app.delete("/orders/:orderId", (req, res) => {
    const orderId = req.params.orderId;

    pool
        .query("DELETE FROM orders WHERE id=$1 RETURNING *;", [orderId])
        .then(response => res.json(response.rows))
        .catch(err => console.error('Error executing query', err.stack));
});
// - Add a new DELETE endpoint `/customers/:customerId` to delete an existing customer only if this customer doesn't have orders. //

app.delete("/customers/:customerId", (req, res) => {
    const customerId = req.params.customerId;
    
    pool
        .query(`DELETE FROM customers WHERE id=${customerId} RETURNING *;`)
        .then(response => res.json(response.rows))
        .catch(err => console.error("Error executing query", err.stack));
});
// - Add a new GET endpoint `/customers/:customerId/orders` to load all the orders along the items in the orders of a specific customer. Especially, the following information should be returned: order references, order dates, product names, unit prices, suppliers and quantities. //
app.get("/customers/:customerId/orders", (req, res) => {
    const customerId = req.params.customerId;

    pool.query("select o.order_reference, o.order_date, p.product_name, p.unit_price, s.supplier_name, oi.quantity from customers c inner join orders o on o.customer_id = c.id inner join order_items oi on o.id = oi.order_id inner join products p on p.id = oi.product_id inner join suppliers s on s.id = p.supplier_id where c.id = $1;", [customerId])
    .then(response => res.json(response.rows))
    .catch(err => console.error("Error executing query", err.stack));
})

app.listen(3000, function() {
    console.log("Server is listening on port 3000. Ready to accept requests!");
});