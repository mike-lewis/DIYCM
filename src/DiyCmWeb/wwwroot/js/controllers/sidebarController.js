﻿
// controller for the home page
app.controller('sidebarController', function ($scope, $location) {
    $scope.isActive = function (viewLocation) {
        return viewLocation === $location.path();
    };
});