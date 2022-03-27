const mongoose = require("mongoose");
// Sử dụng phép gán phá hủy cấu trúc đối tượng để lấy thuộc tính Schema của mongoose
const { Schema } = mongoose;
const { CustomerModel } = require("../models/CustomerModel");
const {CartModel} = require("../models/CartModel")
function createCustomer (request, response) {
    const customer = new CustomerModel({
        _id: mongoose.Types.ObjectId(),
        fullName: request.body.fullName,
        phoneNumber: request.body.phoneNumber,
        email: request.body.email,
        address: request.body.address,
        city: request.body.city,
        country: request.body.country,
    });

    customer.save()
        .then((newCustomer) => {
            return response.status(200).json({
                message: "Success",
                customer: newCustomer
            })
        })
        .catch((error) => {
            return response.status(500).json({
                message: "Fail",
                error: error.message
            })
        })
}
function getAllCustomers (request, response) {
    var condition = {}
    if(request.query.fullName) {
        condition.fullName = {
            $regex: request.query.fullName
        }
    }
    if(request.query.phoneNumber) {
        condition.phoneNumber = {
            $regex: request.query.phoneNumber
        }
    }
    if(request.query.email) {
        condition.email = {
            $regex: request.query.email
        }
    }
    CustomerModel.find(condition)
        .select("fullName phoneNumber email address city country carts timeCreated timeUpdated") // chọn các phần tử muốn lấy
        .then((customersList) => {
            return response.status(200).json({
                message: "Success",
                customers: customersList,
            })
        })
        .catch((error) => {
            return response.status(500).json({
                message: "Fail",
                error: error.message
            })
        })
}

function getCustomerById(request, response) {
    // Lấy customerId từ params URL
    const customerId = request.params.customerId;
    // Kiểm tra xem customerId có phải ObjectID hay không 
    if (mongoose.Types.ObjectId.isValid(customerId)) {
        CustomerModel.findById(customerId)
            .then((data) => {
                if (data) {
                    return response.status(200).json({
                        message: "Success",
                        customer: data
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
            error: "CustomerID is not valid"
        })
    }
}
// hàm tìm customer by email để kiểm tra việc login
function getCustomerByEmail(request, response) {
    // Lấy customerEmail từ params URL
    var condition = {};
    condition.email = {
        $regex: request.params.email
    }
    CustomerModel.find(condition)
        .select("fullName phoneNumber email address city country carts timeCreated timeUpdated") // chọn các phần tử muốn lấy
        .then((data) => {
            if (data != null && data != [] && data != "" && data != undefined) {
                return response.status(200).json({
                    message: "Success",
                    customer: data
                })
            } else {
                return response.status(200).json({
                    message: "Not found",
                    customer: null
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

function updateCustomerByID(request, response) {
    // Lấy customerId từ params URL
    const customerId = request.params.customerId;

    // Khởi tạo Customer Schema MongoDB
    var updateObject = request.body; // phải để var để có thể thay đổi được
    Object.assign(updateObject, {timeUpdated: new Date()}); // thêm vào updateObject 1 đối tượng timeUpdated

    // Kiểm tra xem customerId có phải ObjectID hay không 
    if (mongoose.Types.ObjectId.isValid(customerId)) {
        CustomerModel.findByIdAndUpdate(customerId, updateObject)
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
            error: "CustomerId is not valid"
        })
    }
}

function deleteCustomerByID(request, response) {
    // Lấy customerId từ params URL
    const customerId = request.params.customerId;

    // Kiểm tra xem customerId có phải ObjectID hay không 
    if (mongoose.Types.ObjectId.isValid(customerId)) {
        CustomerModel.findByIdAndDelete(customerId)
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
            error: "customerId is not valid"
        })
    }
}

module.exports = { createCustomer, getAllCustomers, getCustomerById, updateCustomerByID, deleteCustomerByID, getCustomerByEmail }