
/*
 * GET users listing.
 */

exports.login = function(req, res){
    res.render('login');
};

exports.logout = function(req, res){
    res.render('logout');
};

exports.home = function(req, res){
    res.render('home');
};