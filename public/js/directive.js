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


app.directive('responsiveChart', function ($window) {
    return function (scope, element) {


        scope.getParentWidth = function () {
            return element.parent().innerWidth();
        }


        var setNewSize = function(newParentWidth){
            console.log('newPWidth: '+newParentWidth);

            element.height(newParentWidth*1.5);

        }


        scope.$watch(scope.getParentWidth, function (newValue, oldValue) {
            setNewSize(newValue);
            console.log('new: '+ newValue + "old: "+ oldValue);
            if(scope.chart_data){

                //var ctx = document.getElementById("chart").getContext("2d");
                //new Chart(ctx).Bar(scope.chart_data);
            }

        }, true);

        // Set on resize
        angular.element($window).bind('resize', function () {
            scope.$apply();
        });
    };
});