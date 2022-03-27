const express = require("express");

const router = express.Router();

const { createProduct, getAllProducts, getProductById, updateProductByID, deleteProductByID } = require("../controllers/ProductController");

router.post("/", createProduct);

router.get("/", getAllProducts);

router.get("/:productId", getProductById);
router.put("/:productId", updateProductByID);
router.delete("/:productId", deleteProductByID);

// // /users/:userId/orders - Create Order
// router.post('/:userId/orders', createOrder);
// // /users/:userId/orders - Get all order of user
// router.get('/:userId/orders', getAllOrderOfUser);

module.exports = router;