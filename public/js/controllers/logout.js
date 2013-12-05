app.controller('logoutCtrl', function ($translate, $scope, Auth, $http, $location, $cookieStore, Helpers, $timeout) {
    Auth.clearCredentials();
})
