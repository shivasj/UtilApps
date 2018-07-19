(function() {
    'use strict';
    angular.module('demo.app.layout', [])
        .provider('appMenu', function () {
            // Provider
            var menuArray = [];

            this.addMenu = addMenu;
            this.removeMenu = removeMenu;
            this.removeAllMenu = removeAllMenu;

            function addMenu(item) {
                menuArray.push(item);
            }

            function getMenu(id) {
                return findMenu(menuArray, id);
            }

            function removeMenu(state, params) {
                findAndDestroyMenu(menuArray, state, params);
            }

            function removeAllMenu() {
                for (var i = menuArray.length - 1; i >= 0 ; i--) {
                    menuArray.splice(i, 1);
                }
            }

            function findMenu(menu, id) {
                var found;
                if (menu instanceof Array) {
                    for (var i = 0; i < menu.length; i++) {
                        if(menu[i].id === id) {
                            found = menu[i];
                            break;
                        }
                        else if(angular.isDefined(menu[i].children)) {
                            found = findMenu(menu[i].children, id);
                            if(angular.isDefined(found)) {
                                break;
                            }
                        }
                    }
                }
                return found;
            }

            function findAndDestroyMenu(menu, state, params, isChildren) {
                if (menu instanceof Array) {
                    for (var i = menu.length - 1; i >= 0 ; i--) {
                        if(menu[i].state === state && angular.equals(menu[i].params, params)) {
                            menu.splice(i, 1);
                            if (!isNaN(isChildren) && !menuArray[isChildren].children.length) {
                                menuArray.splice(isChildren, 1);
                            }
                            break;
                        }
                        else if(angular.isDefined(menu[i].children)) {
                            findAndDestroyMenu(menu[i].children, state, params, i);
                        }
                    }
                }
            }

            // Service
            this.$get = function() {
                return {
                    menu: menuArray,
                    addMenu: addMenu,
                    getMenu: getMenu,
                    removeMenu: removeMenu,
                    removeAllMenu: removeAllMenu
                };
            };
        })
        .directive('triMenu', function ($location, $mdTheming) {
            var directive = {
                restrict: 'E',
                template: '<md-content><app-menu-item ng-repeat="item in appMenuController.menu | orderBy:\'priority\'" item="::item"></app-menu-item></md-content>',
                scope: {},
                controller: appMenuController,
                controllerAs: 'appMenuController',
                link: link
            };
            return directive;

            function link($scope, $element) {
                $mdTheming($element);
                //var $mdTheme = $element.controller('mdTheme');

                // var menuColor = triTheming.getThemeHue($mdTheme.$mdTheme, 'primary', 'default');
                // var menuColorRGBA = triTheming.rgba(menuColor.value);
                // $element.css({ 'background-color': menuColorRGBA });
                // $element.children('md-content').css({ 'background-color': menuColorRGBA });
            }
            function appMenuController(appMenu) {
                var appMenuController = this;
                // get the menu and order it
                appMenuController.menu = appMenu.menu;
            }
        })
        .service('LayoutService',function(){
            var self = this;

            self.layout = {
                sideMenuSize: 'none',
                showToolbar: true,
                showNavbar: true,
                toolbarSize: '',
                toolbarClass: '',
                toolbarStyle: {'background-color': '#004466'},
                navbarSize: '',
                navbarClass: '',
                navbarStyle: {'background-color': '#ffffff'},
                showFooter: false
            }
            self.setLayout = function (key,value) {
                self.layout[key] = value;
            }

            return self;
        })
        .controller('LeftSideNavController',function(LayoutService){
            var self = this;
            console.log("LeftSideNavController");

            self.LayoutService = LayoutService;

        })
        .controller('TopToolbarController',function(LayoutService,$mdMedia,$document){
            var self = this;
            console.log("TopToolbarController");

            self.LayoutService = LayoutService;
            self.isFullScreen = false;
            self.fullScreenIcon = 'zmdi zmdi-fullscreen';

            self.hideMenuButton = function () {
                switch(LayoutService.layout.sideMenuSize) {
                    case 'hidden':
                        // always show button if menu is hidden
                        return false;
                    case 'off':
                        // never show button if menu is turned off
                        return true;
                    default:
                        // show the menu button when screen is mobile and menu is hidden
                        return $mdMedia('gt-sm');
                }
            }
            self.toggleFullScreen = function() {
                self.isFullScreen = !vm.isFullScreen;
                self.fullScreenIcon = vm.isFullScreen ? 'zmdi zmdi-fullscreen-exit':'zmdi zmdi-fullscreen';
                // more info here: https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API
                var doc = $document[0];
                if (!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement ) {
                    if (doc.documentElement.requestFullscreen) {
                        doc.documentElement.requestFullscreen();
                    } else if (doc.documentElement.msRequestFullscreen) {
                        doc.documentElement.msRequestFullscreen();
                    } else if (doc.documentElement.mozRequestFullScreen) {
                        doc.documentElement.mozRequestFullScreen();
                    } else if (doc.documentElement.webkitRequestFullscreen) {
                        doc.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
                    }
                } else {
                    if (doc.exitFullscreen) {
                        doc.exitFullscreen();
                    } else if (doc.msExitFullscreen) {
                        doc.msExitFullscreen();
                    } else if (doc.mozCancelFullScreen) {
                        doc.mozCancelFullScreen();
                    } else if (doc.webkitExitFullscreen) {
                        doc.webkitExitFullscreen();
                    }
                }
            }


        })
        .controller('RightSideNavController',function(LayoutService){
            var self = this;
            console.log("RightSideNavController");

            self.LayoutService = LayoutService;

        })
        .controller('FooterController',function(LayoutService){
            var self = this;
            console.log("FooterController");

            self.LayoutService = LayoutService;

        })

})();