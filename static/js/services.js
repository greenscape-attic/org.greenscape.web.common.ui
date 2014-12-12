var services = angular.module('services', []);

services.factory('UserService', [ function() {
	var sdo = {
		'isSignedIn' : false,
		'username' : '',
		'email' : '',
		'firstName' : '',
		'middleName' : '',
		'lastName' : ''
	};
	return sdo;
} ]);