const mongoose = require('mongoose');
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');

const userModel = require('./db/models/User'); // Import user model
const jwtToken = require('./jwt.js');

var http = require('http');
var Session = require('express-session');
var google = require('googleapis').google;
var OAuth2 = google.auth.OAuth2;
var plus = google.plus('v1');
var config = require('./config.json');
const ClientId = config.googleCredentials.clientId;
const ClientSecret = config.googleCredentials.clientSecret;
const RedirectionUrl = "http://localhost:6001/oauth/callback";

let mongoDB = "mongodb://127.0.0.1:27017/googleOauth"; // This is mondodb connection url. googleOauth is the database name

mongoose.connect(mongoDB, { useNewUrlParser: true } ); // This will connect to mondogb.

mongoose.Promise = global.Promise; // This will convert mongoose to return promises instead of callback procedure.

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

let app = express(); // Create express app
app.use(bodyParser.json());

app.listen('6001');
app.use('/static', express.static('../static'));
app.use('/api/*', function (req, res, next) {
    if (!req.headers['authorization']) {
        return res.status(400).send({'error': 'Auth token required'});
    }
    return jwtToken.verifyJWT(req.headers['authorization']).then(function (decoded) {
        req.decoded = decoded;
        next();
    }).catch(function (reason) {
        return res.status(401).send({"error": "You are not authorized to access this URL!"});
    });
});

//using session in express
app.use(Session({
    secret: '1234432-random-secret-19890913007',
    resave: true,
    saveUninitialized: true
}));

app.post('/api/createuser', function (req, res) {
    if(!req.body.emailId) {
        return res.status(400).send({'error': 'Missing mandatory fields!'});
    }
    return userModel.create({
        emailId: req.body.emailId
    }).then(function (user) {
        return res.status(200).send(user);
    }).catch(function (reason) { // If any error occurs in creating entry in mongodb.
        if (reason.code === 11000) { // This error code represents violation of unqiue  constraint.
            return res.status(400).send({error: 'Email already exists!'});
        }
        return res.status(400).send({error: 'Something went wrong!'});
    });
});

app.post('/public/api/createJWT', function (req, res) {
    if(!req.body.emailId) {
        return res.status(400).send({'error': 'Missing mandatory fields!'});
    }
    return userModel.getByMailId(req.body.emailId).then(function (user) {
        jwtToken.createJWT({user: user._id, emailId: user.emailId}).then(function (token) {
            return res.status(200).send({token: token});
        }).catch(function (e) {
            return res.sendStatus(403);
        });
    });
});

app.get('/public/api/getURI', function (req, res) {
    var url = getAuthUrl();
    return res.status(200).send({url: url});
});

app.get('/api/getProfile', function (req, res) {
    return userModel.getByMailId(req.decoded.emailId).then(function (user) {
        return res.status(200).send({userInfo: user.userInfo, mail: user.emailId});
    }).catch(function (reason) { return res.sendStatus(403); });
});

function getOAuthClient () {
    return new OAuth2(ClientId ,  ClientSecret, RedirectionUrl);
}

function getAuthUrl () {
    var oauth2Client = getOAuthClient();
    // generate a url that asks permissions for Google+ and Google Calendar scopes
    var scopes = [
        'https://www.googleapis.com/auth/plus.me email'
    ];

    var url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes // If you only need one scope you can pass it as string
    });

    return url;
}

app.get("/api/getAllUsers", function (req, res) {
   return userModel.getAll().then(function (data) {
      return res.status(200).send(data);
   }).catch(function (reason) { return res.sendStatus(403); });
});

app.use("/oauth/callback", function (req, res) {
    var oauth2Client = getOAuthClient();
    var session = req.session;
    var code = req.query.code; // the query param code
    oauth2Client.getToken(code, function(err, tokens) {
        // Now tokens contains an access_token and an optional refresh_token. Save them.
        if(!err) {
            oauth2Client.setCredentials(tokens);
            //saving the token to current session
            session["tokens"]=tokens;
            var p = new Promise(function (resolve, reject) {
                plus.people.get({ userId: 'me', auth: oauth2Client }, function(err, response) {
                    resolve(response || err);
                });
            }).then(function (data) {
                if (data && data.data  && data.data.emails) {
                    var mail = data.data.emails[0].value;
                    var userInfo = {
                        firstName: data.data.name.givenName,
                        lastName: data.data.name.familyName,
                        gender: data.data.gender
                    };
                    if (data.data.occupation) {
                        userInfo.occupation = data.data.occupation;
                    }
                    return userModel.getByMailId(mail).then(function (user) {
                        if (user) {
                            return userModel.updateUserInfo(userInfo, mail).then(function () {
                                return jwtToken.createJWT({user: user._id, emailId: user.emailId}).then(function (token) {
                                    return res.redirect('../static/dashboard.html?token=' + token);
                                }).catch(function (e) {
                                    return res.sendStatus(403);
                                });
                            });

                        } else {
                            res.status(400).send({'error': 'Email ID not yet whitelisted.'});
                        }
                    }).catch(function (reason) {
                        res.status(400).send(reason);
                    });
                } else {
                    res.status(400).send({'error': 'Authorization failed'});
                }

            });
        }
        else{
            res.send('EmailID not yet whitelisted.');
        }
    });
});
