app.controller('scheduleCtrl', function ($translate, $scope, Auth, $http, $location, $cookieStore, Helpers, $timeout) {

    $scope.day = 0; //default is showing today's show

    $scope.loading = 0;

    $scope.loading++;

    $scope.today = (new Date()).getDay();

    $scope.setDay =function(day){
        $scope.day = day;
    }

    $scope.dayFilter = function (result) {

        var selected_day = $scope.today+$scope.day;

        //result of 6+1
        if (selected_day === 7){
            selected_day = 0;
        }

        //result of 0-1
        else if (selected_day === -1){
            selected_day = 6;
        }


        if (result.air_weekday === selected_day) {
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

        //$scope.loading++;

        $scope.results[index].added = (action === 'do' ? true : false);

        $http({method: 'POST', url: '/api/subjects/update_status/' + action, data: {"subjects": ids}}).
            success(function (data, status) {


                //$scope.loading--;
            }).
            error(function (data, status) {
                //$scope.loading--;
                $scope.results[index].added = (action === 'do' ? false : true);
				if (status === 401){
					$location.path("/login");
				}


			});

    }



    $http({method: 'POST', url: '/api/schedule'}).
        success(function (data, status) {

            $scope.results = data;

            $scope.loading--;
        }).
        error(function (data, status) {
            $scope.loading--;
			if (status === 401){
				$location.path("/login");
			}


		});







});