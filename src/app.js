var app = angular.module('app',
    [
        'ngStorage','ngResource',
        'ui.router', 'ngRoute',
        'ngAnimate', 'ngAria', 'ngMaterial',
        'ui.bootstrap',
    ]);

// Load the google charts API
google.charts.load('43', {'packages': ['corechart']});

// Load the angular app after the visualization API is loaded.
google.charts.setOnLoadCallback(function() {
    angular.bootstrap(document.body, ['app']);
});

// URL_ROOT
//app.constant('baseUrl', 'http://swps.ap-southeast-1.elasticbeanstalk.com/api/v1/');
app.constant('baseUrl', 'http://localhost:9000/api/v1/');

// $resourceProvider config
app.config(['$resourceProvider', function ($resourceProvider) {
    $resourceProvider.defaults.stripTrailingSlashes = false;
}]);

// ui.router config
app.config(['$urlRouterProvider', '$stateProvider', function ($urlRouterProvider, $stateProvider) {
    $stateProvider
        .state('home', {
            url: '/',
            templateUrl: 'templates/home.html',
            controller: 'MainCtrl'
        })
        .state('login', {
            url: '/login',
            templateUrl: 'templates/login.html',
            controller: 'LoginCtrl'
        })
        .state('myaccount', {
            url: '/profile',
            templateUrl: 'templates/account.html',
            controller: 'UserCtrl'
        })
        .state('users', {
            url: '/users',
            templateUrl: 'templates/users.html',
            controller: 'UserCtrl'
        })
        .state('addUser', {
            url: '/signup',
            templateUrl: 'templates/signup.html',
            controller: 'UserCtrl',
        })
        .state('addMachine', {
            url: '/new-machine',
            templateUrl: 'templates/add-machine.html',
            controller: 'MachineCtrl'
        })
        .state('machines', {
            url: '/machines',
            templateUrl: 'templates/machines.html',
            controller: 'MachineCtrl'
        })
        .state('monitor', {
            url: '/monitor/:mid',
            templateUrl: 'templates/monitor.html',
            controller: 'MachineCtrl'
        })
        .state('monitor.stream', {
            url: '/live',
            templateUrl: 'templates/monitor.stream.html',
            controller: 'MachineCtrl'
        })
        .state('monitor.past', {
            url: '/past',
            templateUrl: 'templates/monitor.past.html',
            controller: 'MachineCtrl'
        })
        .state('monitor.liveCharts', {
            url: '/charts',
            templateUrl: 'templates/monitor.charts.live.html',
            controller: 'ChartsCtrl'
        })
        .state('monitor.graphs', {
            url: '/graphs',
            templateUrl: 'templates/monitor.charts.html',
            controller: 'ChartsCtrl'
        })        
        .state('monitor.dashboard', {
            url: '/dashboard',
            templateUrl: 'templates/monitor.dashboard.html',
            controller: 'DashboardCtrl'
        })
        .state('monitor.editMachine', {
           url: '/edit-machine-info',
           templateUrl: 'templates/edit-machine.html',
           controller: 'MachineCtrl'
        })
        .state('analytics', {
            url: '/analysis',
            templateUrl: 'templates/Analytics.html',
            controller: 'ChartsCtrl'
        })
        .state('support', {
            url: '/support',
            templateUrl: 'templates/support.html',
            controller: 'SupportCtrl'
        })
        .state('support.newComplaint', {
            url: '/new-complaint',
            templateUrl: 'templates/support.complaints.new.html',
            controller: 'SupportCtrl'
        })
        .state('support.complaints', {
            url: '/complaints',
            templateUrl: 'templates/support.complaints.list.html',
            controller: 'SupportCtrl'
        })
        .state('support.service', {
            url: '/service',
            templateUrl: 'templates/support.service.html',
            controller: 'SupportCtrl'
        });
    $urlRouterProvider.otherwise('/');
}]);

// authorization config
app.factory('httpRequestInterceptor', ['$localStorage', function ($localStorage) {
    return {
        request: function (config) {
            config.headers = {'Content-Type': 'application/json'};
            if($localStorage.token)
                config.headers.Authorization = 'Token ' + $localStorage.token;
            return config;
        }
    };
}]);

app.config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push('httpRequestInterceptor');
}]);


app.filter('startFrom', function() {
    return function(input, start) {
        if (!input || !input.length) { return; }
        start = +start; //parse to int
        return input.slice(start);
    }
});