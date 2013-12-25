
/*
 * GET home page.
 */

exports.index = function(req, res){
  var v = {version:'2.2.0-15'};
  //grunt-version fails to work with grunt-bumpx
  res.render('index', { title: 'inTouch'});
};