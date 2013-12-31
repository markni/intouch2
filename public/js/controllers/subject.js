app.controller('subjectCtrl', function ($translate, $scope, Auth, $http, $location, Helpers, $routeParams, $rootScope) {
	$scope.loading = 1;
	$scope.editing = 0;
	$scope.rating = 0;
	$scope.show_all = false;

	$scope.max_hotness = 0;
	$scope.selected_eps = {};

	$scope.ratings = [
		{ "value": 0, "text": "n/a" },
		{ "value": 1, "text": "★" },
		{ "value": 2, "text": "★★" },
		{ "value": 3, "text": "★★★" },
		{ "value": 4, "text": "★★★★" },
		{ "value": 5, "text": "★★★★★" },
		{ "value": 6, "text": "★★★★★★" },
		{ "value": 7, "text": "★★★★★★★" },
		{ "value": 8, "text": "★★★★★★★★" },
		{ "value": 9, "text": "★★★★★★★★★" },
		{ "value": 10, "text": "★★★★★★★★★★" }

	];



	$scope.toggleEdit = function(){

		$scope.editing = $scope.editing === 0 ? 1 : 0;
	}

	$scope.getRating = function () {
		return parseInt($scope.subject)

	};

	$scope.getNextEp = function(){

		return $scope.next_ep_sort;

	}

	$scope.getHotness = function(ep){
		var p = 0;
		if($scope.max_hotness && !$scope.isSelected(ep)){
			p = 83.333333 * (ep.comment /  $scope.max_hotness )
		}

		return {width:p+'%'};
	}

	$scope.getProgressClass = function () {
		return 'progress-' + $scope.rating * 10;
	};

	$scope.updateStatus = function (status) {
		$scope.status = status;
	}

	$scope.epNameFormat = function(name){
		if (!name){
			return 'TBA';
		}
		return name.replace(/&quot;/g,'"');

	}

	$scope.addToSelected = function(ep){

		//if already have it , toggle selection
		if(typeof $scope.selected_eps[ep.id] != "undefined"){
			delete $scope.selected_eps[ep.id];
		}
		else{
			$scope.selected_eps[ep.id] = ep['real_sort'];
		}



	}

	$scope.showAll = function(){
		$scope.show_all = true;
	}

	$scope.isSelected = function(ep){
		if(typeof $scope.selected_eps[ep.id] != "undefined"){
			return true;
		}
		else {
			return false;
		}

	}

	$scope.cancelSelected = function(){

		$scope.selected_eps = {};
	}

	$scope.isAnythingSelected = function(){
		var result = Helpers.isEmpty($scope.selected_eps);

		return Helpers.isEmpty($scope.selected_eps);

	}

	$scope.updateToNext = function(){
		var id =  $scope.next_ep_id;
		$scope.selected_eps = {};
		$scope.selected_eps[id] =  $scope.next_ep_real_sort;
		$scope.updateEpStatus('batch_update');

	}

	$scope.updateEpStatus = function(cmd){
		var id = $scope.subject.id;
		var eps = $scope.selected_eps;

		var d = {eps:eps};
		$http({method: 'POST', url: '/api/subject/'+id+'/eps/'+cmd,data:d}).
			success(function (data, status) {

				var next= 0;

				if (cmd === "batch_update"){
					var max  =-1;
					for (var key in eps){
						if (eps[key]>=max){
							max  =eps[key];
						}
					}

					for (var i=0;i<$scope.subject.eps.length;i++){
						if ($scope.subject.eps[i]['real_sort'] <=max){
							$scope.subject.eps[i].watched = 1;
						}
						else{
							if(!next){
								next = $scope.next_ep_id = $scope.subject.eps[i].id;
								$scope.next_ep_sort =  $scope.subject.eps[i].sort;
								$scope.next_ep_real_sort = $scope.subject.eps[i]["real_sort"];
							}
							$scope.subject.eps[i].watched = 0;
						}
					}
				}
				else{
					for (var i=0;i<$scope.subject.eps.length;i++){
						if(typeof eps[$scope.subject.eps[i].id] != "undefined"){
							$scope.subject.eps[i].watched = cmd === "remove" ? 0 : 1;
							if ($scope.subject.eps[i].watched ===0 && !next )  {
								next = $scope.next_ep_id = $scope.subject.eps[i].id;
								$scope.next_ep_sort =  $scope.subject.eps[i].sort;
								$scope.next_ep_real_sort = $scope.subject.eps[i]["real_sort"];
							}
						}
					}

				}



				$scope.selected_eps = {};



			}).
			error(function (data, status) {
				if (status === 401){
					$location.path("/login");
				}
			});


	}

	$scope.showTranslatedName = function(){
		if ($rootScope.config.lang == 'en-us'){
			return false;
		}
		return true;

	}


	$scope.reset = function () {

		if ($scope.old_data && $scope.old_data.status){
			$scope.rating = $scope.old_data.rating;
			$scope.comment = $scope.old_data.comment;
			$scope.tags = $scope.old_data.tags;
			$scope.status = $scope.old_data.status;
		}


		$scope.editing = 0;

	}

	$scope.save = function () {
		$scope.old_data = {rating: $scope.rating, tags: $scope.tags, comment: $scope.comment, status: $scope.status};
		var d = {subjects: [$scope.subject.id], comment: $scope.comment, tags: $scope.tags, rating: $scope.rating};
		$http({method: 'POST', url: '/api/subjects/update_status/' + $scope.status, data: d}).
			success(function (data, status) {

				$scope.editing = 0;
			}).
			error(function (data, status) {
				if (status === 401){
					$location.path("/logout");
				}
			});

	}

	$http({method: 'POST', url: '/api/subject/' + $routeParams.id}).
		success(function (data, status) {
			$scope.subject = data;


			$scope.loading--;

			$http({method: 'POST', url: '/api/collection/subject/' + $routeParams.id}).
				success(function (data, status) {
					if (data.status){
						$scope.rating = data.rating;
						$scope.comment = data.comment;

						$scope.tags = data.tag.join(',');


						$scope.status = data.status.type;
						$scope.old_data = {rating: $scope.rating, tags: $scope.tags, comment: $scope.comment, status: $scope.status};
					}



				}).
				error(function (data, status) {
					if (status === 401){
						$location.path("/login");
					}
				});

			if (!$rootScope.progress){
				//todo:repeative code as used in home.js
				$http({method: 'POST', url: '/api/progress'}).
					success(function (data, status) {

						var progress = {};
						for (var key in data) {
							var eps = {};
							var _eps = data[key].eps;
							for (var i in _eps ){
								eps[_eps[i].id] = '1';
							}
							progress[data[key].subject_id] = eps;
						}


						$rootScope.progress = progress;
						applyEpStatus();

					}).
					error(function (data, status) {

						if (status === 401){
							$location.path("/login");
						}

					});
			}
			else{
				applyEpStatus();

			}



		}).
		error(function (data, status) {
			$scope.loading--;

		});

	var applyEpStatus = function(){
		var p = $rootScope.progress;
		var eps = $scope.subject.eps;
		var id = $scope.subject.id;
		var counter = 1;
		for (var key in eps){
			eps[key]['real_sort'] = counter;
			counter ++;

			if (p[id] && p[id][eps[key].id]){
				eps[key]['watched'] = 1;
			}
			else{
				if (!$scope.next_ep_sort){
					$scope.next_ep_sort = eps[key].sort;
					$scope.next_ep_real_sort = eps[key]['real_sort'];
					$scope.next_ep_id = eps[key].id;

				}
			}

			if(eps[key].comment>$scope.max_hotness){
				$scope.max_hotness = eps[key].comment;

			};

		}

	}

});
