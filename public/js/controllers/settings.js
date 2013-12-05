app.controller('settingsCtrl', function ($translate, $scope, Auth, $http, $location, $cookieStore, Helpers, $timeout) {
    $scope.lang = localStorage.config_lang;
    $scope.bot = localStorage.config_bot;
    $scope.title = localStorage.config_title;

    $scope.setLang = function (lang) {
        localStorage.config_lang = $scope.lang = lang;
        $translate.uses(lang);
    }

    $scope.setBot = function (bot) {
        localStorage.config_bot = $scope.bot = bot;

    }

    $scope.setTitle = function (title) {
        localStorage.config_title = $scope.title = title;

    }


})
