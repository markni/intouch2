var app = angular.module('inTouch2', ['ngRoute',
    'ngCookies', 'ngAnimate', 'pascalprecht.translate']);

app.config(function ($translateProvider, $routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);


    $translateProvider.translations('en-us', {
        ALL: 'All',
        DRAMA: 'Drama',
        ANIME: 'Anime',
        HOLD: 'Hold',
        TRASH: 'Trash',
        FINISH: 'Finish',
        CANCEL: 'Cancel',
        WISHLIST: 'Wishlist',
        UNFOLLOW: 'Unfollow',
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
            ALL: '全部分类',
            DRAMA: '电视剧',
            ANIME: '动画',
            HOLD: '搁置',
            FINISH: '看完',
            TRASH: '抛弃',
            WISHLIST: '想看',
            UNFOLLOW: '取消',
            SETTINGS: '设置',
            CANCEL: '取消',
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
        when('/search/:q', {
            templateUrl: '/temp/search',
            controller: 'searchCtrl'
        }).
        when('/profile', {
            templateUrl: '/temp/profile',
            controller: 'profileCtrl'
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






