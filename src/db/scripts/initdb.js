const User = require('../schema/User'); // Import user model
const Promise = require('bluebird');
const mongoose = require('mongoose');
const _ = require('lodash');

let mongoDB = "mongodb://127.0.0.1:27017/darwinbox"; // This is mondodb connection url. darwinbox is the database name

mongoose.connect(mongoDB, { useNewUrlParser: true } ); // This will connect to mondogb.

mongoose.Promise = global.Promise; // This will convert mongoose to return promises instead of callback procedure.

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


var emails = ['aparna.sharma@tresmlabs.com', 'appu.2410@gmail.com']; //add default addresses here

var users = [];
_.map(emails, function (email) {
    users.push(new User({
        emailId: email
    }));
});
User.insertMany(users, function(error, docs) {
    if(error) {
        console.log("Error in whitlisting Emails")
    } else {
        console.log("Emails whitelisted successfully!");
    }
    db.close();
});
