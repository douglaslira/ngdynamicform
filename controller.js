$app.controller("Main", ['$scope', function ($scope) {

    $scope.formInputs = [{
        id: 0,
        name: 'Validar nome?',
        type: 'boolean',
        model: 'checkname',
        workflows: [{
            value: true,
            field: {
                id: 2
            },
            rule: 'OBRIGATORIO'
        }]
    }, {
        id: 2,
        name: 'Nome',
        type: 'string',
        model: 'notificacao',
        value: 'TESTE',
        attributes: {
            placeholder: 'AAAAA'
        }

    }];

    $scope.save = function (o) {
        console.log(o, "SAVE");
    }

    $scope.cancel = function (o) {
        console.log(o, "CANCEL");
    }
}]);