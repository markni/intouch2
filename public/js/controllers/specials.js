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

	$scope.getImage = function (subject) {
		return {'background-image': 'url(' + subject.images.large + ')'};

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

		if (typeof $scope.search != 'undefined' && $scope.search !== "" && (subject.name.search($scope.search) >= 0 || subject.name_cn.search($scope.search) >= 0)) {
			flag = 1;
		}

		if (!flag && $scope.pinned[subject.id]) {
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
		if (!flag && subject.seiyus && subject.seiyus.length > 0) {
			for (var i = 0; i < subject.seiyus.length; i++) {
				if ($scope.selected[subject.seiyus[i].id]) {

					if (_test_ep_length(subject.eps)) {
						flag = 1;
						break;
					}
				}
			}
		}


		return !!flag;


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
			$scope.pinned[subject.id] = {name: subject.name, name_cn: subject.name_cn};
		}

		try {

			localStorage.special_pinned = JSON.stringify($scope.pinned);
		}
		catch (err) {

		}
	}



	$scope.isLogin = function(){

		var islogin = false;
		try {
		   if(localStorage.auth ){
			   islogin = true;
		   }

		}catch(err){

		}
		return islogin;
	}

	$scope.addAllToWatchList = function () {

		var status = 'do';

		var ids = [];
		for (var key in $scope.pinned) {
			ids.push(key);
		}



		$http({method: 'POST', url: '/api/subjects/update_status/' + status, data: {"subjects": ids}}).
			success(function (data, status) {
				$location.path("/");

			}).
			error(function (data, status) {
				if (status === 401) {
					$location.path("/login");
				}
			});

	}

	$scope.isPinnedEmpty = function () {

		return  Helpers.isEmpty($scope.pinned);

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

	$scope.getAbsUrl = function(){
		return $location.absUrl();
	}


	$scope.getPinnedToString = function () {

	}

	$scope.getShareText = function(){

		var arr = [];
		for (var key in $scope.pinned) {
			if ($scope.pinned[key].name_cn) {
				arr.push($scope.pinned[key].name_cn);
			}
			else if ($scope.pinned[key].name) {
				arr.push($scope.pinned[key].name);

			}

		}




		var index = parseInt(Math.random() * 5);

		return '1月新番决定先追'+arr.length+'部：' + arr.join('，') + ' via '+ ' 『新番筛选姬』 ('+$location.absUrl()+')';

	}


	$scope.getShare = function(){
		$scope.share = true;
		!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document, 'script', 'twitter-wjs');
		(function() {var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;po.src = 'https://apis.google.com/js/platform.js';var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);})();
	}



	//run


	$http({method: 'GET', url: '/201401.json'}).
		success(function (data, status) {

			$scope.directors = data.directors;
			$scope.composers = data.composers;
			$scope.chardesigners = data.chardesigners;
			$scope.scriptwriters = data.scriptwriters;
			$scope.productions = data.productions;
			$scope.originals = data.originals;
			$scope.seiyus = data.seiyus;

			$scope.subjects = data.subjects;



		}).
		error(function (data, status) {

		});







});