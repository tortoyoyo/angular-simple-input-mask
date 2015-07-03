'use strict';

angular.module('angularMask', [])
  .directive('angularMask', function() {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function($scope, el, attrs, model) {
        var format = attrs.angularMask,
          arrFormat = format.split('|');
        var formatOld;
        var equalFormat = false;
        var oldValue = 0;

        if (arrFormat.length > 1) {
          arrFormat.sort(function(a, b) {
            return a.length - b.length;
          });
        }
        if (el.val().length > 0) {
          model.$formatters.push(mask);
        }
        model.$parsers.push(function(value) {
          model.$viewValue = mask(value);
          if (value.length > 0 && oldValue <= value.length || equalFormat) {
            var modelValue = String(value).replace(/\D/g, '');
            el.val(model.$viewValue);
            oldValue = value.length;
            return modelValue;
          } else {
            oldValue = value.length;
            return value;
          }
        });

        function mask(val) {
          if (val === null) {
            return '';
          }
          var value = String(val).replace(/\D/g, '');
          if (arrFormat.length > 1) {
            for (var a in arrFormat) {
              if (value.replace(/\D/g, '').length <= arrFormat[a].replace(/\D/g, '').length) {
                format = arrFormat[a];
                break;
              }
            }
          }
          var newValue = '';
          if (formatOld !== format) {
            equalFormat = true;
          } else {
            equalFormat = false;
          }
          for (var nmI = 0, mI = 0; mI < format.length;) {
            if (value[nmI] !== undefined || equalFormat) {
              if (format[mI].match(/\D/)) {
                newValue += format[mI];
              } else {
                if (value[nmI] !== undefined) {
                  newValue += value[nmI];
                  nmI++;
                } else {
                  break;
                }
              }
            }
            mI++;

          }
          formatOld = format;
          return newValue;
        }
      }
    };
  });
