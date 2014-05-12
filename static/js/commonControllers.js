function WebletCtrl($scope) {
	var cnt_show, ctr_show, head_show, content;

	$scope.setView = function(url) {
		content = url;
	}
	$scope.getView = function() {
		return content;
	}
	$scope.setContentVisible = function(isVisible) {
		cnt_show = isVisible;
	}
	$scope.isContentVisible = function() {
		return cnt_show;
	}
	$scope.setControlVisible = function(isVisible) {
		ctr_show = isVisible;
	}
	$scope.isControlVisible = function() {
		return ctr_show;
	}
	$scope.setHeaderVisible = function(isVisible) {
		head_show = isVisible;
	}
	$scope.isHeaderVisible = function() {
		return head_show;
	}

	// initialize
	$scope.setHeaderVisible(true);
	$scope.setControlVisible(false);
	$scope.setContentVisible(true);
	$scope.setView('/common/templates/weblet-view-tpl.html');
}

function LayoutCtrl($scope, $rootScope, $log) {
	$rootScope.$on("ANGULAR_DRAG_START", function(event, channel) {

	});

	$rootScope.$on("ANGULAR_DRAG_END", function(event, channel) {

	});

	var row, col, order;
	$scope.dropSuccessHandler = function($event, weblet, weblets) {
		var orow = weblet.row;
		var ocol = weblet.col;
		var oorder = weblet.order;

		weblet.row = row;
		weblet.col = col;
		weblet.order = order;
		// increase order of target row and col
		for ( var i in weblets) {
			if (weblets[i].row == row && weblets[i].col == col
					&& weblets[i].order >= order
					&& weblets[i].webletId != weblet.webletId) {
				weblets[i].order++;
			}
		}
		if (!(row == orow && col == ocol)) {
			// decrease order of source row and col
			for ( var i in weblets) {
				if (weblets[i].row == orow && weblets[i].col == ocol
						&& weblets[i].order > oorder
						&& weblets[i].webletId != weblet.webletId) {
					weblets[i].order--;
				}
			}
		}
	};

	$scope.onDrop = function($event, $data, weblets) {
		row = parseInt($event.target.dataset.row);
		col = parseInt($event.target.dataset.col);
		order = parseInt($event.target.dataset.order);
	}
}

function WebletListingCtrl($scope, $rootScope, $log) {
	$rootScope.showWebletList = function() {
		$('#webletListing').foundation('reveal', 'open');
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
	} ]

	$scope.gWeblets = [ {
		'webletId' : 1,
		'name' : 'Web Content Display',
	}, {
		'webletId' : 13,
		'name' : 'Blog Display',
		'categories' : [ 1 ]
	}, {
		'webletId' : 561,
		'name' : 'Currency Calculator',
		'categories' : [ 2 ]
	}, {
		'webletId' : 51,
		'name' : 'Comments',
		'categories' : [ 1, 3 ]
	} ];
}
