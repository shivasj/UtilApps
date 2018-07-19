(function() {
    'use strict';
    angular.module('ngMdMultiLevelMenu', ['ngMdIcons'])
        .directive('mdMultiLevelMenu',function ($animate) {
            // Init Variables
            var MENU_STYLE = {
                REPLACE: 1,
                ACCORDION: 2
            }
            var template = 'components/common/md-multilevel-menu.html'

            // Controller
            function controller($scope, $element) {
                var $this = this;

                // On Select call the callback function if it has been defined
                $scope.select = function(item) {
                    if (typeof $scope.callback == 'function') {
                        $scope.callback(item);
                    }
                };

                $scope.reset = function() {
                    // $scope.breadcrumb = $attrs.breadcrumb;
                    //$scope.style = $scope.mdStyle;
                    $scope.STYLE = MENU_STYLE;
                    $scope.stack = [];
                    $scope.current = {
                        label: $scope.title,
                        items : $scope.menuItems
                    };
                };

                $scope.click = function(item) {
                    // If the node is a parent node
                    if (item.items) {
                        if ($scope.style == MENU_STYLE.REPLACE) {
                            var widget = angular.element('md-list.menu#' + $scope.id);
                            $animate.addClass(widget, 'left').then(function() {
                                $scope.stack.push($scope.current);
                                $scope.current = {
                                    label: item.label,
                                    items: item.items
                                };
                                widget.removeClass('ng-animate');
                                widget.removeClass('left');
                                widget.addClass('right');
                                widget.addClass('ng-animate');
                                $animate.removeClass(widget, 'right');
                            });
                        }
                        if ($scope.style == MENU_STYLE.ACCORDION) {
                            var expandState = !item.expanded;
                            // If only one menu can be open at a time
                            if(!$scope.allowMultiOpen){
                                $scope.closeAll();
                            }

                            item.expanded = expandState;
                            console.log(item.expanded)
                        }
                    }
                    $scope.select(item);
                };

                $scope.back = function(index) {
                    var left = $scope.stack.length - index;
                    var widget = angular.element('md-list.menu#' + $scope.id);
                    $animate.addClass(widget, 'right').then(function() {
                        do var previous = $scope.stack.pop();
                        while (--left);
                        $scope.current = previous;
                        widget.removeClass('ng-animate');
                        widget.removeClass('right');
                        widget.addClass('left');
                        widget.addClass('ng-animate');
                        $animate.removeClass(widget, 'left');
                    });
                };

                // $scope.$on('reset', function(event) {
                //     walk($scope.menuItems, function(item) {
                //         item.expanded = false;
                //     });
                //     $scope.reset();
                // });

                //console.log($scope)

                $scope.closeAll = function () {
                    walk($scope.menuItems, function(item) {
                        item.expanded = false;
                    });
                }
            }

            // Link function
            function link(scope, element, attributes, controller) {

                scope.id = attributes.id || Math.random().toString(36).substr(2, 5);

                if(!scope.title){
                    scope.title = 'Menu';
                }
                if(!scope.previous){
                    scope.previous = 'Back';
                }
                scope.breadcrumb = $boolean(scope.breadcrumbStr);
                scope.allowMultiOpen = $boolean(scope.allowMultiOpenStr);

                console.log(MENU_STYLE[scope.styleStr])
                if (MENU_STYLE[scope.styleStr]) {
                    scope.style = MENU_STYLE[scope.styleStr];
                } else {
                    scope.style = 1;
                }

                console.log('link',scope)
            }

            return {
                restrict: 'E',
                replace: true,
                controller: controller,
                templateUrl: template,
                scope: {
                    menuItems : '=',
                    styleStr : '@mdStyle',
                    title : '@mdTitle',
                    back : '@mdBack',
                    breadcrumbStr : '@mdBreadcrumb',
                    allowMultiOpenStr : '@mdAllowMultiOpen'
                },
                link: {
                    pre: link
                }
            }
        })

    function walk (items, callback) {
        for (var each in items) {
            var item = items[each];
            if (callback(item)) {
                return item;
            }
            item = walk(item.items, callback);
            if (item) {
                return item;
            }
        }
    }
    function $boolean(variable) {
        return (typeof variable === 'string' && variable === 'true');
    }

})();