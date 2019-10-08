angular.module('diagramsApp.controllers', [])
    .controller('DiagramsController', ['$scope', 'DiagramsService', 'flowchartConstants',
        function ($scope, DiagramsService, flowchartConstants) {
            var deleteKeyCode = 46;
            var escKeyCode = 27;

            $scope.flowchartConstants = flowchartConstants;
            $scope.DiagramsService = DiagramsService;
            $scope.DiagramsService.init();

            $scope.DiagramsService.callbacks.nodeCallbacks = {
                'doubleClick': function (event) { },
                'editNode': function (node) {
                    var oldNodeName = angular.copy(node.name);
                    var newNodeName = prompt("Informe um novo nome para o nó: ", node.name);
                    if (!newNodeName) {
                        alert('Por favor, informe o nome do nó');
                        return;
                    }
                    if (newNodeName != oldNodeName) {
                        node.name = newNodeName;
                    }
                },
            };

            $scope.addNode = function (type) {
                var nodeName = prompt("Informe o nome do novo nó: ", "Novo nó");
                if (!nodeName) {
                    alert('Por favor, informe o nome do nó');
                    return;
                }
                var scrollTop = angular.element(document.querySelector('#diagramContainer'))[0].scrollTop;
                DiagramsService.addNewNode(nodeName, type, scrollTop);
            };

            $scope.saveDiagram = function () {
                var saved = false;
                if (!DiagramsService.currentDiagram.id || !DiagramsService.currentDiagram.name) {
                    var diagramName = prompt("Informe um nome para seu diagrama: ", "Novo diagrama");
                    if (!diagramName) {
                        alert('Por favor, informe o nome do diagrama');
                        return;
                    }
                    saved = $scope.DiagramsService.saveDiagram(diagramName);
                }
                else {
                    saved = $scope.DiagramsService.saveDiagram();
                }
                if (saved) {
                    alert('Diagrama salvo com sucesso');
                }
                else {
                    alert('Não foi possível salvar seu diagrama, por favor tente novamente');
                }
            };

            $scope.newDiagram = function () {
                $scope.DiagramsService.newDiagram();
            };

            $scope.keyUp = function (evt) {
                if (evt.keyCode === deleteKeyCode) {
                    $scope.DiagramsService.modelService.deleteSelected();
                }
                if (evt.keyCode == escKeyCode && $scope.DiagramsService.diagramsSideNavOpen) {
                    $scope.DiagramsService.toggleSideNav();
                }
            };

            $scope.$watch(function () {
                return $scope.DiagramsService.hideCanvas;
            }, function (newValue, oldValue) {
                if (newValue != oldValue) {
                    var _scope = $scope;
                    setInterval(function () {
                        _scope.$apply()
                    }, 500);
                }
            });
        }])
    .controller('DiagramsSidenavController', ['$scope', 'DiagramsService', function ($scope, DiagramsService) {
        $scope.DiagramsService = DiagramsService;

        $scope.deleteDiagram = function (diagram) {
            var deleted = $scope.DiagramsService.deleteDiagram(diagram);
            if (deleted) {
                alert('Diagrama excluído com sucesso');
            }
            else {
                alert('Não foi possível excluir seu diagrama, por favor tente novamente');
            }
        }
    }]);