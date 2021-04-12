(function () {
    angular.module('standingOut.services').factory('DragDropService',
        ['$window', '$document',
            function ($window, $document) {
                var container = undefined;
                if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
                    container = document.getElementsByTagName('body')[0];
                } else {
                    container = document.getElementsByTagName('html')[0];
                    var siteheight = $(document).height();
                    $('body').css({ "max-height": siteheight + 'px', 'height': siteheight + 'px' });
                }

                return {
                    dragMove: function (itemPosition, containment, eventObj) {                        
                        if (eventObj) {
                            var targetY;
                            
                            targetY = eventObj.pageY - ($window.pageYOffset || $document[0].documentElement.scrollTop);
                            var targetX = eventObj.pageX - ($window.pageXOffset || $document[0].documentElement.scrollLeft);

                            var containerData = {
                                top: container.clientTop,
                                bottom: container.clientTop + container.clientHeight,
                                left: container.clientLeft,
                                right: container.clientLeft + container.clientWidth,
                                offsetLeft: container.offsetLeft,
                                offsetRight: container.offsetTop
                            };

                            var Configuration = { ScrollSpeed: 80 };

                            if (targetY < container.clientTop + container.offsetTop) {
                                container.scrollTop = container.scrollTop - Configuration.ScrollSpeed;
                            } else if (targetY > container.clientTop + container.clientHeight) {
                                container.scrollTop = container.scrollTop + Configuration.ScrollSpeed;
                            }

                            if (targetX < container.clientLeft + container.offsetLeft) {
                                container.scrollLeft = container.scrollLeft - Configuration.ScrollSpeed;
                            } else if (targetX > container.clientLeft + container.clientWidth) {
                                container.scrollLeft = container.scrollLeft + Configuration.ScrollSpeed;
                            }
                        }
                    }
                };            
            }
        ]);
})();