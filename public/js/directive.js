app.directive('bottomMenu', function () {
    return {
        restrict: 'AE',
        templateUrl: '/views/bottom-menu.html',
        replace: true

    };

});

app.directive('sideMenu', function () {
    return {
        restrict: 'AE',
        templateUrl: '/views/side-menu.html',
        replace: true

    };

});



app.directive('searchBar', function () {
    return {
        restrict: 'AE',
        templateUrl: '/views/search-bar.html',
        replace: true

    };

});

