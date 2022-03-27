// Import thư viện Moogoose
const mongoose = require("mongoose");

// Sử dụng phép gán phá hủy cấu trúc đối tượng để lấy thuộc tính Schema của mongoose
const { Schema } = mongoose;

// Khởi tạo Order Schema MongoDB
const orderSchema = new Schema({
    _id: Schema.Types.ObjectId, // Trường _id có kiểu dữ liệu ObjectID

    customer: {
        type: String
    },
    orderDate: {
        type: Date,
        default: Date.now
    },
    requiredDate: {
        type: Date,
        default: Date.now
    },
    shippedDate: {
        type: Date,
        default: Date.now
    },
    note: {
        type: String,
        required: false
    },
    status: {
        type: Number,
        required: false,
        default: 0
    },
    orderDetails: [
        {
            type: Schema.Types.ObjectId,
            ref: 'OrderDetail'
        }
    ],
    timeCreated: {
        type: Date,
        default: Date.now
    },
    timeUpdated: {
        type: Date,
        default: Date.now
    },

})

//Tạo Order Model
const OrderModel = mongoose.model("Order", orderSchema);

//Export Course Model
module.exports = { OrderModel };