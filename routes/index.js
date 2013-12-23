
/*
 * GET home page.
 */

exports.index = function(req, res){
  var v = {version:'0.1.4-7'};
  //grunt-version fails to work with grunt-bumpx
  res.render('index', { title: 'inTouch'});
};