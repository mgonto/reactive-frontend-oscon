angular.module('counter', ['rx']);

angular.module('counter').service('ApiServer', function($q) {
    this.getCounterAmount = function(dt) {
        var random = Math.floor((Math.random()*10)+1);
        var deferred = $q.defer();

        deferred.resolve(random);

        return deferred.promise;
    }

    this.logCounter = function(val) {
        console.log("Current value logged is", val);
    }
});

angular.module('counter').controller('MainCtrl',
    function(ApiServer, rx, $scope) {

        $scope.counter = 0;

        var disposable = $scope.$createObservableFunction('increaseCounter')
        .flatMap(function() {
            return rx.Observable.fromPromise(ApiServer.getCounterAmount(new Date()));
        })
        .do(ApiServer.logCounter)
        .scan(function(acc, val) {return acc + val})
        .subscribe(function(counter) {
            $scope.counter = counter;
            console.log("Total counter is", counter);
        }, function(error) {
            console.error("There was an error");
        });

        $scope.$on('$destroy', function() {
          disposable.dispose();
        });
});

