//try and error playground functions.
var async = require('async');

var Bangumi = require('bangumi');
var options = {
	app_id: "intouch"
};
var b = new Bangumi(options);

var fs = require("fs");

var directors = [];
var chardesigners = [];
var composers = [];
var scriptwriters = [];
var productions = [];
var originals = [];
var seiyus = [];

//$('a.l').filter(function(index,el,array){return $(el).attr('href').search('subject')!=-1}).map(function(i,el){return $(el).attr('href').replace('/subject/','')});
var arr = [52606, 85204, 72942, 74628, 79228, 55703, 82572, 56116, 80787, 72946, 77480, 86072, 68756, 73828, 80864, 79802, 87113, 89511, 85557, 80838, 83869, 79350, 77170, 85558, 69103, 80548, 87718, 83124, 48880, 81847, 88039, 59035, 84081, 87625, 43523, 78919, 77188, 84493, 88348];
var test = [72942]

async.map(arr, function (item, callback) {

	b.subject(item, {responseGroup: "medium", a: "a"}, function (err, data) {
		callback(err, data);
	});

}, function (err, results) {

	_build_staffs(results);
	_build_seiyus(results);

	var data = {};
	data.directors = directors;
	data.chardesigners = chardesigners;
	data.composers = composers;
	data.scriptwriters = scriptwriters;
	data.productions = productions;
	data.originals = originals;
	data.seiyus = seiyus;
	data.subjects = results;

	fs.writeFile('../public/' + '/' + '201401' + '.json', JSON.stringify(data), function (err) {

		return console.log(err);
	});

})

var _build_eps = function (data) {
	var eps_map = {};
	data.forEach(function (el, i, arr) {
		if (el && el.eps && el.staff.length > 0) {
			el.staff.forEach(function (s) {

				staff_map[s.id] = {'name': s.name, 'jobs': s.jobs};

			});
		}

	})
}

var _build_seiyus = function (data) {
	var seiyu_map = {};
	data.forEach(function (el) {
		if (el && el.crt && el.crt.length > 0) {
			var local_seiyus = [];
			el.crt.forEach(function (c) {
				if (c.actors && c.actors.length > 0) {
					c.actors.forEach(function (a) {
						seiyu_map[a.id] = {'name': a.name};
						local_seiyus.push({id: a.id, name: a.name})
					})
				}

			});
			el.seiyus = local_seiyus;
		}

	})

	for (var key in seiyu_map) {
		seiyus.push({id: key, name: seiyu_map[key].name})

	}

}

var _build_staffs = function (data) {
	var staff_map = {};
	data.forEach(function (el) {
		if (el && el.staff && el.staff.length > 0) {
			el.staff.forEach(function (s) {
				staff_map[s.id] = {'name': s.name, 'name_cn': s.name_cn, 'jobs': s.jobs};

			});
		}

	})

	//build array for angular repeater

	for (var key in staff_map) {
		staff_map[key].jobs.forEach(function (job) {

			switch (job) {
				case "导演":
					directors.push({id: key, name: staff_map[key].name, name_cn: staff_map[key].name_cn});
					break;
				case "人物设定":
					chardesigners.push({id: key, name: staff_map[key].name, name_cn: staff_map[key].name_cn});
					break;
				case "音乐":
					composers.push({id: key, name: staff_map[key].name, name_cn: staff_map[key].name_cn});
					break;
				case "系列构成":
					scriptwriters.push({id: key, name: staff_map[key].name, name_cn: staff_map[key].name_cn});
					break;
				case "动画制作":
					productions.push({id: key, name: staff_map[key].name, name_cn: staff_map[key].name_cn});
					break;
				case "原作":
					originals.push({id: key, name: staff_map[key].name, name_cn: staff_map[key].name_cn});
					break;

				default:
					break;
			}

		});


	}



};
