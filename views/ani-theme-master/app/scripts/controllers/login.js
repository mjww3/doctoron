'use strict';

/**
 * @ngdoc function
 * @name yapp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of yapp
 */
var app = angular.module('yapp');
app.constant('AUTH_EVENTS',{
	notAuthenticated:"auth-not-authenticated"
});

app.constant('API_ENDPOINT',{
	url:'http://localhost:8080'
});

app.service('AuthService',function($q,$http,API_ENDPOINT){
	var LOCAL_TOKEN_KEY = 'yourTokenKey';
	var isAuthenticated = false;
	var authToken;

	function loadUserCredentials(){
		var token = window.localStorage.getItem(LOCAL_TOKEN_KEY);
		if(token){
			useCredentials(token);
		}
	}

	function storeUserCredentials(token){
		window.localStorage.setItem(LOCAL_TOKEN_KEY,token);
		useCredentials(token);
	}

	function useCredentials(token){
		isAuthenticated = true;
		authToken = token;

		$http.defaults.header.common.Authorization = authToken;
	}

	function destroyUserCredentials(){
		authToken = undefined;
		isAuthenticated = false;
		$http.defaults.header.common.Authorization = undefined;
		window.localStorage.removeItem(LOCAL_TOKEN_KEY);
	}

	var register = function(user){
		return $q(function(resolve,reject){
			$http.post(API_ENDPOINT.url+'/signup',user).then(function(result){
				if(result.data.success){
					resolve(result.data.msg);
				}else{
					reject(result.data.msg);
				}
			});
		});
	}

	function login(user){
		return $q(function(resolve,reject){
			$http.post(API_ENDPOINT.url+'/authenticate,user').then(function(result){
				if(result.data.success){
					storeUserCredentials(result.data.token);
					resolve(result.data.msg);
				}else{
					reject(result.data.msg);
				}
			});
		});
	}

	var logout = function() {
	  destroyUserCredentials();
	};
	
	loadUserCredentials();
});

app.controller('LoginCtrl', function($scope, $location,$state,AuthService) {
	
	$scope.user = {
	  name: '',
	  password: ''
	};

	$scope.submit = function(){
		AuthService.login($scope.user).then(function(msg){
			$state.go('dashboard');
			console.log("Logged in");
		},function(errMsg){
			alert("there is error can't login in");
		});
	};

	$scope.gotoRegister = function(){
		$state.go('dashboard');
	};


  });

app.controller('CalendarCtrl',function($scope,$rootScope,calendarConfig,moment){
	var vm = this;

	  //These variables MUST be set as a minimum for the calendar to work
	  vm.calendarView = 'month';
	  vm.viewDate = new Date();
	  var actions = [{
	    label: '<i class=\'glyphicon glyphicon-pencil\'></i>',
	    onClick: function(args) {
	      alert.show('Edited', args.calendarEvent);
	    }
	  }, {
	    label: '<i class=\'glyphicon glyphicon-remove\'></i>',
	    onClick: function(args) {
	      alert.show('Deleted', args.calendarEvent);
	    }
	  }];
	  vm.events = [
	    {
	      title: 'An event',
	      color: calendarConfig.colorTypes.warning,
	      startsAt: moment().startOf('week').subtract(2, 'days').add(8, 'hours').toDate(),
	      endsAt: moment().startOf('week').add(1, 'week').add(9, 'hours').toDate(),
	      draggable: true,
	      resizable: true,
	      actions: actions
	    }, {
	      title: '<i class="glyphicon glyphicon-asterisk"></i> <span class="text-primary">Another event</span>, with a <i>html</i> title',
	      color: calendarConfig.colorTypes.info,
	      startsAt: moment().subtract(1, 'day').toDate(),
	      endsAt: moment().add(5, 'days').toDate(),
	      draggable: true,
	      resizable: true,
	      actions: actions
	    }, {
	      title: 'This is a really long event title that occurs on every year',
	      color: calendarConfig.colorTypes.important,
	      startsAt: moment().startOf('day').add(7, 'hours').toDate(),
	      endsAt: moment().startOf('day').add(19, 'hours').toDate(),
	      recursOn: 'year',
	      draggable: true,
	      resizable: true,
	      actions: actions
	    }
	  ];

	  vm.cellIsOpen = true;

	  vm.addEvent = function() {
	    vm.events.push({
	      title: 'New event',
	      startsAt: moment().startOf('day').toDate(),
	      endsAt: moment().endOf('day').toDate(),
	      color: calendarConfig.colorTypes.important,
	      draggable: true,
	      resizable: true
	    });
	  };

	  vm.eventClicked = function(event) {
	    alert.show('Clicked', event);
	  };

	  vm.eventEdited = function(event) {
	    alert.show('Edited', event);
	  };

	  vm.eventDeleted = function(event) {
	    alert.show('Deleted', event);
	  };

	  vm.eventTimesChanged = function(event) {
	    alert.show('Dropped or resized', event);
	  };

	  vm.toggle = function($event, field, event) {
	    $event.preventDefault();
	    $event.stopPropagation();
	    event[field] = !event[field];
	  };

	  vm.timespanClicked = function(date, cell) {

	    if (vm.calendarView === 'month') {
	      if ((vm.cellIsOpen && moment(date).startOf('day').isSame(moment(vm.viewDate).startOf('day'))) || cell.events.length === 0 || !cell.inMonth) {
	        vm.cellIsOpen = false;
	      } else {
	        vm.cellIsOpen = true;
	        vm.viewDate = date;
	      }
	    } else if (vm.calendarView === 'year') {
	      if ((vm.cellIsOpen && moment(date).startOf('month').isSame(moment(vm.viewDate).startOf('month'))) || cell.events.length === 0) {
	        vm.cellIsOpen = false;
	      } else {
	        vm.cellIsOpen = true;
	        vm.viewDate = date;
	      }
	    }

	  };
});

app.controller('ChatCtrl',function($scope,$rootScope,$state){

console.log("mukul");
});

