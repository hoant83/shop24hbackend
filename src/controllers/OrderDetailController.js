const mongoose = require("mongoose");
// Sử dụng phép gán phá hủy cấu trúc đối tượng để lấy thuộc tính Schema của mongoose
const { Schema } = mongoose;
const { OrderDetailModel } = require("../models/OrderDetailModel");
const { ProductModel } = require("../models/ProductModel");
const { OrderModel } = require("../models/OrderModel");

var productList = []
const getArrayProduct = () => {
    ProductModel.find({})
    .then(productLists => {
        productList = productLists
    })
    .catch(error => {
      console.log({ error })
    })
  };
getArrayProduct();

function createOrderDetail (request, response) {
    const orderDetail = new OrderDetailModel({
        _id: mongoose.Types.ObjectId(),
        order: request.params.orderId,
        product: request.params.productId,
        quantity: request.body.quantity,
        priceEach: request.body.priceEach
    });

    orderDetail.save()

        // Sau khi tạo orderDetail thành công
        .then(function(newOrderDetail) {
            // Lấy orderId từ params URL (Khác với Query URL (sau ?))
            var orderId = request.params.orderId;
            // Gọi hàm OrderModel .findOneAndUpdate truyền vào điều kiện (_id = ?) và thêm _id của order mới tạo vào mảng orderDetails
            return OrderModel.findOneAndUpdate({ _id: orderId }, {$push: {orderDetails: newOrderDetail._id}}, { new: true });
        })
        // Sau khi update order thành công trả ra status 200 - Success
        .then((updatedOrder) => {
            return response.status(200).json({
                success: true,
                message: 'New Order created successfully on Order',
                order: updatedOrder,
            });
        })
        .catch((error) => {
            return response.status(500).json({
                message: "Fail",
                error: error.message
            })
        })
}

// Get all order of user 
function getAllOrderDetailOfOrder(req, res) {
    // Lấy orderId từ params URL (Khác với Query URL (sau ?))
    var orderId = req.params.orderId;

    // Gọi hàm .findById để tìm kiếm order dựa vào ID
    OrderModel.findById(orderId)
        // Lấy chi tiết Order dựa vào ánh xạ _id của từng phần tử trong trường orders
        .populate({path: 'orderDetails'})
        // Nếu thành công trả ra status 200 - Success
        .then((singleOrder) => {
            res.status(200).json({
                success: true,
                Order: singleOrder
            });
        })
        // Xử lý lỗi trả ra 500 - Server Internal Error
        .catch((err) => {
            res.status(500).json({
                success: false,
                message: 'This order does not exist',
                error: err.message,
            });
        });
}

function getOrderDetailById(request, response) {
    // Lấy orderDetailId từ params URL
    const orderDetailId = request.params.orderDetailId;

    // Kiểm tra xem orderDetailId có phải ObjectID hay không 
    if (mongoose.Types.ObjectId.isValid(orderDetailId)) {
        OrderDetailModel.findById(orderDetailId)
            .then((data) => {
                if (data) {
                    return response.status(200).json({
                        message: "Success",
                        orderDetail: data
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
            error: "orderDetailId is not valid"
        })
    }
}

function updateOrderDetailByID(request, response) {
    // Lấy orderDetailId từ params URL
    const orderDetailId = request.params.orderDetailId;

    var updateObject = request.body; // phải để var để có thể thay đổi được
    // Kiểm tra xem orderDetailId có phải ObjectID hay không 
    if (mongoose.Types.ObjectId.isValid(orderDetailId)) {
        OrderDetailModel.findByIdAndUpdate(orderDetailId, updateObject)
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
            error: "orderDetailId is not valid"
        })
    }
}

function deleteOrderDetailByID(request, response) {
    // Lấy orderDetailId từ params URL
    const orderDetailId = request.params.orderDetailId;

    // Kiểm tra xem orderDetailId có phải ObjectID hay không 
    if (mongoose.Types.ObjectId.isValid(orderDetailId)) {
        OrderDetailModel.findByIdAndDelete(orderDetailId)
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
            error: "orderDetailId is not valid"
        })
    }
}

module.exports = { createOrderDetail, getAllOrderDetailOfOrder, getOrderDetailById, updateOrderDetailByID, deleteOrderDetailByID }