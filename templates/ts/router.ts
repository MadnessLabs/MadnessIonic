/// <reference path="../tsd/tsd.d.ts"/>
module @@{app} {
    'use strict';

    class @@{app}Router {
        constructor($stateProvider, $urlRouterProvider) {
            $stateProvider
                @@{routes};

            $urlRouterProvider.otherwise(function($injector, $location) {
                var $state = $injector.get('$state');
                $state.go('@@{default}');
            });
        }
    }

    angular.module('@@{app}')
           .config(@@{app}Router);
}