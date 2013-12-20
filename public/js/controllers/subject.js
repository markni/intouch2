app.controller('subjectCtrl', function ($translate, $scope, Auth, $http, $location, $cookieStore, Helpers, $routeParams) {
	$scope.loading = 0;
	$scope.editing = 0;
	$scope.ratings = [
		{ "value": 0, "text": "n/a" },
		{ "value": 1, "text": "★" },
		{ "value": 2, "text": "★★" },
		{ "value": 3, "text": "★★★" },
		{ "value": 4, "text": "★★★★" },
		{ "value": 5, "text": "★★★★★" },
		{ "value": 6, "text": "★★★★★★" },
		{ "value": 7, "text": "★★★★★★★" },
		{ "value": 8, "text": "★★★★★★★★" },
		{ "value": 9, "text": "★★★★★★★★★" },
		{ "value": 10, "text": "★★★★★★★★★★" }

	];

	$scope.toggleEdit = function(){

		$scope.editing = $scope.editing === 0 ? 1 : 0;
	}

	$scope.getRating = function () {
		return parseInt($scope.subject)

	};

	$scope.getProgressClass = function () {
		return 'progress-' + $scope.rating * 10;
	};

	$scope.updateStatus = function (status) {
		$scope.status = status;
	}

	$scope.reset = function () {

		$scope.rating = $scope.old_data.rating;
		$scope.comment = $scope.old_data.comment;
		$scope.tags = $scope.old_data.tags;
		$scope.status = $scope.old_data.status;

		$scope.editing = 0;

	}

	$scope.save = function () {
		$scope.old_data = {rating: $scope.rating, tags: $scope.tags, comment: $scope.comment, status: $scope.status};
		var d = {subjects: [$scope.subject.id], comment: $scope.comment, tags: $scope.tags, rating: $scope.rating};
		$http({method: 'POST', url: '/api/subjects/update_status/' + $scope.status, data: d}).
			success(function (data, status) {

				$scope.editing = 0;
			}).
			error(function (data, status) {

			});

	}

	$http({method: 'POST', url: '/api/subject/' + $routeParams.id}).
		success(function (data, status) {
			$scope.subject = data;

			$scope.loading--;

			$http({method: 'POST', url: '/api/collection/subject/' + $routeParams.id}).
				success(function (data, status) {


					$scope.rating = data.rating;
					$scope.comment = data.comment;
					$scope.tags = data.tag.join(',');
					$scope.status = data.status.type;
					$scope.old_data = {rating: $scope.rating, tags: $scope.tags, comment: $scope.comment, status: $scope.status};

				}).
				error(function (data, status) {

				});

		}).
		error(function (data, status) {
			$scope.loading--;

		});

});
