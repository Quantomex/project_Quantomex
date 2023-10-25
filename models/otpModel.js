const mongoose = require('mongoose');

const adminOTPModelSchema = new mongoose.Schema({
  otp: {
    type: String,
    required: true,
  },
});

const AdminOTP = mongoose.model('AdminOTP', adminOTPModelSchema);

module.exports = AdminOTP;
