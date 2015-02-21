/**
 * Created by jovinbm on 1/14/15.
 */
angular.module('qaApp')
    .filter("sortObjectToArray", [function () {
        return function (obj, spliceToEndPosition) {
            var pos;
            if (spliceToEndPosition) {
                pos = spliceToEndPosition;
            } else {
                pos = 0;
            }
            var result = [];
            var keys = Object.keys(obj);
            var parsedKeys = keys.map(function (x) {
                return parseInt(x);
            });
            parsedKeys.sort(function (a, b) {
                return a - b;
            }).reverse();
            for (var i = pos, len = keys.length; i < len; i++) {
                result.push(obj[parsedKeys[i]]);
            }
            return result;
        };
    }])