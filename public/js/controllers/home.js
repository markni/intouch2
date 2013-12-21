app.controller('homeCtrl', function ($translate, $scope, Auth, $http, $location, $cookieStore, Helpers, $timeout, $rootScope) {
	$scope.server_offline = 0;

	Auth.loadCredentials();

	$scope.timeouts = [];
	$scope.bot = '/img/shells/' + localStorage.config_bot + '.gif?v=0';
	$scope.paddy = Helpers.paddy;
	$scope.showSideMenu = false;
	$scope.msg = '';
	$scope.selected_items = {};

	$scope.avatar = {};
	$scope.loading = 1;

	$scope.toggleSideMenu = function () {
		$scope.showSideMenu = !$scope.showSideMenu;
	}

	$scope.search = function () {

		if ($scope.keywords) {
			$location.path('/search/' + encodeURI($scope.keywords));
		}
	}

	$scope.cancelSelected = function () {
		for (var key in $scope.selected_items) {
			$scope.items[key].selected = false;
		}
		$scope.selected_items = {};
	}

	$scope.select = function (i) {

		if ($scope.items[i].selected) {

			$scope.items[i].selected = !$scope.items[i].selected;

		}
		else {
			$scope.items[i].selected = true;
		}

		if ($scope.items[i].selected) {

			$scope.selected_items[i] = $scope.items[i];

		}
		else {
			delete $scope.selected_items[i];

		}

	}

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

	$scope.showRandomMsg = function () {

		var msg_list = ["RAN_MSG_1"];
		var selected_index = Math.floor(Math.random() * (msg_list.length));
		if (msg_list[selected_index]) {
			$scope.displayMsg($translate(msg_list[selected_index]));
		}
	}

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

				var len = temp_key_array.length;

				for (var i = 0; i < temp_key_array.length; i++) {

					$scope.items.splice(temp_key_array[i], 1);
				}

				$scope.displayMsg($translate('ACTION_COMPLETED', {x: len}));

			}).
			error(function (data, status) {

			});

	}

	$scope.updateTo = function (index) {
		var ep_num = $scope.items[index].ep_status + 1;
		var subject_id = $scope.items[index].subject.id;

		$http({method: 'POST', url: '/api/subject/' + subject_id + '/watchedto/' + ep_num}).
			success(function (data, status) {
				$scope.displayMsg($translate('FINISHED_UPDATE_WATCHED_TO', {x: $scope.items[index].ep_status + 1, y: $scope.items[index].subject.name}));
				$scope.items[index].ep_status = $scope.items[index].ep_status + 1;

				//$cookieStore.set('auth',data.auth);

			}).
			error(function (data, status) {

			});
	}

	$scope.getTitle = function (item) {
		if (localStorage.config_title && localStorage.config_title === 'cn' && item.subject.name_cn) {
			//return item.subject.cn
			return item.subject.name_cn;
		}
		return item.name;

	}

	$scope.isAnythingSelected = function () {

		var result = Helpers.isEmpty($scope.selected_items);

		return !Helpers.isEmpty($scope.selected_items);

	}

	//run right away

	if ($rootScope.progress && $rootScope.items) {
		$scope.items = $rootScope.items;
		$scope.loading--;

	}



		$http({method: 'POST', url: '/api/collection'}).
			success(function (data, status) {



				for (var i = 0; i < data.length; i++) {
					data[i].selected = false;

				}

				if(!$rootScope.items){
					$scope.displayMsg($translate('WELCOME'));
				}

				$scope.items = $rootScope.items = data;

				$scope.server_offline = 0;
				if($scope.loading) $scope.loading--;
				//$cookieStore.set('auth',data.auth);

				$http({method: 'POST', url: '/api/progress'}).
					success(function (data, status) {

						var progress = {};
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


					});

			}).
			error(function (data, status) {
				$scope.server_offline = 1;
				if($scope.loading)  $scope.loading--;

			});



});