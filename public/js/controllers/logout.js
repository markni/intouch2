app.controller('logoutCtrl', function ($translate, $scope, Auth) {
    Auth.clearCredentials();
})
