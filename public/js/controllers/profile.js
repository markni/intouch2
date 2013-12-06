app.controller('profileCtrl', function ($translate, $scope, Auth, $http, $location, $cookieStore, Helpers, $timeout) {



    $http({method: 'POST', url: '/api/user'}).
        success(function (data, status) {
            $scope.avatar = data.avatar.large;
            $scope.sign = data.sign || "When life gives you lemons, make lemonade";
            $scope.nickname = data.nickname;
            $http({method: 'POST', url: '/api/user/'+data.username+'/stats'}).
                success(function (data, status) {


                    $scope.avg = parseFloat(data.average).toFixed(1);
                    $scope.watched = data.watched;
                    $scope.rated = data.rated;

                    var d = [];
                    for (var i=0;i<data.distribution.length;i++){
                        d.push({label:i+1, y: data.distribution[i]});
                    }

                    var chart = new CanvasJS.Chart("chart", {
                        axisX:{
                            gridThickness: 0,
                            lineThickness:0, tickThickness:0, valueFormatString:" "

                        },
                        axisY:{
                            gridThickness: 0,
                            lineThickness:0, tickThickness:0, valueFormatString:" "

                        },

                        toolTip:{
                            enabled:false
                        },

                        data: [
                            {
                                color: "rgba(124, 204, 229, 0.8)",
                                type: "column",

                                dataPoints: d
                            }
                        ]
                    });

                    chart.render();






                }).
                error(function (data, status) {

                });




        }).
        error(function (data, status) {

        });

});