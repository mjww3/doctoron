'use strict';

/**
 * @ngdoc function
 * @name yapp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of yapp
 */
var app = angular.module('yapp');
app.controller('DashboardCtrl', function($scope, $state, AuthService) {

    $scope.$state = $state;

    $scope.gotoCalendar = function(){
    	$state.go('calendar');
    	console.log("calendar");
    }

    $scope.gotoChat = function(){
    	$state.go('Chat');
    	console.log("Chat");
    }

 });


