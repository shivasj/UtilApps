(function() {
    'use strict';
    angular.module('demo.app.home', [])
        .config(function ($stateProvider, $urlRouterProvider,appMenuProvider) {
            var now = new Date();
            var ticks = now.getTime();

            // States
            $stateProvider
                .state('app', {
                    abstract: true,
                    views: {
                        sidebarLeft: {
                            templateUrl: 'components/layout/leftsidenav.html',
                            controller: 'LeftSideNavController',
                            controllerAs: 'vm'
                        },
                        toolbar: {
                            templateUrl: 'components/layout/toptoolbar.html',
                            controller: 'TopToolbarController',
                            controllerAs: 'vm'
                        },
                        navbar: {
                            template: '<div ui-view="navbar"></div>'
                        },
                        content: {
                            template: '<div flex ui-view="content"></div>'
                        },
                        footer: {
                            templateUrl: 'components/layout/footer.html',
                            controller: 'FooterController',
                            controllerAs: 'vm'
                        },
                        sidebarRight: {
                            templateUrl: 'components/layout/rightsidenav.html',
                            controller: 'RightSideNavController',
                            controllerAs: 'vm'
                        }
                    }
                })
                .state('app.home', {
                    url: '/',
                    views: {
                        // navbar: {
                        //     templateUrl: 'components/layout/navbar.html',
                        //     controller: 'ProjectNavbarController',
                        //     controllerAs: 'vm'
                        // },
                        content: {
                            templateUrl: 'components/home/home.html?'+ticks,
                            controller: 'HomeController',
                            controllerAs: 'vm'
                        }
                    }
                })

            // set default routes when no path specified
            $urlRouterProvider.when('', '/');

            // 404 if route not found
            $urlRouterProvider.otherwise('/');

        })
        .service('DataService',function ($http, $q, $timeout,AppConfig){
            var self = this;

            var now = function () { return new Date(); };
            var ticks = now().getTime();
            var cache = {};

            // Get data
        })
        .controller('HomeController',function(DataService,AppService,$state, $stateParams,LayoutService){
            var self = this;
            console.log("HomeController");

            // Menu Options
            //LayoutService.setLayout('sideMenuSize','o');

            self.Navigate = function (path) {
                $state.go(path);
            }

        })

})();