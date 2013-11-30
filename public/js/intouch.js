var app = angular.module('inTouch2', ['ngRoute',
    'ngCookies', 'ngAnimate', 'pascalprecht.translate']);

app.config(function ($translateProvider, $routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);


    $translateProvider.translations('en-us', {
        HOLD: 'Hold',
        TRASH : 'Trash',
        FINISH: 'Finish',
        WISHLIST: 'Wishlist',
        UNFOLLOW : 'Unfollow',
        SETTINGS: 'Settings',
        HOME: 'Home',
        PROFILE: 'Profile',
        SCHEDULE: 'Schedule',
        TRANSLATED_TITLE: "Chinese Titles",
        ORIGINAL_TITLE: "Original Titles",

        RETURN_TO_HOME: 'Return to Home',
        LOGOUT: "Logout",
        LOGOUT_SUCCESS: "You have successfully logout out",
        LOADING: "loading...",
        START_APP: 'Login',
        START_APP_WITH_DEMO: 'Login with Demo Account',
        SET_LANG: 'Switch language to 简体中文',
        NO_ACCOUNT_HINT: "Don't have an acccount? Try this.",
        PASSWORD: 'password',
        USERNAME: 'username',
        LOGIN_ERROR: "Incorrect username or password, please try again.",
        SEARCH: "Search",
        ENTER_TO_SEARCH: "Enter keywords to search",
        WATCHED: "watched",
        FINISHED_UPDATE_WATCHED_TO: "EP. {{x}} of {{y}} has been marked as watched.",
        RAN_MSG_1: "The weather is nice today!"

    })
        .translations('zh-cn', {
            HOLD: '搁置',
            FINISH: '看完',
            TRASH : '抛弃',
            WISHLIST: '想看',
            UNFOLLOW : '取消',
            SETTINGS: '设置',
            'HOME': '首页',
            PROFILE: '个人',
            SCHEDULE: '日历',
            TRANSLATED_TITLE: "显示条目中文名",
            ORIGINAL_TITLE: "显示条目原名",


            'RETURN_TO_HOME': '回到首页',
            'LOGOUT': "登出",
            LOGOUT_SUCCESS: "你已经成功登出",
            LOADING: "读取中...",
            START_APP: '摸摸这里登录',
            START_APP_WITH_DEMO: '用演示帐号登录',
            SET_LANG: '切换到 English 版本',
            NO_ACCOUNT_HINT: '没有账户？ 试试这个。',
            PASSWORD: '输入密码',
            USERNAME: '账户名称',
            LOGIN_ERROR: "用户名或密码不正确，请重新输入",
            SEARCH: "搜索",
            ENTER_TO_SEARCH: "输入搜索关键字",
            WATCHED: "看到",
            FINISHED_UPDATE_WATCHED_TO: "你已成功看过了 {{y}} 的EP. {{x}}",
            RAN_MSG_1: "今天天气真好啊 ~☆"

        });

    if (localStorage.config_lang !== undefined) {
        $translateProvider.preferredLanguage(localStorage.config_lang);
    }
    else {
        $translateProvider.preferredLanguage('en-us');
        localStorage.config_lang = 'en-us';
    }

    if (localStorage.config_bot === undefined) {
        localStorage.config_bot = 'x';
    }

    if (localStorage.config_title === undefined) {
        localStorage.config_title = 'o';
    }

    $routeProvider.
        when('/', {
            templateUrl: '/temp/home',
            controller: 'homeCtrl'
        }).
        when('/login', {
            templateUrl: '/temp/login',
            controller: 'loginCtrl'
        }).
        when('/logout', {
            templateUrl: '/temp/logout',
            controller: 'logoutCtrl'
        }).
        when('/settings', {
            templateUrl: '/temp/settings',
            controller: 'settingsCtrl'
        }).
        otherwise({
            redirectTo: '/'
        });
}).run(function ($rootScope, $location, $cookieStore, Auth) {


        $rootScope.$on("$routeChangeStart", function (event, next, current) {

            if (localStorage.auth === undefined) {

                // no logged user, we should be going to #login
                if (next.templateUrl == "/temp/login" || next.templateUrl == "/temp/logout") {
                    // already going to #login, no redirect needed
                } else {
                    // not going to #login, we should redirect now
                    $location.path("/login");
                }
            }
            else {
                Auth.loadCredentials();
            }
        })

    })

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

app.controller('logoutCtrl', function ($translate, $scope, Auth, $http, $location, $cookieStore, Helpers, $timeout) {
    Auth.clearCredentials();
})

app.controller('homeCtrl', function ($translate, $scope, Auth, $http, $location, $cookieStore, Helpers, $timeout) {
    Auth.loadCredentials();

    $scope.timeouts = [];
    $scope.bot = '/img/shells/' + localStorage.config_bot + '.gif?v=0';
    $scope.paddy = Helpers.paddy;
    $scope.showSideMenu = false;
    $scope.msg = '';
    $scope.selected_items = {};


    $scope.avatar = {};
    $scope.loading = 0;

    $scope.toggleSideMenu = function () {
        $scope.showSideMenu = !$scope.showSideMenu;
    }


    $scope.select = function (i) {



        if ($scope.items[i].selected) {

            $scope.items[i].selected = !$scope.items[i].selected;



        }
        else {
            $scope.items[i].selected = true;
        }


        if ($scope.items[i].selected ) {

            $scope.selected_items[i] = $scope.items[i];

        }
        else{
            delete $scope.selected_items[i];

        }

    }


    $scope.displayMsg = function (msg) {


        $scope.bot = $scope.bot.replace(/\?v=(.)/, function (match, p1) {
            return '?v=' + (parseInt(p1) === 1 ? 0 : 1);
        });  //reload bot gif animation by hacking src.
        //the original gif src will be xx.gif?v=0; after hack will be xx.gif?v=1; and continue to toggle.
        //in this way, further requests will all get 304 not modified


        for (var i = 0; i < $scope.timeouts.length; i++) {
            $timeout.cancel($scope.timeouts[i]);
        }
        $scope.msg = msg;
        var hide = $timeout(function () {

            $scope.msg = '';
            $scope.$apply();

        }, 3000);
        $scope.timeouts.push(hide);

    }


    $scope.showRandomMsg = function () {

        var msg_list = ["RAN_MSG_1"];
        var selected_index = Math.floor(Math.random() * (msg_list.length));
        if (msg_list[selected_index]) {
            $scope.displayMsg($translate(msg_list[selected_index]));
        }
    }

    $scope.updateTo = function (index) {
        var ep_num = $scope.items[index].ep_status + 1;
        var subject_id = $scope.items[index].subject.id;

        $http({method: 'POST', url: '/api/subject/' + subject_id + '/watchedto/' + ep_num}).
            success(function (data, status) {
                $scope.displayMsg($translate('FINISHED_UPDATE_WATCHED_TO', {x: $scope.items[index].ep_status + 1, y: $scope.items[index].subject.name}));
                $scope.items[index].ep_status = $scope.items[index].ep_status + 1;

                //$cookieStore.set('auth',data.auth);

            }).
            error(function (data, status) {

            });
    }


    $scope.getTitle = function (item) {
        if (localStorage.config_title && localStorage.config_title === 'cn' && item.subject.name_cn) {
            //return item.subject.cn
            return item.subject.name_cn;
        }
        return item.name;

    }

    $scope.isAnythingSelected = function(){

        var result = Helpers.isEmpty($scope.selected_items);

        return !Helpers.isEmpty($scope.selected_items);


    }


    //run right away


    $http({method: 'POST', url: '/api/user'}).
        success(function (data, status) {
            $scope.avatar.large = data.avatar.large;
            //$cookieStore.set('auth',data.auth);

        }).
        error(function (data, status) {

        });


    $http({method: 'POST', url: '/api/collection'}).
        success(function (data, status) {


            for (var i = 0; i < data.length; i++) {
                data[i].selected = false;

            }

            $scope.items = data;
            //$cookieStore.set('auth',data.auth);

        }).
        error(function (data, status) {

        });

})


app.controller('loginCtrl', function ($translate, $scope, Auth, $http, $location, $cookieStore) {
    //$translate.uses(navigator.language.toLowerCase());
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
        loadCredentials: function () {
            if (localStorage.auth !== undefined) {
                var encoded = Base64.encode(localStorage.username + ":" + localStorage.auth);
                $http.defaults.headers.common.Authorization = 'Basic ' + encoded;
            }

        },
        setCredentials: function (username, password) {
            var encoded = Base64.encode(username + ':' + password);
            $http.defaults.headers.common.Authorization = 'Basic ' + encoded;

        },
        clearCredentials: function () {
            document.execCommand("ClearAuthenticationCache");
            //$cookieStore.remove('auth');
            delete localStorage.auth;
            delete localStorage.username;
            $http.defaults.headers.common.Authorization = 'Basic ';
        }
    };
}]);

app.factory('Helpers', function () {

    return {
        paddy: function (n, p, c) {
            var pad_char = typeof c !== 'undefined' ? c : '0';
            var pad = new Array(1 + p).join(pad_char);
            return (pad + n).slice(-pad.length);
        },
        isEmpty: function (object) {
            //console.log(object);
            for (var i in object) {
                return false;
            }
            return true;
        }
    }
})



