(function () {
    angular.module('standingOut.services', ['ngResource'])
        .constant('API', (function () {
            var url = window.location.href;
            var path = '/';

            var localLive = false;

            //if (!localLive && (url.indexOf('localhost') == 0 || url.indexOf('localhost') == 7 || url.indexOf('localhost') == 8)) {
            //    path = 'http://localhost:5666';
            //}

            return path;
        })());
})();
