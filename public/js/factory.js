// Base64 encode and decode services

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

// Basic Auth header set up services

app.factory('Auth', ['Base64', '$http', function (Base64, $http) {
	$http.defaults.headers.common['Authorization'] = 'Basic ';

	return {
		loadCredentials: function () {
			if (localStorage.auth !== undefined) {
				//encode username and auth with base64
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
			delete localStorage.auth;
			delete localStorage.username;
			$http.defaults.headers.common.Authorization = 'Basic ';
		}
	};
}]);

app.factory('Helpers', function () {

	return {
		paddy: function (n, p, c) {
			//pad text to length
			var pad_char = typeof c !== 'undefined' ? c : '0';
			var pad = new Array(1 + p).join(pad_char);
			return (pad + n).slice(-pad.length);
		},

		isEmpty: function (object) {
			// quick test if an object is empty
			for (var i in object) {
				return false;
			}
			return true;
		},
		isLocalStorageNameSupported: function () {
			//double check localStorage support, especially for safari private mode
			try {
				var testKey = 'test', storage = window.localStorage;
				storage.setItem(testKey, '1');
				storage.removeItem(testKey);
				return true;
			} catch (error) {
				return false;
			}
		}
	}
});
