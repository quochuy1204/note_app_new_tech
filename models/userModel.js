const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, "Please enter your name."],
        trim: true
    },
    email: {
        type: String,
        trim: true,
        required: [true, "Please enter your email."],
        unique: true
    },
    password: {
        type: String,
        trim: true,
        required: [true, "Please enter your password."]
    },
    role: {
        type: Number,
        default: 0 //0 = user , 1 = admin
    },
    avatar: {
        type: String,
        default: "https://res.cloudinary.com/hcm-city-university-of-education-and-technology/image/upload/v1609006598/avatar/avarta-developer_z4mnjl.png"
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Users', userSchema);