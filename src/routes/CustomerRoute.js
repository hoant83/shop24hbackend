const express = require("express");

const router = express.Router();

const {createCustomer, getAllCustomers, getCustomerById, updateCustomerByID, deleteCustomerByID, getCustomerByEmail } = require("../controllers/CustomerController");
const { createOrder, getAllOrders } = require("../controllers/OrderController");
const { createCart, getAllCartOfCustomer } = require("../controllers/CartController");
router.post("/", createCustomer);

router.get("/", getAllCustomers);

router.get("/:email", getCustomerByEmail);

router.get("/:customerId/getById", getCustomerById);
router.put("/:customerId", updateCustomerByID);
router.delete("/:customerId", deleteCustomerByID);

router.post('/:customerId/orders', createOrder);

router.post("/:customerId/carts", createCart);
router.get("/:customerId/carts", getAllCartOfCustomer);
//router.get('/:customerId/orders/:orderId', getAllOrders);

module.exports = router;