const mongoose = require("mongoose");
// Sử dụng phép gán phá hủy cấu trúc đối tượng để lấy thuộc tính Schema của mongoose
const { Schema } = mongoose;
const { ProductModel } = require("../models/ProductModel");

function createProduct (request, response) {
    const product = new ProductModel({
        _id: mongoose.Types.ObjectId(),
        name: request.body.name,
        type: request.body.type,
        imageUrl: request.body.imageUrl,
        buyPrice: request.body.buyPrice,
        promotionPrice: request.body.promotionPrice,
        description: request.body.description,
        buyPrice: request.body.buyPrice,
    });

    product.save()
        .then((newProduct) => {
            return response.status(200).json({
                message: "Success",
                product: newProduct
            })
        })
        .catch((error) => {
            return response.status(500).json({
                message: "Fail",
                error: error.message
            })
        })
}
function getAllProducts (request, response) {
    var condition = {}
    if(request.query.name) {
        condition.name = {
            $regex: request.query.name
        }
    }
    if(request.query.priceMin || request.query.priceMax) {
        condition.buyPrice = {
            $gt: request.query.priceMin || 0,
            $lt: request.query.priceMax || 1000000
        }
    }
    if(request.query.valueSelected != "none" && request.query.valueSelected != undefined) {
        condition.type = {
            $regex: request.query.valueSelected
        }
    }
    ProductModel.find(condition).skip(request.query.skip).limit(request.query.limit)
        .select("name type imageUrl buyPrice promotionPrice description timeCreated timeUpdated") // chọn các phần tử muốn lấy
        .then((productsList) => {
            return response.status(200).json({
                message: "Success",
                limit: request.query.limit,
                skip: request.query.skip,
                products: productsList
            })
        })
        .catch((error) => {
            return response.status(500).json({
                message: "Fail",
                error: error.message
            })
        })
}

function getProductById(request, response) {
    // Lấy productId từ params URL
    const productId = request.params.productId;

    // Kiểm tra xem productId có phải ObjectID hay không 
    if (mongoose.Types.ObjectId.isValid(productId)) {
        ProductModel.findById(productId)
            .then((data) => {
                if (data) {
                    return response.status(200).json({
                        message: "Success",
                        product: data
                    })
                } else {
                    return response.status(404).json({
                        message: "Fail",
                        error: "Not found"
                    })
                }
            })
            .catch((error) => {
                return response.status(500).json({
                    message: "Fail",
                    error: error.message
                })
            })

    } else {
        // Nếu không phải ObjectID thì trả ra lỗi 400 - Bad request
        return response.status(400).json({
            message: "Fail",
            error: "ProductID is not valid"
        })
    }
}

function updateProductByID(request, response) {
    // Lấy productId từ params URL
    const productId = request.params.productId;
    // Khởi tạo Product Schema MongoDB
    var updateObject = request.body; // phải để var để có thể thay đổi được
    Object.assign(updateObject, {timeUpdated: new Date()}); // thêm vào updateObject 1 đối tượng timeUpdated

    // Kiểm tra xem productId có phải ObjectID hay không 
    if (mongoose.Types.ObjectId.isValid(productId)) {
        ProductModel.findByIdAndUpdate(productId, updateObject)
            .then((updatedObject) => {
                return response.status(200).json({
                    message: "Success",
                    updatedObject: updatedObject
                })
            })
            .catch((error) => {
                return response.status(500).json({
                    message: "Fail",
                    error: error.message
                })
            })
    } else {
        // Nếu không phải ObjectID thì trả ra lỗi 400 - Bad request
        return response.status(400).json({
            message: "Fail",
            error: "ProductId is not valid"
        })
    }
}

function deleteProductByID(request, response) {
    // Lấy productId từ params URL
    const productId = request.params.productId;

    // Kiểm tra xem productId có phải ObjectID hay không 
    if (mongoose.Types.ObjectId.isValid(productId)) {
        ProductModel.findByIdAndDelete(productId)
            .then((data) => {
                return response.status(204).json({
                    message: "Success",
                    data: data
                })
                
            })
            .catch((error) => {
                return response.status(500).json({
                    message: "Fail",
                    error: error.message
                })
            })
    } else {
        // Nếu không phải ObjectID thì trả ra lỗi 400 - Bad request
        return response.status(400).json({
            message: "Fail",
            error: "productId is not valid"
        })
    }
}

module.exports = { createProduct, getAllProducts, getProductById, updateProductByID, deleteProductByID }