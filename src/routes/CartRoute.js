const express = require("express");

const router = express.Router();

const { updateCart, deleteCart } = require("../controllers/CartController");
//const {deleteCartAtCustomer} = require("../controllers/CustomerController")
router.put("/:cartId", updateCart);
router.delete("/:customerId/:cartId", deleteCart);



module.exports = router;