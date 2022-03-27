const express = require("express"); // Tương ứng với import express from 'express'
const mongoose = require("mongoose"); // Tương ứng với import mongoose from 'mongoose'

const productRouter = require("./src/routes/ProductRoute");
const customerRouter = require("./src/routes/CustomerRoute");
const orderRouter = require("./src/routes/OrderRoute");
const orderDetailRouter = require("./src/routes/OrderDetailRoute");
const cartRouter = require("./src/routes/CartRoute");
const app = express();

// Khai báo body lấy tiếng Việt
app.use(express.urlencoded({
    extended: true
}))
//Khai báo body dạng JSON
app.use(express.json());

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();     
});

const port = 8000;

// Kết nối với MongoDB
async function connectMongoDB() {
    await mongoose.connect("mongodb://localhost:27017/CRUD_Shop24h");
}

//Thực thi kết nối
connectMongoDB()
    .then(() => console.log("Connect MongoDB Successfully"))
    .catch(err => console.log(err))
    
app.get("/", (request, response) => {
    response.json({
        message: "CRUD Shop24h API"
    })
})

app.use("/products", productRouter);
app.use("/customers", customerRouter);
app.use("/orders", orderRouter);
app.use("/orderDetails", orderDetailRouter);
app.use("/carts", cartRouter);


app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})