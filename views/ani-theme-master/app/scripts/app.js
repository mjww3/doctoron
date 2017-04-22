'use strict';

/**
 * @ngdoc overview
 * @name yapp
 * @description
 * # yapp
 *
 * Main module of the application.
 */
angular
  .module('yapp', [
    'mwl.calendar',
    'ui.router',
    'ngAnimate'
  ])
  .config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.when('/dashboard', '/dashboard/overview');

    $stateProvider
      .state('base', {
        abstract: true,
        url: '',
        templateUrl: 'views/base.html'
      })
        .state('login', {
          url: '/login',
          parent: 'base',
          templateUrl: 'views/login.html',
          controller: 'LoginCtrl'
        })
        .state('dashboard', {
          url: '/dashboard',
          parent: 'base',
          templateUrl: 'views/dashboard.html',
          controller: 'DashboardCtrl'
        })
          .state('overview', {
            url: '/overview',
            parent: 'dashboard',
            templateUrl: 'views/dashboard/overview.html'
          })
          .state('calendar',{
            url:'/calendar',
            parent:'dashboard',
            templateUrl:'views/dashboard/calendar.html',
            controller:'CalendarCtrl'
          })
          .state('reports', {
            url: '/reports',
            parent: 'dashboard',
            templateUrl: 'views/dashboard/reports.html'
          })
          .state('chat',{
            url:'/chat',
            parent:'dashboard',
            templateUrl:'views/dashboard/chat.html',
            controller:'ChatCtrl'
          })
            .state('videochat',{
            url:'/videochat',
            parent:'dashboard',
            templateUrl:'views/dashboard/videochat.html',
            controller:'VideoChatCtrl'
          });

  });
