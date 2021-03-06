var async = require('async');
var crypto = require('crypto');
var Bangumi = require('bangumi');
var options = {
	app_id: "intouch"
};
var b = new Bangumi(options);

var private_key = 'noblesseoblige';   //TODO: move the to config file

function encrypt(text, key) {
	var cipher = crypto.createCipher('aes-256-cbc', key);
	var crypted = cipher.update(text, 'utf8', 'hex');
	crypted += cipher.final('hex');
	return crypted;
}

function decrypt(text, key) {
	var decipher = crypto.createDecipher('aes-256-cbc', key);
	var dec = decipher.update(text, 'hex', 'utf8');
	dec += decipher.final('utf8');
	return dec;
}

exports.user = function (req, res) {
	var auth = req.headers['authorization'];
	if (!auth && !req.params['username']) {

		res.statusCode = 401; // Force them to retry authentication
		res.json({error_code: 401, error_msg: 'wrong pass'});
	}
	else {
		var username;
		if (req.params['username']) {
			username = req.params['username'];
		}
		else {
			var encoded = auth.split(' ');
			var buf = new Buffer(encoded[1], 'base64');
			var plain_auth = buf.toString();

			var creds = plain_auth.split(':');      // split on a ':'
			username = decrypt(creds[0], private_key);

		}

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

};

exports.getCollection = function (req, res) {
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
		var username = decrypt(creds[0], private_key);
		if (username) {
			b.collectionByUser(username, {cat: 'watching'}, function (err, data) {

				if (!err && data && data.code != "401") {
					res.statusCode = 200;
					//console.log(JSON.stringify(data));
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

};

exports.progress = function (req, res) {
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
		var username = decrypt(creds[0], private_key);
		var a = decrypt(creds[1], private_key);
		if (username) {
			b.progress(username, {auth: a}, function (err, data) {

				if (!err && data && data.code != "401") {
					res.statusCode = 200;
					//console.log(JSON.stringify(data));
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

};

exports.getCollectionSubject = function (req, res) {
	var auth = req.headers['authorization'];
	if (!auth || req.params['id'] === undefined) {

		res.statusCode = 401; // Force them to retry authentication
		res.json({error_code: 401, error_msg: 'wrong pass'});
	}
	else {
		var encoded = auth.split(' ');
		var buf = new Buffer(encoded[1], 'base64');
		var plain_auth = buf.toString();

		var creds = plain_auth.split(':');      // split on a ':'
		var username = decrypt(creds[0], private_key);
		var a = decrypt(creds[1], private_key);
		if (username) {
			b.collectionBySubject(req.params['id'], {auth: a}, function (err, data) {

				if (!err && data && data.code != "401") {
					res.statusCode = 200;
					//console.log(JSON.stringify(data));
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

};

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

};

exports.updateTo = function (req, res) {

	//TODO: repeating parts, need wrap in a seperated function

	if (req.params['id'] && req.params['epnum']) {

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

};

exports.updateEps = function (req, res) {

	if (req.body && req.body.eps && req.params['id'] && req.params['cmd']) {


		var auth = req.headers['authorization'];
		if (!auth) {

			res.statusCode = 401; // Force them to retry authentication
			res.json({error_code: 401, error_msg: 'wrong pass'});
		}
		else {
			var cmd = req.params['cmd'];
			var eps =  req.body.eps;

			var encoded = auth.split(' ');
			var buf = new Buffer(encoded[1], 'base64');
			var plain_auth = buf.toString();
			var creds = plain_auth.split(':');      // split on a ':'
			var username = decrypt(creds[0], private_key);
			var a = decrypt(creds[1], private_key);

			if (cmd === "batch_update"){
				var max =-1;
				for (var key in eps){
					if (eps[key]>=max){
						max=eps[key];
					}
				}

				b.updateEps(req.params['id'], {auth: a, watched_eps: max}, function (err, data) {

					if (!err && data && data.code == "202" || data.code == "400") {
						res.statusCode = 200;
						res.json(data);
					}

					else {

						res.statusCode = 401; // Force them to retry authentication
						res.json({error_code: 401, error_msg: 'wrong pass'});
					}

				})
			}

			else{
				var ep_ids = [];
				for (var key in eps){
					ep_ids.push(key);
				}

				//do multiple async http requests here, once for each ep

				async.map(ep_ids, function (id, callback) {

					b.updateEp(id, cmd, {auth:a}, function (err, data) {

						if (!err && data && data.code != "401") {
							callback(err, data);
						}
						else {
							err = '401';
							callback(err, data);

						}
					})

				}, function (err, data) {

					if (!err) {
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
	}
	else {
		res.statusCode = 404; // Force them to retry authentication
		res.json({error_code: 404, error_msg: 'invalid url'});
	}

}

exports.updateStatus = function (req, res) {

	if (req.body && req.body.subjects && req.params['status']) {

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
			var username = decrypt(creds[0], private_key);
			var a = decrypt(creds[1], private_key);

			var subjects = req.body.subjects; //array
			var status = req.params['status'];

			//do multiple async http requests here, once for each subject

			async.map(subjects, function (item, callback) {

				var options = {status: status, auth: a};

				if (req.body.comment !== undefined) {
					options['comment'] = req.body.comment;
				}
				if (req.body.tags !== undefined) {
					options['tags'] = req.body.tags;
				}
				if (req.body.rating !== undefined) {
					options['rating'] = req.body.rating;
				}

				b.createCollection(item, options, function (err, data) {

					if (!err && data && data.code != "401") {
						callback(err, data);
					}
					else {
						err = '401';
						callback(err, data);

					}
				})

			}, function (err, data) {

				if (!err) {
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

};

exports.search = function (req, res) {

	if (req.params['q']) {
		var keywords = decodeURI(req.params['q']);

		async.series([
			//search only anime and drama, then combine the two results.
			function (callback) {
				b.search(keywords, {'type': 2, 'max_results': 10}, function (err, data) {
					callback(null, data);    //TODO: fix bug in bangumi API where empty search result in not returned in json. Use null for error for now
				})

			},
			function (callback) {
				b.search(keywords, {'type': 6, 'max_results': 10}, function (err, data) {
					callback(null, data);
				})
			}
		],

			function (err, results) {
				if (!err) {
					var result = '';
					var count = 0;
					// if both anime and drama has results, concat the results
					if (results[0].list && results[1].list) {
						result = results[0].list.concat(results[1].list);
					}

					//otherwise if either one has results, use it
					else if (results[0].list) {
						result = results[0].list;
					}
					else if (results[1].list) {
						result = results[1].list;
					}
					else {
						result = [];
					}

					//resort the result since the API search is horrible,
					// if the original title has a direct word match, give it higher rank
					result.sort(function (a, b) {

						var num_of_match_a = a.name.search(new RegExp(req.params['q'], 'gi'));
						var num_of_match_b = b.name.search(new RegExp(req.params['q'], 'gi'));
//                        console.log( num_of_match_a, num_of_match_b);
						// if two titles have even amount of matches, compare their translated titles
						if (num_of_match_a === num_of_match_b && a.name_cn && b.name_cn) {
							return b.name_cn.search(new RegExp(req.params['q'], 'gi')) - a.name_cn.search(new RegExp(req.params['q'], 'gi'));
						}
						return num_of_match_b - num_of_match_a;

					});

//                    console.log(JSON.stringify(result));
					res.statusCode = 200;
					res.json({list: result});
				}
				else {
					res.statusCode = 404;
					res.json({error_code: 404, error_msg: 'invalid url'});
				}

			});

	}
	else {

		res.statusCode = 404;
		res.json({error_code: 404, error_msg: 'invalid url'});

	}

};

exports.schedule = function (req, res) {
	b.calendar(function (err, data) {
		if (!err && data) {

			var items = [];
			for (var i = 0; i < data.length; i++) {
				for (var x = 0; x < data[i].items.length; x++) {

					//use 0 for sunday instead of 7, matches getDay() format

					if (data[i].items[x].air_weekday === 7) {
						data[i].items[x].air_weekday = 0;
					}

					items.push(data[i].items[x]);

				}
			}

			res.json(items);

		}

		else {
			res.statusCode = 404;
			res.json({error_code: 404, error_msg: 'invalid url'});
		}

	})
}

exports.subject = function (req, res) {

	if (req.params['id']) {

		b.subject(req.params['id'], {responseGroup: 'large'}, function (err, data) {
//            console.log(data);
			res.statusCode = 200;

			res.json(data);

		})

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