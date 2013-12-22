app.controller('searchCtrl', function ($translate, $scope, Auth, $http, $location, $cookieStore, Helpers, $timeout, $routeParams) {
    $scope.type = -1;
    $scope.loading = 0;


    //TODO: fix this repetitive function also appear in home.js
    $scope.search = function () {

        if ($scope.keywords) {
            $location.path('/search/' + encodeURI($scope.keywords));
        }
    }



    $scope.setType = function (type) {
        $scope.type = type;

    }

    $scope.typeFilter = function (result) {
        // Do some tests

        if ($scope.type === -1 || result.type === $scope.type) {
            return true; // this will be listed in the results
        }

        return false; // otherwise it won't be within the results
    };

    $scope.toggleCollection = function (index) {


        var ids = [$scope.results[index].id];
        var action = 'do';

        if ($scope.results[index].added) {
            action = 'dropped';
        }

        $scope.results[index].added = (action === 'do' ? true : false);
        //$scope.loading++;

        $http({method: 'POST', url: '/api/subjects/update_status/' + action, data: {"subjects": ids}}).
            success(function (data, status) {


                //$scope.loading--;
            }).
            error(function (data, status) {
                //$scope.loading--;
                //reverse action icon if error happens, it usually won't
                $scope.results[index].added = (action === 'do' ? false : true);
				if (status === 401){
					$location.path("/login");
				}


			});

    }

    //TODO: check local cache of user's collection, if already in collection, display '-' instead of '+'

    $scope.loading++;

    $http({method: 'GET', url: '/api/search/' + $routeParams.q}).
        success(function (data, status) {

            $scope.loading--;
            $scope.results = data.list;


        }).
        error(function (data, status) {
            $scope.loading--;
			if (status === 401){
				$location.path("/login");
			}


		});

});