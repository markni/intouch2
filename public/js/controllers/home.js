app.controller('homeCtrl', function ($translate, $scope, Auth, $http, $location, Helpers, $timeout, $rootScope) {
	$scope.server_offline = 0;

	Auth.loadCredentials();

	$scope.timeouts = [];
	$scope.show_all = $rootScope.show_all || false;
	$scope.bot = '/img/shells/' + localStorage.config_bot + '.gif?v=0';
	$scope.paddy = Helpers.paddy;
	$scope.showSideMenu = false;
	$scope.msg = '';
	$scope.selected_items = {};

	$scope.avatar = {};
	$scope.loading = 1;
	$scope.server_offline = 0;


	//toggle the state of the side menu (fly-in and out)
	$scope.toggleSideMenu = function () {
		$scope.showSideMenu = !$scope.showSideMenu;
	}


	//redirect to search page with query in url
	$scope.search = function () {

		if ($scope.keywords) {
			$location.path('/search/' + encodeURI($scope.keywords));
		}
	}

	//display all the subjects
	$scope.showAll = function () {
		$scope.show_all = $rootScope.show_all = true;
	}


	//clear all selected subjects
	$scope.cancelSelected = function () {
		for (var key in $scope.selected_items) {
			$scope.items[key].selected = false;
		}
		$scope.selected_items = {};
	}



	// toggle a subject as selected
	$scope.select = function (i) {

		if ($scope.items[i].selected) {

			$scope.items[i].selected = !$scope.items[i].selected;

		}
		else {
			$scope.items[i].selected = true;
		}


		//save to / remove from selected list

		if ($scope.items[i].selected) {

			$scope.selected_items[i] = $scope.items[i];

		}
		else {
			delete $scope.selected_items[i];

		}

	}


	// display notification / feedback message from bottom nav

	$scope.displayMsg = function (msg) {

		$scope.bot = $scope.bot.replace(/\?v=(.)/, function (match, p1) {
			return '?v=' + (parseInt(p1) === 1 ? 0 : 1);
		});  //reload bot gif animation by hacking src.
		//the original gif src will be xx.gif?v=0; after hack will be xx.gif?v=1; and continue to toggle.
		//in this way, further requests will all get 304 not modified

		for (var i = 0; i < $scope.timeouts.length; i++) {
			$timeout.cancel($scope.timeouts[i]);
		}
		$scope.msg = msg;
		var hide = $timeout(function () {

			$scope.msg = '';
			$scope.$apply();

		}, 3000);
		$scope.timeouts.push(hide);

	}

	// display random message for hints
	$scope.showRandomMsg = function () {

		var msg_list = ["RAN_MSG_1", "RAN_MSG_2", "RAN_MSG_3", "RAN_MSG_4", "RAN_MSG_5"];
		var selected_index = Math.floor(Math.random() * (msg_list.length));
		if (msg_list[selected_index]) {
			$scope.displayMsg($translate(msg_list[selected_index]));
		}
	}


	// update one to multiple subjects status (finished watching , no longer watching etc.)

	$scope.updateStatus = function (status) {
		var targets = $scope.selected_items;
		var ids = [];
		for (var key in targets) {
			ids.push(targets[key].subject.id);
		}

		$http({method: 'POST', url: '/api/subjects/update_status/' + status, data: {"subjects": ids}}).
			success(function (data, status) {

				$scope.selected_items = {};

				var temp_key_array = [];
				for (var key in targets) {
					temp_key_array.push(parseInt(key));
				}
				//get the keys sorted, larger key in the front
				temp_key_array.sort(function (a, b) {
					return b - a
				});

				var len = temp_key_array.length;  // the array length changes when we splice item out of it, make a hard copy.

				for (var i = 0; i < temp_key_array.length; i++) {

					$scope.items.splice(temp_key_array[i], 1);
				}

				$scope.displayMsg($translate('ACTION_COMPLETED', {x: len}));

			}).
			error(function (data, status) {
				if (status === 401) {
					$location.path("/login");
				}
			});

	}


	//batch update a subject to target ep.  (ex. finished watching 1 - 10)

	$scope.updateTo = function (index) {
		var ep_num = $scope.items[index].ep_status + 1;
		var subject_id = $scope.items[index].subject.id;

		$http({method: 'POST', url: '/api/subject/' + subject_id + '/watchedto/' + ep_num}).
			success(function (data, status) {
				$scope.displayMsg($translate('FINISHED_UPDATE_WATCHED_TO', {x: $scope.items[index].ep_status + 1, y: $scope.items[index].subject.name}));
				$scope.items[index].ep_status = $scope.items[index].ep_status + 1;

				//mark dirty, this will need to be re-downloaded.
				delete $rootScope.progress;

			}).
			error(function (data, status) {
				if (status === 401) {
					$location.path("/login");
				}
			});
	}


	// display the original title or translated title base on user config

	$scope.getTitle = function (item) {
		if (localStorage.config_title && localStorage.config_title === 'cn' && item.subject.name_cn) {
			//return item.subject.cn
			return item.subject.name_cn;
		}
		return item.name;

	};


	// get high or low res images for cover art base on user config

	$scope.getCover = function (item) {
		var res;
		if (localStorage.config_iq && localStorage.config_iq === 'high') {
			//return item.subject.cn
			res = item.subject.images.large;
		}
		else {
			res = item.subject.images.medium;
		}
		return {'background-image': 'url(' + res + ')'}
	};


	// test if any subject is been selected

	$scope.isAnythingSelected = function () {

		var result = Helpers.isEmpty($scope.selected_items);

		return !Helpers.isEmpty($scope.selected_items);

	}


	//immediately trigger actions


	//if already loaded home page once before and now returning to this page
	//just load local items with root items to avoid extra http request
	if ($rootScope.progress && $rootScope.items) {
		$scope.items = $rootScope.items;
		$scope.loading--;

	}


	//load user collections from server  (list of currently watching shows)
	$http({method: 'POST', url: '/api/collection'}).
		success(function (data, status) {

			// reformatting data;

			var d = (new Date()).getDay();

			for (var i = 0; i < data.length; i++) {
				data[i].selected = false;
				data[i].onair = function () {

					var airday = data[i].subject.air_weekday;

					// the bangumi api uses 7 for sunday while JS uses 0, unify them

					if (airday === 7) {
						airday = 0;
					}
					return airday === d;

				}();

			}

			if (!$rootScope.items) {
				$scope.displayMsg($translate('WELCOME'));
			}

			$scope.items = $rootScope.items = data;


			if ($scope.loading) $scope.loading--;


			//load more information about user watching progress (will be used in subject pages), we do this only after collection is loaded
			//so user is able to do actions quickly

			$http({method: 'POST', url: '/api/progress'}).
				success(function (data, status) {
					// reformatting data;

					var progress = {};

					// flatten eps object, uses ep id as key for quick access

					for (var key in data) {
						var eps = {};
						var _eps = data[key].eps;
						for (var i in _eps) {
							eps[_eps[i].id] = '1';
						}

						progress[data[key].subject_id] = eps;

					}

					$rootScope.progress = progress;

				}).
				error(function (data, status) {
					if (status === 401) {
						$location.path("/login");
					}

				});

		}).
		error(function (data, status) {
			$scope.server_offline = 1;
			if ($scope.loading)  $scope.loading--;

			if (status === 401) {
				$location.path("/login");
			}

		});

});