(function() {
    'use strict';
    angular.module('demo.app', [
        'ui.router'
        ,'ngSanitize'
        ,'ngMaterial'
        ,'ngMessages'
        ,'ngMdMultiLevelMenu'
        ,'ui.load'
        ,'LocalStorageModule'
        ,'demo.app.config'
        ,'demo.app.common'
        ,'demo.app.layout'
        ,'demo.app.home'
    ])
        .config(function($mdThemingProvider){
            // Update the theme colors to use themes on font-icons
            $mdThemingProvider.theme('default')
                .primaryPalette("red")
                .accentPalette('green')
                .warnPalette('blue');
        })
        .service('AppService',function(uiLoad,$window){
            var self = this;

            self.GetScreenWidth = function () {
                return $window.innerWidth;
            }
            self.IsMobile = function(){
                if($window.innerWidth < 700){
                    return true;
                }else{
                    return false;
                }
            }

            // Load External Libraries
            self.d3 = function () {
                return uiLoad.load('lib/d3/d3.min.js');
            }
            self.d3components = function () {
                return uiLoad.load('extcomponents/d3components/d3components.js');
            }
            self.Papa = function () {
                return uiLoad.load('lib/papaparse/papaparse.min.js').then(function () {
                    Papa.SCRIPT_PATH = 'lib/papaparse/papaparse.min.js';
                });
            }

            self.LoadTopoJson = function () {
                if(typeof topojson == 'undefined'){
                    $.getScript('lib/topojson/topojson.min.js', function () {

                    })
                }
            }
            self.LoadLodash = function () {
                if(typeof _ == 'undefined'){
                    $.getScript('lib/lodash/lodash.core.min.js', function () {

                    })
                }
            }
        })
        .controller('AppController', function (AppService) {
            var self = this;
            console.log("AppController");

        })

})();

