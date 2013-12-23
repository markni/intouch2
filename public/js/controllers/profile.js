app.controller('profileCtrl', function ($translate, $scope, Auth, $http, $location, Helpers, $timeout, $routeParams) {
	$scope.loading = 1;

	$scope.code = '';

	$scope.getShareCode = function(){
		$scope.code = $translate('WATCHED2') + ': ' + $scope.watched + '\n';
		$scope.code += $translate('RATED') + ': ' + $scope.rated + '\n';
		$scope.code += $translate('AVERAGE') + ': ' + $scope.avg + '\n';
		$scope.code += $translate('DEVIATION') + ': ' + $scope.deviation + '\n';
		$scope.code += '-------------\n';

		for(var i=0;i<$scope.watched_subjects.length;i++){
			var rate;
			if($scope.watched_subjects[i].rate == null){
				rate = 'n/a'
			}
			else{
				rate = $scope.watched_subjects[i].rate
			}
			$scope.code += $scope.watched_subjects[i].name + ' '+ rate + '\n';
		}
		$scope.code += '-------------\n';
		$scope.code += $location.absUrl()+'/'+$scope.username;
	};

	$scope.getUserStats = function (username) {
		$scope.username = username
		$scope.loading++;
		$http({method: 'POST', url: '/api/user/' + username + '/stats'}).
			success(function (data, status) {
				$scope.avg = parseFloat(data.average).toFixed(1);
				$scope.watched = data.watched;
				$scope.rated = data.rated;
				$scope.deviation = data.deviation;
				$scope.distribution = data.distribution;
				$scope.watched_subjects = data.watched_subjects;

				var d = [];
				for (var i = 0; i < data.distribution.length; i++) {
					d.push({label: i + 1, y: data.distribution[i]});
				}

				var chart = new CanvasJS.Chart("chart", {
					axisX: {
						gridThickness: 0,
						lineThickness: 0, tickThickness: 0, valueFormatString: " "

					},
					axisY: {
						gridThickness: 0,
						lineThickness: 0, tickThickness: 0, valueFormatString: " "

					},

					toolTip: {
						enabled: false
					},

					data: [
						{
							color: "rgba(124, 204, 229, 0.8)",
							type: "column",

							dataPoints: d
						}
					]
				});

				chart.render();
				$scope.loading--;

			}).
			error(function (data, status) {

				$scope.loading--;
				if (status === 401){
					$location.path("/login");
				}
			});
	};

	if ($routeParams.username !== undefined) {

		$http({method: 'POST', url: '/api/user/' + $routeParams.username}).
			success(function (data, status) {
				if (data && data.username) {
					$scope.avatar = data.avatar.large;
					$scope.sign = data.sign || "When life gives you lemons, make lemonade";
					$scope.nickname = data.nickname;
					$scope.getUserStats(data.username);
				}

				$scope.loading--;

			}).
			error(function (data, status) {
				$scope.loading--;
				if (status === 401){
					$location.path("/login");
				}

			});
	}
	else {
		$http({method: 'POST', url: '/api/user'}).
			success(function (data, status) {
				$scope.avatar = data.avatar.large;
				$scope.sign = data.sign || "When life gives you lemons, make lemonade";
				$scope.nickname = data.nickname;
				$scope.getUserStats(data.username);

				$scope.loading--;

			}).
			error(function (data, status) {
				$scope.loading--;
				if (status === 401){
					$location.path("/login");
				}

			});
	}

});