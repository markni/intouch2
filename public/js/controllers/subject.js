app.controller('subjectCtrl', function ($translate, $scope, Auth, $http, $location, $cookieStore, Helpers, $routeParams) {
    $scope.loading = 0;

    $scope.getRating = function () {
		return parseInt($scope.subject)

	};

    $http({method: 'POST', url: '/api/subject/' + $routeParams.id}).
        success(function (data, status) {
            $scope.subject = data;

            $scope.loading--;
        }).
        error(function (data, status) {
            $scope.loading--;

        });


});
