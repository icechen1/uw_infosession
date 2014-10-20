angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout,$location) {
  // Form data for the calendar modal
  $scope.calendarData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/calendar.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeDateChooser = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.selectMonth = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doCalendar= function() {
    console.log('Changing date');

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('EventsCtrl', function($scope,$http,$q) {
  $scope.events = [
    { company: 'Loading...'}
  ];
    
  $http.get('http://uw-infosession.herokuapp.com/api/calendar/').
    success(function(data, status, headers, config) {
      $scope.events = data;
      console.log($scope.events);
      //Load up more details
      var promises = [];
      for(event_info of $scope.events){
        //console.log(event_info.id);
        var request = $http.get('http://uw-infosession.herokuapp.com/api/event/'+event_info.id);
        promises.push(request); //QUEUE THE REQUEST
      }
     $q.all(promises).then(function(values) {
         //console.log(values);
         for (var i = 0; i < values.length; ++i) {
            $scope.events[i].details = values[i].data;
        }
         console.log($scope.events);
     });
    }).
    error(function(data, status, headers, config) {
      // log error
    });
    
    //Comparator for dates (compare to current time)
    $scope.isPast = function(item){
    console.log(item)
     return new Date(item.datetime) >= new Date();
    };
})

.controller('EventCtrl', function($scope, $stateParams,$http) {
    $scope.id = $stateParams.id;
    $scope.item = {company:"Loading..."};

    $http.get('http://uw-infosession.herokuapp.com/api/event/'+$scope.id).
    success(function(data, status, headers, config) {
      $scope.item = data;
    }).
    error(function(data, status, headers, config) {
      // log error
    });
});
