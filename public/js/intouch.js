var app = angular.module('inTouch2', ['ngRoute', 'ngCookies', 'pascalprecht.translate']);

app.config(function ($translateProvider, $routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);

    $translateProvider.translations('en-us', {
        START_APP: 'Touch to Start',
        NO_ACCOUNT_HINT: "Don't have an acccount? Try this.",
        PASSWORD: 'password',
        USERNAME: 'username',
        LOGIN_ERROR : "Incorrect username or password, please try again."

    })
        .translations('zh-cn', {
            START_APP: '摸一下这里开始',
            NO_ACCOUNT_HINT: '没有账户？ 试试这个。',
            PASSWORD: '输入密码',
            USERNAME: '账户名称',
            LOGIN_ERROR : "用户名或密码不正确，请重新输入"

        });
    $translateProvider.preferredLanguage('zh-cn');
    //$translateProvider.preferredLanguage('en-us');


    $routeProvider.
        when('/', {
            templateUrl: '/temp/login',
            controller: 'loginCtrl'
        }).
        otherwise({
            redirectTo: '/'
        });
});


app.controller('loginCtrl', function ($translate, $scope, Auth, $http) {
    //$translate.uses(navigator.language.toLowerCase());
    $scope.loading = 0;
    $scope.show_login_error = false;
    $scope.user = {"username": "", "password": ""};

    $scope.dismiss_login_error = function (){
        $scope.show_login_error = false;
    }

    $scope.login = function () {
        $scope.loading++;
        Auth.setCredentials($scope.user.username, $scope.user.password);

        $http({method: 'POST', url: '/api/login'}).
            success(function (data, status) {
                $scope.status = status;
                $scope.data = data;
                $scope.loading--;
            }).
            error(function (data, status) {
                $scope.loading--;
                $scope.data = data || "Request failed";
                $scope.status = status;
                console.log(status)
                $scope.show_login_error = true;
            });


    }


});


app.factory('Base64', function () {
    var keyStr = 'ABCDEFGHIJKLMNOP' +
        'QRSTUVWXYZabcdef' +
        'ghijklmnopqrstuv' +
        'wxyz0123456789+/' +
        '=';
    return {
        encode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            do {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);

                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;

                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }

                output = output +
                    keyStr.charAt(enc1) +
                    keyStr.charAt(enc2) +
                    keyStr.charAt(enc3) +
                    keyStr.charAt(enc4);
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
            } while (i < input.length);

            return output;
        },

        decode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
            var base64test = /[^A-Za-z0-9\+\/\=]/g;
            if (base64test.exec(input)) {
                alert("There were invalid base64 characters in the input text.\n" +
                    "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                    "Expect errors in decoding.");
            }
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

            do {
                enc1 = keyStr.indexOf(input.charAt(i++));
                enc2 = keyStr.indexOf(input.charAt(i++));
                enc3 = keyStr.indexOf(input.charAt(i++));
                enc4 = keyStr.indexOf(input.charAt(i++));

                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;

                output = output + String.fromCharCode(chr1);

                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }

                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";

            } while (i < input.length);

            return output;
        }
    };
});

app.factory('Auth', ['Base64', '$cookieStore', '$http', function (Base64, $cookieStore, $http) {
    // initialize to whatever is in the cookie, if anything
    $http.defaults.headers.common['Authorization'] = 'Basic ' + $cookieStore.get('authdata');

    return {
        setCredentials: function (username, password) {
            var encoded = Base64.encode(username + ':' + password);
            $http.defaults.headers.common.Authorization = 'Basic ' + encoded;
            //$cookieStore.put('authdata', encoded);
        },
        clearCredentials: function () {
            document.execCommand("ClearAuthenticationCache");
            //$cookieStore.remove('authdata');
            $http.defaults.headers.common.Authorization = 'Basic ';
        }
    };
}]);




