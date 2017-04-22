angular.module('starter.controllers', [])
.constant('AUTH_EVENTS', {
  notAuthenticated: 'auth-not-authenticated'
})
 
.constant('API_ENDPOINT', {
  url: 'http://localhost:8080'
  //  For a simulator use: url: 'http://127.0.0.1:8080/api'
})

.controller('LoginCtrl', function($scope, AuthService, $ionicPopup, $state) {
  $scope.user = {
    name: '',
    password: ''
  };
 
  $scope.login = function() {
    AuthService.login($scope.user).then(function(msg) {
      $state.go('app.users');
    }, function(errMsg) {
      var alertPopup = $ionicPopup.alert({
        title: 'Login failed!',
        template: errMsg
      });
    });
  };
})
 
.controller('RegisterCtrl', function($scope, AuthService, $ionicPopup, $state) {
  $scope.user = {
    name: '',
    password: ''
  };
 
  $scope.signup = function() {
    AuthService.register($scope.user).then(function(msg) {
      $state.go('outside.login');
      var alertPopup = $ionicPopup.alert({
        title: 'Register success!',
        template: msg
      });
    }, function(errMsg) {
      var alertPopup = $ionicPopup.alert({
        title: 'Register failed!',
        template: errMsg
      });
    });
  };
})
 
.controller('InsideCtrl', function($scope, AuthService, API_ENDPOINT, $http, $state) {
  $scope.destroySession = function() {
    AuthService.logout();
  };
 
  $scope.getInfo = function() {
    $http.get(API_ENDPOINT.url + '/memberinfo').then(function(result) {
      $scope.memberinfo = result.data.msg;
    });
  };
 
  $scope.logout = function() {
    AuthService.logout();
    $state.go('outside.login');
  };
})
 
.controller('AppCtrl', function($scope, $state, $ionicPopup, AuthService, AUTH_EVENTS) {
  $scope.$on(AUTH_EVENTS.notAuthenticated, function(event) {
    AuthService.logout();
    $state.go('outside.login');
    var alertPopup = $ionicPopup.alert({
      title: 'Session Lost!',
      template: 'Sorry, You have to login again.'
    });
  });
})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('DoctorCtrl',function($scope,$stateParams,$state,$rootScope,$http,API_ENDPOINT,$ionicFilterBar){
 
 $http.get(API_ENDPOINT.url + '/doctors').then(function(result){
    $scope.doctors= result.data;
    console.log(result.data);
  });

  var Values = [];
  var filterBarInstance;
  ///search bar
  $scope.doRefresh = function () {
    $scope.values = window.Values;
    $scope.$broadcast('scroll.refreshComplete');
  };

  $scope.showFilterBar = function () {
    filterBar = $ionicFilterBar.show({
      items: $scope.doctors,
      update: function (filteredItems) {
        $scope.doctors = filteredItems
      }
      //filterProperties : 'first_name'
    });
  }
})

.controller('PlaylistCtrl', function($scope, $stateParams,$rootScope,$http,API_ENDPOINT) {
})
///doctor details Controller
.controller('DoctorDetailsCtrl',function($scope,$stateParams,$rootScope,$http,API_ENDPOINT){
  console.log('mukul');
  $scope.showTime = false;  
  var slug = $stateParams.doctorname;
  $http.get(API_ENDPOINT.url + '/doctors/'+slug).then(function(result){
    $scope.doctor= result.data;
    console.log($scope.doctor.name);
  });
  $scope.dateValue = new Date();
  $scope.bookAppointment = function(){
    console.log($scope.dateValue);
    $scope.showTime = true;
  }
  $scope.appointment = {
    patient_name:$rootScope.User.name,
    age:12,
    appointment_date:$scope.dateValue
  };
  $scope.confirm = function(appointment){
    var slug = $stateParams.doctorname;
    $http.post(API_ENDPOINT.url + '/doctors/'+slug+'/add',appointment).then(function(result){
      console.log(result);
    });
    $http.post(API_ENDPOINT.url+'/doctors/'+$rootScope.User.name+'/addapp',appointment).then(function(result){
      console.log(result);
  });
}
})
.controller('AppointmentCtrl',function($scope,$state,$stateParams,$rootScope,$http,API_ENDPOINT){
  $scope.dateValue = new Date();
  $scope.appointments = $rootScope.User.appointments;
  console.log($scope.appointments);

})
.controller('UserCtrl',function($scope,$state,$stateParams,$state){
  $scope.nextpage = function(){
    $state.go('app.doctor');
  }
});
