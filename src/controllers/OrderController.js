const mongoose = require("mongoose");
// Sử dụng phép gán phá hủy cấu trúc đối tượng để lấy thuộc tính Schema của mongoose
const { Schema } = mongoose;
const { OrderModel } = require("../models/OrderModel");

function createOrder (request, response) {
    const order = new OrderModel({
        _id: mongoose.Types.ObjectId(),
        note: request.body.note,
        status: request.body.status,
        // Lấy customerId từ params URL (Khác với Query URL (sau ?))
        customer : request.params.customerId,
    });

    order.save()
        .then((newOrder) => {
            return response.status(200).json({
                message: "Success",
                order: newOrder
            })
        })
        .catch((error) => {
            return response.status(500).json({
                message: "Fail",
                error: error.message
            })
        })
}
function getAllOrders (request, response) {
    var condition = {}
    if(request.query.customerId) {
        condition.customer = {
            $regex: request.query.customerId
        }
    }
    if(request.query.status && request.query.status >= 0) {
        condition.status = {
            $in: parseInt(request.query.status)
        }
        console.log(parseInt(request.query.status))
    }
    
    OrderModel.find(condition)
        .select("_id note status customer orderDate requiredDate shippedDate timeCreated timeUpdated") // chọn các phần tử muốn lấy
        .then((ordersList) => {
            return response.status(200).json({
                message: "Success",
                order: ordersList
            })
        })
        .catch((error) => {
            return response.status(500).json({
                message: "Fail",
                error: error.message
            })
        })
}

function getOrderById(request, response) {
    // Lấy orderId từ params URL
    const orderId = request.params.orderId;

    // Kiểm tra xem orderId có phải ObjectID hay không 
    if (mongoose.Types.ObjectId.isValid(orderId)) {
        OrderModel.findById(orderId)
            .then((data) => {
                if (data) {
                    return response.status(200).json({
                        message: "Success",
                        order: data
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
            error: "OrderID is not valid"
        })
    }
}

function updateOrderByID(request, response) {
    // Lấy orderId từ params URL
    const orderId = request.params.orderId;

    // Khởi tạo Customer Schema MongoDB
    var updateObject = request.body; // phải để var để có thể thay đổi được
    Object.assign(updateObject, {timeUpdated: new Date()}); // thêm vào updateObject 1 đối tượng timeUpdated

    // Kiểm tra xem orderId có phải ObjectID hay không 
    if (mongoose.Types.ObjectId.isValid(orderId)) {
        OrderModel.findByIdAndUpdate(orderId, updateObject)
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
            error: "OrderId is not valid"
        })
    }
}
// hàm tìm order by customerId để lấy danh sách order của 1 customer
function getOrderByCustomerId(request, response) {
    // Lấy customerEmail từ params URL
    var condition = {};
    condition.customer = {
        $regex: request.params.customerId
    }
    OrderModel.find(condition)
        .select("customer orderDate note status orderDetails timeCreated") // chọn các phần tử muốn lấy
        .then((data) => {
            if (data != null && data != [] && data != "" && data != undefined) {
                return response.status(200).json({
                    message: "Success",
                    orders: data
                })
            } else {
                return response.status(200).json({
                    message: "Not found",
                    orders: null
                })
            }
        })
        .catch((error) => {
            return response.status(500).json({
                message: "Fail",
                error: error.message
            })
        })
}

function deleteOrderByID(request, response) {
    // Lấy orderId từ params URL
    const orderId = request.params.orderId;

    // Kiểm tra xem orderId có phải ObjectID hay không 
    if (mongoose.Types.ObjectId.isValid(orderId)) {
        OrderModel.findByIdAndDelete(orderId)
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
            error: "OrderId is not valid"
        })
    }
}

module.exports = { createOrder, getAllOrders, getOrderById, updateOrderByID, deleteOrderByID, getOrderByCustomerId }