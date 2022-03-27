const express = require("express");

const router = express.Router();

const {getOrderDetailById, updateOrderDetailByID, deleteOrderDetailByID} = require("../controllers/OrderDetailController")

router.get("/:orderDetailId", getOrderDetailById);

router.put("/:orderDetailId", updateOrderDetailByID);

router.delete("/:orderDetailId", deleteOrderDetailByID);

module.exports = router;