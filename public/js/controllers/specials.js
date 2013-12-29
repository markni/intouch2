app.controller('specialsCtrl', function ($translate, $scope, Auth, $http, $location, Helpers, $timeout) {

	$scope.selected = {};
	$scope.share = false;
	$scope.pinned = {};
	$scope.ep_selected = "dontcare";
	$scope.eps = [
		{id: "seasonly", "name": "季番"},
		{id: "half-yearly", "name": "半年番"},
		{id: "yearly", "name": "年番"},
		{id: "dontcare", "name": "无所谓"}
	];

	try {

		if (localStorage.special_selected) {
			$scope.selected = JSON.parse(localStorage.special_selected);
		}
		if (localStorage.special_pinned) {
			$scope.pinned = JSON.parse(localStorage.special_pinned);
		}

		if (localStorage.special_ep_selected) {
			$scope.ep_selected = localStorage.special_ep_selected;
		}

	}
	catch (err) {

	}

	$scope.isEpSelected = function (ep_id) {
		return $scope.ep_selected == ep_id;
	}

	$scope.setEpSelection = function (ep_id) {
		$scope.ep_selected = ep_id;
		try {
			localStorage.special_ep_selected = $scope.ep_selected;
		} catch (err) {

		}

	}

	$scope.getImage = function(subject){
		return {'background-image':'url('+subject.images.large+')'};

	}

	$scope.filterFn = function (subject) {

		var flag = 0;

		var _test_ep_length = function (eps) {
			if ($scope.ep_selected == "seasonly") {
				return (eps > 5 && eps < 20);
			}
			else if ($scope.ep_selected == "half-yearly") {
				return (eps > 19 && eps < 45);
			}
			else if ($scope.ep_selected == "yearly") {
				return (eps > 44);
			}

			else {
				return true;
			}
		}


		if(typeof $scope.search != 'undefined' && $scope.search !== "" && (subject.name.search($scope.search)>=0 || subject.name_cn.search($scope.search)>=0)){
			flag = 1;
		}


		if (!flag && $scope.pinned[subject.id]){
			flag = 1;
		}

		// Do some tests
		if (!flag && subject.staff && subject.staff.length > 0) {

			for (var i = 0; i < subject.staff.length; i++) {
				if ($scope.selected[subject.staff[i].id]) {

					if (_test_ep_length(subject.eps)) {
						flag = 1;
						break;
					}

				}
			}
		}


		//
		if (!flag && subject.seiyus && subject.seiyus.length > 0){
			for (var i=0;i<subject.seiyus.length;i++){
				if ($scope.selected[subject.seiyus[i].id]) {

					if (_test_ep_length(subject.eps)) {
						flag = 1;
						break;
					}
				}
			}
		}



		if (!flag) {
			return false;
		}
		else {
			return true;
		}

	};

	$scope.isSelected = function (char_id) {
		if ($scope.selected[char_id]) {
			return true;

		}
		else {
			return false;
		}

	}

	$scope.clear = function () {
		$scope.selected = {};
		$scope.search = "";
		$scope.ep_selected = "dontcare";

		try {

			localStorage.special_selected = JSON.stringify($scope.selected);
			localStorage.special_ep_selected = $scope.ep_selected;
		}
		catch (err) {

		}
	}

	$scope.isPinned = function (id) {
		if ($scope.pinned[id]) {
			return true;

		}
		else {
			return false;
		}

	}

	$scope.togglePinned = function (subject) {
		if ($scope.pinned[subject.id]) {
			delete $scope.pinned[subject.id];

		}
		else {
			$scope.pinned[subject.id] = {name:subject.name,name_cn:subject.name_cn};
		}

		try {

			localStorage.special_pinned = JSON.stringify($scope.pinned);
		}
		catch (err) {

		}
	}

	$scope.getPinnedToString = function(){
		var arr = [];
		for (var key in $scope.pinned){
			if($scope.pinned[key].name_cn){
				arr.push($scope.pinned[key].name_cn);
			}
			else if($scope.pinned[key].name){
				arr.push($scope.pinned[key].name);

			}

		}


		return arr.join('，')
	}


	$scope.toggleSelection = function (char_id) {
		if ($scope.selected[char_id]) {
			delete $scope.selected[char_id];

		}
		else {
			$scope.selected[char_id] = true;
		}

		try {

			localStorage.special_selected = JSON.stringify($scope.selected);
		}
		catch (err) {

		}

	}

	$http({method: 'GET', url: '/201401.json'}).
		success(function (data, status) {


			_build_staffs(data);
			_build_seiyus(data);
			$scope.subjects = data;

			console.log(data);

		}).
		error(function (data, status) {

		});

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

	var _build_seiyus = function(data){
		var seiyu_map = {};
		data.forEach(function (el) {
			if (el && el.crt && el.crt.length > 0) {
				var local_seiyus = [];
				el.crt.forEach(function (c) {
					if (c.actors && c.actors.length> 0){
						c.actors.forEach(function(a){
							seiyu_map[a.id] = {'name': a.name};
							local_seiyus.push({id: a.id, name: a.name})
						})
					}

				});
				el.seiyus = local_seiyus;
			}

		})

		var seiyus = [];

		for (var key in seiyu_map){
			seiyus.push({id: key, name: seiyu_map[key].name})

		}

		$scope.seiyus = seiyus;



		console.log(data);
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

		var directors = [];
		var chardesigners = [];
		var composers = [];
		var scriptwriters = [];
		var productions = [];
		var originals = [];

		for (var key in staff_map) {
			staff_map[key].jobs.forEach(function (job) {

				switch (job) {
					case "导演":
						directors.push({id: key, name: staff_map[key].name,name_cn: staff_map[key].name_cn});
						break;
					case "人物设定":
						chardesigners.push({id: key, name: staff_map[key].name,name_cn: staff_map[key].name_cn});
						break;
					case "音乐":
						composers.push({id: key, name: staff_map[key].name,name_cn: staff_map[key].name_cn});
						break;
					case "系列构成":
						scriptwriters.push({id: key, name: staff_map[key].name,name_cn: staff_map[key].name_cn});
						break;
					case "动画制作":
						productions.push({id: key, name: staff_map[key].name,name_cn: staff_map[key].name_cn});
						break;
					case "原作":
						originals.push({id: key, name: staff_map[key].name,name_cn: staff_map[key].name_cn});

					default:
						break;
				}

			})
			//arr.push({id:key,name:staff_map[key].name})

		}

		$scope.directors = directors;
		$scope.composers = composers;
		$scope.chardesigners = chardesigners;
		$scope.scriptwriters = scriptwriters;
		$scope.productions = productions;
		$scope.originals = originals;

	}

});