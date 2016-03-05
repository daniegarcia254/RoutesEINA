angular.module('starter')

    /**********************************************************************
     * AppCtrl: Controlador principal de la aplicación.
     ***********************************************************************/

    .controller('AppCtrl', function ($scope, $timeout, $state, geoService, sharedProperties) {

        if (sharedProperties.getSugerencias().length == 0)
            geoService.sugerenciasEstancias();

        // Timeout para ir a home
        $timeout(function () {
            $state.go('app.home');
        }, 2000);
    });
