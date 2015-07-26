angular.module('mover', ['rx']);

angular.module('mover').directive('movingText', function() {
    return {
        restrict: 'E',
        replace: 'true',
        templateUrl: 'js/movingText.html',
        scope: {
            text: '@'
        },
        controller: function($scope, rx, $element, $window, $document) {

            var textContainer = $element.find('.text-container')[0];

            function getOffset(element) {
              var doc = element.ownerDocument,
                  docElem = doc.documentElement,
                  body = doc.body,
                  clientTop  = docElem.clientTop  || body.clientTop  || 0,
                  clientLeft = docElem.clientLeft || body.clientLeft || 0,
                  scrollTop  = $window.pageYOffset,
                  scrollLeft = $window.pageXOffset;

              return {
                top: scrollTop   - clientTop,
                left: scrollLeft - clientLeft };
            }


           $scope.letters = [];

           var mouseMoved = rx.Observable.fromEvent($document, 'mousemove')
              .map(function (e) {
                var offset = getOffset(textContainer);
                return {
                  offsetX : e.clientX - offset.left,
                  offsetY : e.clientY - offset.top
                };
              })
              .flatMap(function(delta) {
                return rx.Observable.fromArray(_.map($scope.text, function(letter, index) {
                  return {
                    letter: letter,
                    delta: delta,
                    index: index
                  };
                }));
              })
              .flatMap(function(letterConfig) {
                return rx.Observable.timer(letterConfig.index * 100)
                  .map(function() {
                    return {
                      text: letterConfig.letter,
                      top: letterConfig.delta.offsetY,
                      left: letterConfig.delta.offsetX + letterConfig.index * 20 + 15,
                      index: letterConfig.index
                    };
                });
              }).
              subscribe(function(letterConfig) {
                $scope.$apply(function() {
                  $scope.letters[letterConfig.index] = letterConfig;
                });
              });

           $scope.$on('$destroy', function(){
             mouseMoved.dispose();
           });





        }

    };
});
angular.module('mover').controller('MainCtrl',
    function(rx, $scope) {





});

