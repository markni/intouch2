
/*
 * GET home page.
 */

exports.index = function(req, res){
  var v = {version:'0.1.4-5'};
  //grunt-version fails to work with grunt-bumpx
  res.render('index', { title: 'inTouch 2 Alpha v'+ v.version.split('-')[0]+' build '+(parseInt(v.version.split('-')[1])+1) });
};