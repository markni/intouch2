app.controller('profileCtrl', function ($translate, $scope, Auth, $http, $location, $cookieStore, Helpers, $timeout) {
    console.log('???');


    $http({method: 'POST', url: '/api/user'}).
        success(function (data, status) {
            $scope.avatar = data.avatar.large;
            $scope.sign = data.sign || "When life gives you lemons, make lemonade";
            $scope.nickname = data.nickname;
            //$cookieStore.set('auth',data.auth);

            //$scope.displayMsg(data.nickname);

        }).
        error(function (data, status) {

        });

});