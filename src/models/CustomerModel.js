// Import thư viện Moogoose
const mongoose = require("mongoose");

// Sử dụng phép gán phá hủy cấu trúc đối tượng để lấy thuộc tính Schema của mongoose
const { Schema } = mongoose;

// Khởi tạo Customer Schema MongoDB
const customerSchema = new Schema({
    _id: Schema.Types.ObjectId, // Trường _id có kiểu dữ liệu ObjectID

    fullName: {
        type: String,
        required: false,
        default: ""
    },
    phoneNumber: {
        type: String,
        required: false,
        default: ""
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        type: String,
        required: false,
        default: ""
    },
    city: {
        type: String,
        required: false,
        default: ""
    },
    country: {
        type: String,
        required: false,
        default: ""
    },
    timeCreated: {
        type: Date,
        default: Date.now
    },
    timeUpdated: {
        type: Date,
        default: Date.now
    },
    carts: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Cart'
        }
    ]

})

//Tạo Customer Model
const CustomerModel = mongoose.model("Customer", customerSchema);

//Export Course Model
module.exports = { CustomerModel };