const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let UserSchema = new Schema({
    emailId: {
        type: String,
        required: true,
        max: 100,
        unique: true
    },
    userInfo: {type: mongoose.Schema.Types.Mixed}
}, {
    timestamps: true
});

module.exports = mongoose.model('User', UserSchema);
