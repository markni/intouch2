app.directive('bottomMenu', function () {
    return {
        restrict: 'AE',
        templateUrl: '/temp/bottom-menu',
        replace: true

    };

});

app.directive('sideMenu', function () {
    return {
        restrict: 'AE',
        templateUrl: '/temp/side-menu',
        replace: true

    };

});