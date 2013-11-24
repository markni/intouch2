var crypto = require('crypto');
var Bangumi = require('bangumi');
var options = {
    app_id : "itouch"
};
var b = new Bangumi(options);

var private_key = 'noblesseoblige';   //TODO: move the to config file

function encrypt(text,key){
    var cipher = crypto.createCipher('aes-256-cbc',key)
    var crypted = cipher.update(text,'utf8','hex')
    crypted += cipher.final('hex');
    return crypted;
}

function decrypt(text,key){
    var decipher = crypto.createDecipher('aes-256-cbc',key)
    var dec = decipher.update(text,'hex','utf8')
    dec += decipher.final('utf8');
    return dec;
}


exports.user = function(req,res){
    var auth = req.headers['authorization'];
    if(!auth){
        console.warn('no auth in header');
        res.statusCode = 401; // Force them to retry authentication
        res.json({error_code: 401, error_msg: 'wrong pass'});
    }
    else{
        var encoded = auth.split(' ');
        var buf = new Buffer(encoded[1], 'base64')
        var plain_auth = buf.toString();
        console.log("Decoded Authorization ", plain_auth);
        var creds = plain_auth.split(':');      // split on a ':'
        var username = decrypt(creds[0],private_key);

        var a = decrypt(creds[1],private_key);
        //get user profile
        b.user(username,function(err,data){
            console.log(username);
            console.log(JSON.stringify(data));
            if (!err && data && data.code != "401"){
                res.statusCode = 200;
                res.json(data);
            }
            else{
                console.warn('data corrupt or something');
                res.statusCode = 401; // Force them to retry authentication
                res.json({error_code: 401, error_msg: 'wrong pass'});
            }
        })
    }

}

exports.demo = function(req,res){
    b.auth({username:'nodebangumi',password:'node-bangumi'},function(err,data){
        console.log(JSON.stringify(data));
        if (!err && data && data.code != "401"){
            res.statusCode = 200;
            data.auth = encrypt(data.auth,private_key);
            data.username = encrypt(data.username,private_key);
            res.json(data);
        }
        else{
            res.statusCode = 401; // Force them to retry authentication
            res.json({error_code: 401, error_msg: 'wrong pass'});

        }
    })

}


exports.login = function(req, res){
   //console.log(req.headers) ;

    var auth = req.headers['authorization'];
    if(!auth){
        res.statusCode = 401; // Force them to retry authentication
        res.json({error_code: 401, error_msg: 'wrong pass'});
    }
    else{
        var encoded = auth.split(' ');
        var buf = new Buffer(encoded[1], 'base64');
        var plain_auth = buf.toString();
        console.log("Decoded Authorization ", plain_auth);
        var creds = plain_auth.split(':');      // split on a ':'
        var username = creds[0];
        var password = creds[1];

        b.auth({username:username,password:password},function(err,data){
            console.log(JSON.stringify(data));
            if (!err && data && data.code != "401"){
                res.statusCode = 200;
                data.auth = encrypt(data.auth,private_key);
                data.username = encrypt(data.username,private_key);
                console.log('!!!!!!')
                console.log(data);
                res.json(data);
            }
            else{
                res.statusCode = 401; // Force them to retry authentication

                res.json({error_code: 401, error_msg: 'wrong pass'});

            }
        })

    }



};