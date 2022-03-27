// Import thư viện Moogoose
const mongoose = require("mongoose");

// Sử dụng phép gán phá hủy cấu trúc đối tượng để lấy thuộc tính Schema của mongoose
const { Schema } = mongoose;

// Khởi tạo OrderDetail Schema MongoDB
const orderDetailSchema = new Schema({
    _id: Schema.Types.ObjectId, // Trường _id có kiểu dữ liệu ObjectID

    order: {
        type: String
    },
    product: {
        type: String
    },
    quantity: {
        type: Number,
        default: 0
    },
    priceEach: {
        type: Number
    }
})

//Tạo OrderDetail Model
const OrderDetailModel = mongoose.model("OrderDetail", orderDetailSchema);

//Export Course Model
module.exports = { OrderDetailModel };