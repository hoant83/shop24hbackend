// Import thư viện mongoose
const mongoose = require('mongoose');

// Phép gán phá hủy cấu trúc đối tượng để lấy thuộc tính Schema của mongoose
const { Schema } = mongoose;

// Khởi tạo Cart Schema MongoDB 
const cartSchema = new Schema({
    // Trường _id có kiểu dữ liệu ObjectID
    _id: Schema.Types.ObjectId,
    
    productId: {
        type: String,
        required: false
    },
    
    amount: {
        type: Number,
        required: false
    },
    price: {
        type: Number,
        required: false
    },
    name: {
        type: String,
        required: false
    },
    imgUrl: {
        type: String,
        required: false
    },
    isChecked: {
        type: Boolean,
        default: false,
        required: false
    }
});

// Tạo Model cho MongoDB từ Schema vừa khai báo
const CartModel = mongoose.model('Cart', cartSchema);

// Export model vừa tạo dưới dạng module
module.exports = { CartModel };
