var jwt = require('jsonwebtoken');
var DEFAULT_SECRET = '32jhgdu-3e5e-4512-b8ef-71c0643f330f';

function createJWT(payload) {
    return new Promise(function (resolve, reject) {
        jwt.sign(payload, DEFAULT_SECRET, {}, function (err, token) {
            if (err) {
                reject(err);
            }
            resolve(token);
        });
    });

}

function verifyJWT(token) {
    return new Promise(function (resolve, reject) {
        try {
            jwt.verify(token, DEFAULT_SECRET, function (err, decoded) {
                if (err) {
                    reject(err);
                }

                resolve(decoded);
            });
        } catch (e) {
            reject(e);
        }
    });

}

module.exports.createJWT = createJWT;
module.exports.verifyJWT = verifyJWT;