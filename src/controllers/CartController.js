// Import thư viện mongoose JS
const mongoose = require('mongoose');

// Import Customer Model
const { CustomerModel } = require('../models/CustomerModel');
// Import Cart Model
const { CartModel } = require('../models/CartModel');

// Create Cart
function createCart(req, res) {
     // Khởi tạo một đối tượng CartModel  mới truyền các tham số tương ứng từ request body vào
    const cart = new CartModel({
        // Thuộc tính _id - Random một ObjectID
        _id: mongoose.Types.ObjectId(),
        // Thuộc tính productId
        productId: req.body.productId,
        // Thuộc tính amount
        amount: req.body.amount,
        price: req.body.price,
        name: req.body.name,
        imgUrl: req.body.imgUrl
    });

    // Gọi hàm cart save - là 1 promise (Tiến trình bất đồng bộ)
    cart.save()
        // Sau khi tạo cart thành công
        .then(function(newCart) {
            // Lấy customerId từ params URL (Khác với Query URL (sau ?))
            var customerId = req.params.customerId;

            // Gọi hàm CustomerModel .findOneAndUpdate truyền vào điều kiện (_id = ?) và thêm _id của cart mới tạo vào mảng carts
            return CustomerModel.findOneAndUpdate({ _id: customerId }, {$push: {carts: newCart._id}}, { new: true });
        })
        // Sau khi update course thành công trả ra status 200 - Success
        .then((updatedCustomer) => {
            return res.status(200).json({
                success: true,
                message: 'New cart created successfully on Customer',
                Customer: updatedCustomer,
            });
        })
        // Xử lý lỗi trả ra 500 - Server Internal Error
        .catch((error) => {
            res.status(500).json({
                success: false,
                message: 'Server error. Please try again.',
                error: error.message,
            });
        });
}

// Get all cart of customer 
function getAllCartOfCustomer(req, res) {
    // Lấy customerId từ params URL (Khác với Query URL (sau ?))
    var customerId = req.params.customerId;

    // Gọi hàm .findById để tìm kiếm customer dựa vào ID
    CustomerModel.findById(customerId)
        // Lấy chi tiết cart dựa vào ánh xạ _id của từng phần tử trong trường carts
        .populate({path: 'carts'})
        // Nếu thành công trả ra status 200 - Success
        .then((singleCustomer) => {
            res.status(200).json({
                success: true,
                message: `Success`,
                Carts: singleCustomer
            });
        })
        // Xử lý lỗi trả ra 500 - Server Internal Error
        .catch((err) => {
            res.status(500).json({
                success: false,
                message: 'This customer does not exist',
                error: err.message,
            });
        });
}
// // hàm tìm carts by productID để kiểm tra xem product đã có tồn tại trong cart hay chưa
// function getCartByProductId(request, response) {
//     // Lấy customerEmail từ params URL
//     var condition = {};
//     condition.email = {
//         $regex: request.params.email
//     }
//     CustomerModel.find(condition)
//         .select("fullName phoneNumber email address city country timeCreated timeUpdated") // chọn các phần tử muốn lấy
//         .then((data) => {
//             if (data != null && data != [] && data != "" && data != undefined) {
//                 return response.status(200).json({
//                     message: "Success",
//                     customer: data
//                 })
//             } else {
//                 return response.status(200).json({
//                     message: "Not found",
//                     customer: null
//                 })
//             }
//         })
//         .catch((error) => {
//             return response.status(500).json({
//                 message: "Fail",
//                 error: error.message
//             })
//         })
// }

// // Get all review
// function getAllReview(req, res) {
//     ReviewModel.find()
//         .select('_id stars note')
//         .then((allReview) => {
//             return res.status(200).json({
//                 success: true,
//                 message: 'A list of all review',
//                 Review: allReview,
//             });
//         })
//         .catch((err) => {
//             res.status(500).json({
//                 success: false,
//                 message: 'Server error. Please try again.',
//                 error: err.message,
//             });
//         });
// }

// // Get single review
// function getSingleReview(req, res) {
//     const id = req.params.reviewId;

//     ReviewModel.findById(id)
//         .then((singleReview) => {
//             res.status(200).json({
//                 success: true,
//                 message: `Get data on Review`,
//                 Review: singleReview,
//             });
//         })
//         .catch((err) => {
//             res.status(500).json({
//                 success: false,
//                 message: 'This review does not exist',
//                 error: err.message,
//             });
//         });
// }

// update cart
function updateCart(req, res) {
    const cartId = req.params.cartId;
    const updateObject = req.body;
    CartModel.findByIdAndUpdate(cartId, updateObject)
        .then(() => {
            res.status(200).json({
                success: true,
                message: 'Cart is updated',
                updateCart: updateObject,
            });
        })
        .catch((err) => {
            res.status(500).json({
                success: false,
                message: 'Server error. Please try again.'
            });
        });
}


function deleteCart(request, response) {
    const cartId = request.params.cartId;

    if (mongoose.Types.ObjectId.isValid(cartId)) {
        CartModel.findByIdAndDelete(cartId)
            .then(() => {
                // Lấy courseId từ params URL (Khác với Query URL (sau ?))
                var customerId = request.params.customerId;

                // Gọi hàm CourseModel .findOneAndUpdate truyền vào điều kiện (_id = ?) và thêm _id của review mới tạo vào mảng reviews
                return CustomerModel.findOneAndUpdate({ _id: customerId }, { $pull: { carts: cartId} }, { new: true });
            })
            .then(() => {
                return response.status(200).json({
                    message: 'delete data by id success',
                })
            })
            .catch((error) => {
                return response.status(500).json({
                    message: 'delete data by id fail',
                    error: error.message
                })
            })
    }
    else {
        // Nếu không phải objectId thì trả ra lỗi 400 - bad request
        response.status(400).json({
            message: "fail",
            error: "cart Id is not valid"
        })
    }
}

module.exports = { createCart, getAllCartOfCustomer, updateCart, deleteCart }
