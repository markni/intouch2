var Bangumi = require('bangumi');
var options = {
    app_id : "itouch"
};
var b = new Bangumi(options);


exports.login = function(req, res){
   //console.log(req.headers) ;

    var auth = req.headers['authorization'];
    if(!auth){
        res.statusCode = 401; // Force them to retry authentication
        res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"');
        res.json({error:'wrong pass', code: 401});
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
                res.json(data);
            }
            else{
                res.statusCode = 401; // Force them to retry authentication

                res.json({error_code: 401, error_msg: 'wrong pass'});

            }
        })

    }



};