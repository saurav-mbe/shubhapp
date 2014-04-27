// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform,$location,$rootScope,dbhelper) {
  var media = null;
  $rootScope.isDeviceReady = false;
  var setDeviceReady = function(src) {
    $rootScope.isDeviceReady = true;
  };
  document.addEventListener("deviceready",setDeviceReady,false);
  $rootScope.location = $location;
  //var db= window.openDatabase("shubhapp","1.0","shubhdb",200000);
  dbhelper.populateDB();
  $ionicPlatform.ready(function() {
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

    // setup an abstract state for the tabs directive
    .state('tab', {
      url: "/tab",
      abstract: true,
      templateUrl: "templates/tabs.html"
    })

    // Each tab has its own nav history stack:

    .state('tab.clothes', {
      url: '/clothes',
      views: {
        'tab-clothes': {
          templateUrl: 'templates/tab-dash.html',
          controller: 'DashCtrl'
        }
      },
      data : {
      title : 'Clothes',
      catId : 1,
      hash:'clothes',
      mp3 : 'malmal.mp3'
    }
    })

    .state('tab.shoes', {
      url: '/shoes',
      views: {
        'tab-shoes': {
          templateUrl: 'templates/tab-dash.html',
          controller: 'DashCtrl'
        }
      },
        data : {
      title : 'Shoes',
      catId : 2,
      hash:'shoes',
      mp3 : "sandal.mp3"
    }
    })
    .state('tab.friend-detail', {
      url: '/shoes/:catId',
      views: {
        'tab-shoes': {
          templateUrl: 'templates/friend-detail.html',
          controller: 'FriendDetailCtrl'
        }
      }
    })

    .state('tab.accessories', {
      url: '/accessories',
      views: {
        'tab-accessories': {
          templateUrl: 'templates/tab-dash.html',
          controller: 'DashCtrl'
        }
      },
        data : {
      title : 'Accessories',
      catId : 3,
      hash:'accessories',
      mp3:"sona.mp3"
    }
    })
    .state('tab.clothes-list', {
      url: '/clothes/:catId',
      views: {
        'tab-clothes': {
          templateUrl: 'templates/friend-detail.html',
          controller: 'FriendDetailCtrl'
        }
      }     
    })
    .state('tab.accessories-list', {
      url: '/accessories/:catId',
      views: {
        'tab-accessories': {
          templateUrl: 'templates/friend-detail.html',
          controller: 'FriendDetailCtrl'
        }
      }
    })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/clothes');

});

