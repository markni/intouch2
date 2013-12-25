var app = angular.module('inTouch2', ['ngRoute',
	'ngTouch', 'ngAnimate', 'pascalprecht.translate']);

app.config(function ($translateProvider, $routeProvider, $locationProvider) {
	$locationProvider.html5Mode(true);

	$translateProvider.translations('en-us', {
		WELCOME: 'Welcome back! How are you today?',
		ALL: 'All',
		AVERAGE: 'Average',
		COMMENT_PLACEHOLDER: 'Leave a short comment/review (200 words max).',
		TAGS_PLACEHOLDER: 'Add tags (use comma or space to seperate).',
		RATED: 'Rated',
		DRAMA: 'Drama',
		ANIME: 'Anime',
		HOLD: 'Hold',
		TRASH: 'Trash',
		FINISH: 'Finish',
		WATCHING: 'Watching',
		CANCEL: 'Cancel',
		WISHLIST: 'Want',
		UNFOLLOW: 'Unfollow',
		SETTINGS: 'Settings',
		HOME: 'Home',
		PROFILE: 'Profile',
		SCHEDULE: 'Schedule',
		TRANSLATED_TITLE: "Chinese Titles",
		ORIGINAL_TITLE: "Original Titles",
		TODAY: 'Today',
		YESTERDAY: 'Yesterday',
		TOMORROW: 'Tomorrow',
		PAGE_NOT_FOUND: 'Page not found, return to home.',
		RETURN_TO_HOME: 'Return to Home',
		LOGOUT: "Logout",
		LOGOUT_SUCCESS: "You have successfully logout out",
		LOADING: "loading...",
		START_APP: 'Login',
		START_APP_WITH_DEMO: 'Login with Demo Account',
		SET_LANG: 'Switch language to 简体中文',
		NO_ACCOUNT_HINT: "Don't have an account? Try this.",
		PASSWORD: 'password',
		USERNAME: 'username',
		LOGIN_ERROR: "Incorrect username or password, please try again.",
		SEARCH: "Search",
		ENTER_TO_SEARCH: "Find your favourite shows",
		WATCHED: "watched",
		WATCHED2: "Watched",
		FINISHED_UPDATE_WATCHED_TO: "EP. {{x}} of {{y}} has been marked as watched.",
		ACTION_COMPLETED: "You have marked {{x}} subjects, they will be removed from your watching queue.",
		APPLY_CHANGES: "Apply changes",
		LOAD_ALL: 'Load all items',
		HIGH_QUALITY_IMAGE: 'High Quality Image',
		LOW_QUALITY_IMAGE: "Low Quality Image",
		BOT1: 'Default Bot',
		BOT2: 'Bangumi Chan',
		LOAD_ALL_EPS: 'Show already watched episodes.',
		WATCHED_TO: 'Watched to',
		REMOVE: 'Reset',
		DEVIATION: 'Deviation',
		SHARE: 'Share your collection',
		RAN_MSG_1: "Did you know you can pin your favourite show on mobile desktop?",
		RAN_MSG_2: "Tap the cover art to open action menu! You can select more than one each time!",
		RAN_MSG_3: "You can batch update episodes anyway you want. Wanted only ep3, ep5, and ep9? No problem!",
		RAN_MSG_4: "You can turn on high res images in the settings. Be careful they cost a lot of bandwidth!",
		RAN_MSG_5: "The weather is nice today, isn't it?",
		RAN_MSG_6: "今天天气真好啊 ～☆",
		RAN_MSG_7: "今天天气真好啊 ～☆",
		RAN_MSG_8: "今天天气真好啊 ～☆",
		RAN_MSG_9: "今天天气真好啊 ～☆",
		RAN_MSG_10: "今天天气真好啊 ～☆",
		RAN_MSG_11: "今天天气真好啊 ～☆",
		RAN_MSG_12: "今天天气真好啊 ～☆",
		RAN_MSG_13: "今天天气真好啊 ～☆",
		RAN_MSG_14: "今天天气真好啊 ～☆"
	})
		.translations('zh-cn', {
			WELCOME: '欢迎回家～☆',
			ALL: '全部分类',
			AVERAGE: '平均分',
			COMMENT_PLACEHOLDER: '吐槽一下吧 （最多200字）',
			TAGS_PLACEHOLDER: '添加标签 (用空格或半角逗号分隔).',
			RATED: '已评分',
			DRAMA: '电视剧',
			ANIME: '动画',
			HOLD: '搁置',
			FINISH: '看完',
			WATCHING: '在看',
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
			TODAY: '今天',
			YESTERDAY: '昨天',
			TOMORROW: '明天',
			PAGE_NOT_FOUND: '没有找到要访问的页面，点击这里返回首页',
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
			WATCHED2: "看过",
			FINISHED_UPDATE_WATCHED_TO: "你已成功看过了 {{y}} 的EP. {{x}} ～☆",
			ACTION_COMPLETED: "你已经成功标记了{{x}}部作品，它们将不再出现在首页列表中 ～☆",
			APPLY_CHANGES: "保存收藏状态",
			LOAD_ALL: '显示剩余的条目',
			LOAD_ALL_EPS: '显示已经看过的章节',
			WATCHED_TO: '看到',
			REMOVE: '撤销',
			HIGH_QUALITY_IMAGE: '使用高清图片',
			LOW_QUALITY_IMAGE: "使用低清图片",
			BOT1: '默认机器人(圈圈)',
			BOT2: 'Bangumi娘',
			DEVIATION: '标准差',
			SHARE: '向朋友分享你的收藏',
			RAN_MSG_1: "你知道吗，可以单独把条目页面收藏到手机桌面哦 ～☆",
			RAN_MSG_2: "点击封面图就可以更改收藏状态，一次可以同时选好几个呢 ～☆",
			RAN_MSG_3: "章节也是可以批量操作的，可以一次看过柯南的ep234，ep523，ep110呢 ～☆",
			RAN_MSG_4: "在设置里可以开启高清图片，不过要小心流量呀 ～☆",
			RAN_MSG_5: "今天天气真好啊 ～☆",
			RAN_MSG_6: "今天天气真好啊 ～☆",
			RAN_MSG_7: "今天天气真好啊 ～☆",
			RAN_MSG_8: "今天天气真好啊 ～☆",
			RAN_MSG_9: "今天天气真好啊 ～☆",
			RAN_MSG_10: "今天天气真好啊 ～☆",
			RAN_MSG_11: "今天天气真好啊 ～☆",
			RAN_MSG_12: "今天天气真好啊 ～☆",
			RAN_MSG_13: "今天天气真好啊 ～☆",
			RAN_MSG_14: "今天天气真好啊 ～☆"

		});



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
		when('/profile/:username', {
			templateUrl: '/temp/profile',
			controller: 'profileCtrl'
		}).
		when('/p/:username', {
			templateUrl: '/temp/profile',
			controller: 'profileCtrl'
		}).

		when('/schedule', {
			templateUrl: '/temp/schedule',
			controller: 'scheduleCtrl'
		}).
		when('/subject/:id', {
			templateUrl: '/temp/subject',
			controller: 'subjectCtrl'
		}).
		when('/404', {
			templateUrl: '/temp/404'
		}).
		otherwise({
			redirectTo: '/404'
		});
}).run(function ($rootScope, $translate, $location, Auth, Helpers) {

		if (!Helpers.isLocalStorageNameSupported()) {
			$location.path("/404");
		}
		else {
			if (localStorage.config_lang !== undefined) {
				$translate.uses(localStorage.config_lang);
			}
			else {
				$translate.uses('en-us');
				localStorage.config_lang = 'en-us';
			}

			$rootScope.config = {};
			$rootScope.config.lang = localStorage.config_lang;

			if (localStorage.config_bot === undefined) {
				localStorage.config_bot = $rootScope.config.bot = 'x';
			}
			else {
				$rootScope.config.bot = localStorage.config_bot;
			}

			if (localStorage.config_title === undefined) {
				localStorage.config_title = $rootScope.config.title = 'o';
			}
			else {
				$rootScope.config.title = localStorage.config_title;
			}

			if (localStorage.config_iq === undefined) {
				localStorage.config_iq = $rootScope.config.iq = 'low';
			}
			else {
				$rootScope.config.iq = localStorage.config_iq;
			}
			$rootScope.$on("$routeChangeStart", function (event, next, current) {

				if (localStorage.auth === undefined) {

					console.log(next.templateUrl);
					// no logged user, we should be going to #login
					if (next.templateUrl == "/temp/login" || next.templateUrl == "/temp/logout" || next.templateUrl == "/temp/profile" || next.templateUrl == "/temp/error") {
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
		}

		//register default settings in localstorage  if not defined
		//load them if already defined.

	})






