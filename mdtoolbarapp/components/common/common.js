(function() {
    'use strict';
    angular.module('demo.app.common', [])
        .filter('ExistsInArray', function($filter){
            return function(list, arrayFilter, element1,element2){
                //console.log(arrayFilter);
                //console.log(element1+'-'+element2);
                if(arrayFilter){
                    return $filter("filter")(list, function(listItem){
                        //return arrayFilter.indexOf(listItem[element]) != -1;
                        return (_.findIndex(arrayFilter, function(o) { return listItem[element1] == o[element2]; }) != -1)
                    });

                    //return list;
                }else{
                    return list;
                }
            };
        })
        .filter('NotExistsInArray', function($filter){
            return function(list, arrayFilter, element1,element2){
                //console.log(arrayFilter);
                //console.log(element1+'-'+element2);
                if(arrayFilter){
                    return $filter("filter")(list, function(listItem){
                        //return arrayFilter.indexOf(listItem[element]) != -1;
                        return (_.findIndex(arrayFilter, function(o) { return listItem[element1] == o[element2]; }) == -1)
                    });

                    //return list;
                }else{
                    return list;
                }
            };
        })
        .filter('IsNotNull', function($filter){
            return function(list, columnname){
                //console.log(arrayFilter);
                //console.log(element1+'-'+element2);
                if(columnname){
                    return $filter("filter")(list, function(listItem){
                        //return (_.findIndex(arrayFilter, function(o) { return listItem[element1] == o[element2]; }) != -1)
                        return listItem[columnname] != '';
                    });

                }else{
                    return list;
                }
            };
        })
        .filter('percentage', ['$filter', function ($filter) {
            return function (input, decimals) {
                if(input < 0.01 && decimals ==0){
                    return $filter('number')(input * 100, 1) + '%';
                }else{
                    return $filter('number')(input * 100, decimals) + '%';
                }

            };
        }])
        .filter('shortNumber',function () {
            return function (number, fractionSize){
                if(number === null) return null;
                if(number === 0) return "0";
                if(number == NaN) return "";
                if(!number) return "";

                if(!fractionSize || fractionSize < 0)
                    fractionSize = 1;

                var abs = Math.abs(number);
                var rounder = Math.pow(10,fractionSize);
                var isNegative = number < 0;
                var key = '';
                var powers = [
                    {key: "Q", value: Math.pow(10,15)},
                    {key: "T", value: Math.pow(10,12)},
                    {key: "B", value: Math.pow(10,9)},
                    {key: "M", value: Math.pow(10,6)},
                    {key: "K", value: 1000},
                    {key: "", value: 1}
                ];

                for(var i = 0; i < powers.length; i++) {

                    var reduced = abs / powers[i].value;

                    reduced = Math.round(reduced * rounder) / rounder;

                    if(reduced >= 1){
                        abs = reduced;
                        key = powers[i].key;
                        break;
                    }
                }

                return (isNegative ? '-' : '') + abs + key;
            };
        })
        .filter('applyFilter', function($filter) {
            return function(value, filterName) {
                if(filterName === null) return value;
                if(!filterName) return value;

                // Check if we have arguments
                var filt = filterName.split(':');

                return $filter(filt[0])(value,filt[1]);
                //var fName = [].splice.call(arguments, 1, 1)[0];
                //return $filter(filterName).apply(null, value);
            };
        })
})();