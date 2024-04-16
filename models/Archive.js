const mongoose = require('mongoose');

const OrderSchema = mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    userid: {
        type: String,
        required: true
    },
    amount: {
        type: String,
        required: true
    },
    payed: {
        type: Boolean,
        default: false
    },
    shipped: {
        type: Boolean,
        default: false
    },
    info: {
        type: String,
        default: "Awaiting Payment"
    },
    code: {
        type: String,
        required: true
    },
    date: {
        type: String,
        default: Date()
    }
});

module.exports = mongoose.model('archives', OrderSchema);