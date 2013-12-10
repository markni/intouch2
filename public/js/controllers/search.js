app.controller('searchCtrl', function ($translate, $scope, Auth, $http, $location, $cookieStore, Helpers, $timeout, $routeParams) {
    $scope.type = -1;
    $scope.loading = 0;


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

        $scope.loading++;

        $http({method: 'POST', url: '/api/subjects/update_status/' + action, data: {"subjects": ids}}).
            success(function (data, status) {

                $scope.results[index].added = (action === 'do' ? true : false);
                $scope.loading--;
            }).
            error(function (data, status) {
                $scope.loading--;

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

        });

});