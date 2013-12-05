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



app.directive('searchBar', function () {
    return {
        restrict: 'AE',
        templateUrl: '/temp/search-bar',
        replace: true

    };

});