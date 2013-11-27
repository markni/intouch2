
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'inTouch 2 Alpha v 0.1.2' });
};