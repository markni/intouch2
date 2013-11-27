var crypto = require('crypto');
var Bangumi = require('bangumi');
var options = {
    app_id: "itouch"
};
var b = new Bangumi(options);

var private_key = 'noblesseoblige';   //TODO: move the to config file

function encrypt(text, key) {
    var cipher = crypto.createCipher('aes-256-cbc', key)
    var crypted = cipher.update(text, 'utf8', 'hex')
    crypted += cipher.final('hex');
    return crypted;
}

function decrypt(text, key) {
    var decipher = crypto.createDecipher('aes-256-cbc', key)
    var dec = decipher.update(text, 'hex', 'utf8')
    dec += decipher.final('utf8');
    return dec;
}


exports.user = function (req, res) {
    var auth = req.headers['authorization'];
    if (!auth) {

        res.statusCode = 401; // Force them to retry authentication
        res.json({error_code: 401, error_msg: 'wrong pass'});
    }
    else {
        var encoded = auth.split(' ');
        var buf = new Buffer(encoded[1], 'base64')
        var plain_auth = buf.toString();

        var creds = plain_auth.split(':');      // split on a ':'
        var username = decrypt(creds[0], private_key);
        var a = decrypt(creds[1], private_key);
        //get user profile
        b.user(username, function (err, data) {

            if (!err && data && data.code != "401") {
                res.statusCode = 200;
                res.json(data);
            }
            else {

                res.statusCode = 401; // Force them to retry authentication
                res.json({error_code: 401, error_msg: 'wrong pass'});
            }
        })
    }

}

exports.getCollection = function (req, res) {
    var auth = req.headers['authorization'];
    if (!auth) {

        res.statusCode = 401; // Force them to retry authentication
        res.json({error_code: 401, error_msg: 'wrong pass'});
    }
    else {
        var encoded = auth.split(' ');
        var buf = new Buffer(encoded[1], 'base64')
        var plain_auth = buf.toString();

        var creds = plain_auth.split(':');      // split on a ':'
        var username = decrypt(creds[0], private_key);
        if (username) {
            b.collectionByUser(username, {cat: 'watching'}, function (err, data) {

                if (!err && data && data.code != "401") {
                    res.statusCode = 200;
                    res.json(data);
                }
                else {
                    res.statusCode = 401; // Force them to retry authentication
                    res.json({error_code: 401, error_msg: 'wrong pass'});

                }
            })
        }
        else {
            res.statusCode = 401; // Force them to retry authentication
            res.json({error_code: 401, error_msg: 'need login'});
        }
    }


}

exports.demo = function (req, res) {
    b.auth({username: 'nodebangumi', password: 'node-bangumi'}, function (err, data) {

        if (!err && data && data.code != "401") {
            res.statusCode = 200;
            data.auth = encrypt(data.auth, private_key);
            data.username = encrypt(data.username, private_key);
            res.json(data);
        }
        else {
            res.statusCode = 401; // Force them to retry authentication
            res.json({error_code: 401, error_msg: 'wrong pass'});

        }
    })

}


exports.updateTo = function (req, res) {

    //TODO: repeative parts, need wrap in a seperated function

    if (req.params['id'] && req.params['epnum']) {


        var auth = req.headers['authorization'];
        if (!auth) {

            res.statusCode = 401; // Force them to retry authentication
            res.json({error_code: 401, error_msg: 'wrong pass'});
        }
        else {
            var encoded = auth.split(' ');
            var buf = new Buffer(encoded[1], 'base64')
            var plain_auth = buf.toString();

            var creds = plain_auth.split(':');      // split on a ':'
            var username = decrypt(creds[0], private_key);
            var a = decrypt(creds[1], private_key);
            b.updateEps(req.params['id'], {auth: a, watched_eps: req.params['epnum']}, function (err, data) {

                if (!err && data && data.code == "202") {
                    res.statusCode = 200;
                    res.json(data);
                }
                else {

                    res.statusCode = 401; // Force them to retry authentication
                    res.json({error_code: 401, error_msg: 'wrong pass'});
                }


            })

        }
    }
    else {
        res.statusCode = 404; // Force them to retry authentication
        res.json({error_code: 404, error_msg: 'invalid url'});
    }

}

exports.login = function (req, res) {


    var auth = req.headers['authorization'];
    if (!auth) {
        res.statusCode = 401; // Force them to retry authentication
        res.json({error_code: 401, error_msg: 'wrong pass'});
    }
    else {
        var encoded = auth.split(' ');
        var buf = new Buffer(encoded[1], 'base64');
        var plain_auth = buf.toString();

        var creds = plain_auth.split(':');      // split on a ':'
        var username = creds[0];
        var password = creds[1];

        b.auth({username: username, password: password}, function (err, data) {

            if (!err && data && data.code != "401") {
                res.statusCode = 200;
                data.auth = encrypt(data.auth, private_key);
                data.username = encrypt(data.username, private_key);

                res.json(data);
            }
            else {
                res.statusCode = 401; // Force them to retry authentication

                res.json({error_code: 401, error_msg: 'wrong pass'});

            }
        })

    }


};