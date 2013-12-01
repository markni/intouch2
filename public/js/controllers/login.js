app.controller('loginCtrl', function ($translate, $scope, Auth, $http, $location, $cookieStore) {
    $scope.loading = 0;
    $scope.show_login_error = false;
    $scope.user = {"username": "", "password": ""};


    $scope.login_button_text = $translate('START_APP');
    $scope.demo_button_text = $translate('START_APP_WITH_DEMO');

    $scope.dismiss_login_error = function () {
        $scope.show_login_error = false;
    }




    $scope.toggleLang = function () {

        var lang = $translate.uses() === 'en-us' ? 'zh-cn' : 'en-us';
        $translate.uses(lang);
        localStorage.config_lang = lang;
        $scope.login_button_text = $translate('START_APP');
        $scope.demo_button_text = $translate('START_APP_WITH_DEMO');
    }


    $scope.demo = function () {
        $scope.loading++;
        $scope.demo_button_text = $translate('LOADING');
        Auth.clearCredentials();
        $http({method: 'POST', url: '/api/demo'}).
            success(function (data, status) {
                //$cookieStore.set('auth',data.auth);
                localStorage.auth = data.auth;
                localStorage.username = data.username;
                $scope.status = status;
                $scope.data = data;
                $scope.loading--;
                $scope.demo_button_text = $translate('START_APP_WITH_DEMO');
                $location.path('/');
            }).
            error(function (data, status) {
                $scope.loading--;
                $scope.demo_button_text = $translate('START_APP_WITH_DEMO');
                $scope.data = data || "Request failed";
                $scope.status = status;
                $scope.show_login_error = true;
            });

    }

    $scope.login = function () {
        $scope.loading++;
        $scope.login_button_text = $translate('LOADING');
        Auth.clearCredentials();
        Auth.setCredentials($scope.user.username, $scope.user.password);

        $http({method: 'POST', url: '/api/login'}).
            success(function (data, status) {
                //$cookieStore.set('auth',data.auth);
                localStorage.auth = data.auth;
                localStorage.username = data.username;
                $scope.status = status;
                $scope.data = data;
                $scope.loading--;
                $scope.login_button_text = $translate('START_APP');
                $location.path('/');
            }).
            error(function (data, status) {
                $scope.loading--;
                $scope.login_button_text = $translate('START_APP');
                $scope.data = data || "Request failed";
                $scope.status = status;
                $scope.show_login_error = true;
            });


    }


});