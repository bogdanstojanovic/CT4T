/// <reference path="../Resources/Definitions/angular.d.ts" />

(function () {
    /**
     * The Angular CT4T Application Module
     */
    var application = angular.module("CT4TApp", []);

    /**
     * Service for DI of the CT4T library.
     */
    application.factory("CT4T", function () {
        return ClientTemplating4T;
    });

    /**
     * Controller for single component presentation.
     */
    application.controller("ComponentPresentationController", ["$scope", "CT4T", function ($scope, CT4T: typeof ClientTemplating4T) {

        CT4T.getComponent($scope.publicationId, $scope.componentId, function (error, component) {
            if (!$scope.$$phase) {
                $scope.$apply(function () {
                    $scope.model = component;
                });
            }

        });
    }]);

    /**
     * Controller for getting multiple component presentations.
     */
    application.controller("ComponentPresentationsController", ["$scope", "CT4T", function ($scope, CT4T: typeof ClientTemplating4T) {
        var query = CT4T.query();

        if ($scope.publicationId) {
            query.setPublication($scope.publicationId);
        }
        if ($scope.schemaId) {
            query.addSchema($scope.schemaId);
        }
        if ($scope.max) {
            query.setLimit($scope.max);
        }
        CT4T.getComponents(query, function (error, components?) {
            if (!$scope.$$phase) {
                $scope.$apply(function () {
                    $scope.models = components;
                });
            }
        });
    }]);

    /**
     * Gets a component link dynamically.
     */
    application.directive("tridionComponentLink", function () {
        return {
            restrict: 'EA',
            template: '<a href="" ng-transclude></a>',
            transclude: true,
            replace: true,
            scope: {
                publicationId: "=",
                componentId: "=",
                view: "@view"
            },
            link: function (scope, element, attrs, ctrl) {

            }
        };
    });

    /**
     * Directive for rendering a single client side component presentation.
     *
     * @usage: <tridion:component-presentation publication-id="13" component-id="1555" view="YourView"></tridion:component-presentation>
     *         <tridion:component-presentation publication-id="13" component-id="1555" view="YourView"></tridion:component-presentation>
     *         <div tridion-component-presentation publication-id="13" component-id="1555" view="YourView"></div>
     */
    application.directive("tridionComponentPresentation", [function () {

        return {
            controller: "ComponentPresentationController",
            restrict: 'EA',
            template: '<div ng-include="getTemplateUrl()"></div>',
            transclude: true,
            replace: true,
            scope: {
                publicationId: "=",
                componentId: "=",
                view: "@view"
            },
            link: function (scope, element, attrs, ctrl) {
                console.log(scope);
                scope.getTemplateUrl = function () {
                    return "/system/views/" + scope.view + ".htm";
                };
            }
        };
    }]);

    /**
     * Directive for rendering multiple client side component presentations.
     *
     * @usage: <tridion:component-presentations publication-id="13" schema-id="2222" view="promotion"></tridion:component-presentations>
     */
    application.directive("tridionComponentPresentations", [function () {

        return {
            controller: "ComponentPresentationsController",
            restrict: 'EA',
            template: '<div ng-repeat="model in models" ng-include="getTemplateUrl()"></div>',
            transclude: true,
            scope: {
                max: "=",
                publicationId: "=",
                schemaId: "=",
                view: "@view"
            },
            link: function (scope, element, attrs, ctrl) {
                console.log(scope);
                scope.getTemplateUrl = function () {
                    return "/system/views/" + scope.view + ".htm";
                };
            }
        };

    }]);
} ());