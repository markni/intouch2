
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

exports.settings = function(req, res){
    res.render('settings');
};

exports.search = function(req, res){
    res.render('search');
};

exports.bottomMenu = function(req, res){
    res.render('bottom-menu');
};

exports.sideMenu = function(req, res){
    res.render('side-menu');
};

exports.searchBar = function(req,res){
    res.render('search-bar');
}