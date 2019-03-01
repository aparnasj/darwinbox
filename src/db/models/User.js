const Promise = require('bluebird');
const User = require('../schema/User');

let create = function (user_details) {
    let user = new User(user_details);
    return user.save();
};

let getAll = function () {
    return User.find({}).then(function (users) {
        return Promise.resolve(users);
    }).catch(function (e) {
        return Promise.resolve(null);
    });
};

let getByMailId = function (emailId) {
    return User.findOne({emailId: emailId}).then(function (user) {
        return Promise.resolve(user);
    }).catch(function (e) {
        return Promise.resolve(null);
    });
};

let updateUserInfo = function (userInfo, mail) {
    return User.findOneAndUpdate(
        {
            emailId: mail  // search query
        },
        {
            $set: {userInfo: userInfo},   // field:values to update
        },
        {
            new: true,                       // return updated doc
            runValidators: true              // validate before update
        })
        .then(function (data) {
            return Promise.resolve(data);
        }).catch(function (reason) {
            return Promise.reject(reason)
        });

};

module.exports.create = create;
module.exports.getAll = getAll;
module.exports.getByMailId = getByMailId;
module.exports.updateUserInfo = updateUserInfo;