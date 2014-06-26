function WebletCtrl($scope, $rootScope, $log, Restangular, angularLoad) {
	var cnt_show, ctr_show, head_show, content;
	$scope.webletBaseURL = '/weblet/'+ $scope.pagelet.weblet.groupId +'/'+ $scope.pagelet.weblet.name;

	$scope.setView = function(url) {
		content = url;
	};
	$scope.getView = function() {
		return content;
	};
	$scope.setContentVisible = function(isVisible) {
		cnt_show = isVisible;
	};
	$scope.isContentVisible = function() {
		return cnt_show;
	};
	$scope.setControlVisible = function(isVisible) {
		ctr_show = isVisible;
	};
	$scope.isControlVisible = function() {
		return ctr_show;
	};
	$scope.setHeaderVisible = function(isVisible) {
		head_show = isVisible;
	};
	$scope.isHeaderVisible = function() {
		return head_show;
	};
	$scope.startEditTitle = function(){
		$log.info('startEditTitle');
	};
	$scope.showConfigure = function(){
		$('#pageletSettings').foundation('reveal', 'open');
	};
	$scope.remove = function() {
		var pagelet = $scope.pagelet;
		var page = Restangular.one('model/page', pagelet.pageId);
		page.customDELETE('pagelet/' + pagelet.modelId, {
			'row' : pagelet.row,
			'column' : pagelet.column,
			'order' : pagelet.order
		});
	};
	$scope.setDraggable = function(draggable){
		$scope.draggable = draggable;
	}

	// initialize
	$scope.draggable = false;
	$scope.setHeaderVisible(false);
	$scope.setControlVisible(false);
	$scope.setContentVisible(true);
	$scope.data = {}; // data shared by child controllers
	angularLoad.loadScript($scope.webletBaseURL + '/webcontentdisplay.js').then(function() {

		$scope.setView('/common/templates/weblet-view-tpl.html');
		
	}).catch(function() {
	    // There was some error loading the script.
	});
}

function LayoutCtrl($scope, $rootScope, $location, $log, Restangular) {
	$rootScope.$on("ANGULAR_DRAG_START", function(event, channel) {

	});

	$rootScope.$on("ANGULAR_DRAG_END", function(event, channel) {

	});

	var row, column, order;
	$scope.dropSuccessHandler = function($event, pagelet, pagelets) {
		var orow = angular.copy(pagelet.row);
		var ocol = angular.copy(pagelet.column);
		var oorder = angular.copy(pagelet.order);
		
		pagelet.row = row;
		pagelet.column = column;
		pagelet.order = order;
		// increase order of target row and col
		for ( var i = 0; i< pagelets.length; ++i) {
			if (pagelets[i].row == row && pagelets[i].column == column
					&& pagelets[i].order >= order
					&& pagelets[i].webletId != pagelet.webletId) {
				pagelets[i].order++;
			}
		}
		if (!(row == orow && column == ocol)) {
			// decrease order of source row and col
			for (var i = 0; i< pagelets.length; ++i) {
				if (pagelets[i].row == orow && pagelets[i].column == ocol
						&& pagelets[i].order > oorder
						&& pagelets[i].webletId != pagelet.webletId) {
					pagelets[i].order--;
				}
			}
		}
		// now save the change
		var pageletRes = Restangular.one('model/page/'
				+ pagelet.pageId + '/pagelet/'+pagelet.modelId);
		pageletRes.customPUT({
			'row' : pagelet.row,
			'column' : pagelet.column,
			'order' : pagelet.order
		}).then(function(model) {
			$log.info('done-dropSuccessHandler');
		});
	};

	$scope.onDrop = function($event, $data, weblets) {
		row = parseInt($event.target.dataset.row);
		column = parseInt($event.target.dataset.column);
		order = parseInt($event.target.dataset.order);
	};
}

function WebletListingCtrl($scope, $rootScope, $log, Restangular) {
	$rootScope.showWebletList = function(row, column, order) {
		$scope.addPosition = {
			'row' : row,
			'column' : column,
			'order' : order
		};
		$('#webletListing').foundation('reveal', 'open');
		var weblets = Restangular.all('weblet');
		weblets.getList().then(function(weblets) {
			$rootScope.gWeblets = weblets;
		});
	};

	$scope.showTab = function(index) {
		$scope.selectedIndex = index;
	};

	$scope.checkCategories = function(row) {
		if ($scope.selectedIndex == 0)
			return true;
		else {
			return row.categories
					&& row.categories
							.indexOf($scope.gWebletCategories[$scope.selectedIndex].categoryId) >= 0;
		}
	};

	$scope.addPagelet = function(weblet) {
		var pagelet = Restangular.all('model/page/'
				+ $scope.currentPage.modelId + '/pagelet');
		pagelet.post({
			'webletId' : weblet.id,
			'row' : $scope.addPosition.row,
			'column' : $scope.addPosition.column,
			'order' : $scope.addPosition.order
		}).then(function(pagelet) {
			$scope.currentPage.pagelets.push(pagelet);// TODO: not working
		});
	};
	$scope.selectedIndex = 0;

	$scope.gWebletCategories = [ {
		'categoryId' : 0,
		'name' : 'All'
	}, {
		'categoryId' : 1,
		'name' : 'Social'
	}, {
		'categoryId' : 2,
		'name' : 'Utilities'
	}, {
		'categoryId' : 3,
		'name' : 'Web Content'
	} ];

	$scope.gsWeblets = [ {
		'webletId' : 1,
		'title' : 'Web Content Display',
	}, {
		'webletId' : 13,
		'title' : 'Blog Display',
		'categories' : [ 1 ]
	}, {
		'webletId' : 561,
		'title' : 'Currency Calculator',
		'categories' : [ 2 ]
	}, {
		'webletId' : 51,
		'title' : 'Comments',
		'categories' : [ 1, 3 ]
	} ];
}

function PageletSettingsCtrl($scope, $rootScope, $log, Restangular) {
	$scope.showTabContent = function(tabIndex) {
		$scope.currentTab = tabIndex;
	};
	$scope.setErrorVisible = function(visible) {
		$scope.isError = visible;
	};
	$scope.save = function() {
		var pagelet = $scope.pagelet;
		var pageletRes = Restangular.one('model/page/'
				+ pagelet.pageId + '/pagelet/'+pagelet.modelId);
		pageletRes.put({
			'title' : pagelet.title
		}).then(function(model) {
			$log.info('save-pagelet-settings');
		});
	};
	$scope.cancel = function() {
		$('#pageletSettings').foundation('reveal', 'close');
	};
	$scope.currentTab = 1;
}