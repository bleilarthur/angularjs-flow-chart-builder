describe('DiagramsController', function () {
    var DiagramsController,
        scope,
        DiagramsService,
        flowchartConstants,
        createController;

    beforeEach(angular.mock.module('diagramsApp'));

    beforeEach(inject(function ($rootScope, _DiagramsService_, _flowchartConstants_, $controller) {
        scope = $rootScope.$new();
        DiagramsController = $controller;
        DiagramsService = _DiagramsService_;
        flowchartConstants = _flowchartConstants_;
        createController = function () {
            return DiagramsController('DiagramsController', {
                '$scope': scope
            });
        };
    }));

    it('should be defined', function () {
        expect(DiagramsController).toBeDefined();
    });

    it('should diagrams service be defined', function () {
        expect(DiagramsService).toBeDefined();
    });

    it('should diagrams service been initialized', function () {
        spyOn(DiagramsService, 'init');
        var controller = createController();
        expect(DiagramsService.init).toHaveBeenCalled();
    });

    it('should create new diagrams', function () {
        var controller = createController();
        spyOn(DiagramsService, 'newDiagram');
        scope.newDiagram();
        expect(DiagramsService.newDiagram).toHaveBeenCalled();
    });

    it('should reload the view bindings when canvas change state (hidden/visible)', function () {
        var controller = createController();
        spyOn(scope, '$apply');
        DiagramsService.hideCanvas = true;
        setTimeout(function () {
            expect(scope.$apply).toHaveBeenCalled();
        }, 550);
    });

    describe('add node', function () {
        var controller;
        beforeEach(function () {
            controller = createController();
            var html = '<div id="diagramContainer"></div>';
            document.body.insertAdjacentHTML('afterbegin', html);
        });

        afterEach(function () {
            document.body.removeChild(document.getElementById('diagramContainer'));
        });

        it('should ask for the name of the node', function () {
            spyOn(window, 'prompt').and.returnValue('');
            scope.addNode(flowchartConstants.nodeTypes.bevel);
            expect(prompt).toHaveBeenCalled();
        });

        it('should alert user that name is required', function () {
            spyOn(window, 'prompt').and.returnValue('');
            spyOn(window, 'alert');
            scope.addNode(flowchartConstants.nodeTypes.bevel);
            expect(alert).toHaveBeenCalledWith('Por favor, informe o nome do nó');
        });

        it('should call service to add the node when name is given', function () {
            spyOn(window, 'prompt').and.returnValue('New Node');
            spyOn(DiagramsService, 'addNewNode');
            scope.addNode(flowchartConstants.nodeTypes.bevel);
            expect(DiagramsService.addNewNode).toHaveBeenCalled();
        });
    });

    describe('edit node', function () {
        var controller, node;
        beforeEach(function () {
            controller = createController();
            DiagramsService.addNewNode('new node', flowchartConstants.nodeTypes.bevel, 0);
            node = DiagramsService.currentDiagram.nodes[0];
        });

        it('should alert user that name is required', function () {
            spyOn(window, 'prompt').and.returnValue('');
            spyOn(window, 'alert');
            scope.DiagramsService.callbacks.nodeCallbacks.editNode(node);
            expect(prompt).toHaveBeenCalled();
            expect(alert).toHaveBeenCalledWith('Por favor, informe o nome do nó');
        });

        it('should change the name of the node when name is given', function () {
            var oldName = angular.copy(node.name),
                newName = 'new node name';
            spyOn(window, 'prompt').and.returnValue(newName);
            scope.DiagramsService.callbacks.nodeCallbacks.editNode(node);
            expect(prompt).toHaveBeenCalled();
            expect(node.name).toBe(newName);
        });

        it('should keep the name if the same name is given', function () {
            var oldName = angular.copy(node.name),
                newName = angular.copy(node.name);
            spyOn(window, 'prompt').and.returnValue(newName);
            scope.DiagramsService.callbacks.nodeCallbacks.editNode(node);
            expect(prompt).toHaveBeenCalled();
            expect(node.name).toBe(newName);
        });
    });

    describe('save diagram', function () {
        describe('not saved', function () {
            var controller;
            beforeEach(function () {
                controller = createController();
                DiagramsService.addNewNode('new node', flowchartConstants.nodeTypes.bevel, 0);
            });

            it('should ask for a name if is not already saved', function () {
                spyOn(window, 'prompt').and.returnValue('');
                scope.saveDiagram();
                expect(prompt).toHaveBeenCalled();
            });

            it('should alert user that name is required', function () {
                spyOn(window, 'prompt').and.returnValue('');
                spyOn(window, 'alert');
                scope.saveDiagram();
                expect(prompt).toHaveBeenCalled();
                expect(alert).toHaveBeenCalledWith('Por favor, informe o nome do diagrama');
            });

            it('should call diagram service to save when the name is given', function () {
                var projectName = 'project name';
                spyOn(window, 'prompt').and.returnValue(projectName);
                spyOn(DiagramsService, 'saveDiagram');
                scope.saveDiagram();
                expect(DiagramsService.saveDiagram).toHaveBeenCalledWith(projectName);
            });

            it('should alert user that the diagram is saved', function () {
                var projectName = 'project name';
                spyOn(window, 'prompt').and.returnValue(projectName);
                spyOn(window, 'alert');
                scope.saveDiagram();
                expect(alert).toHaveBeenCalledWith('Diagrama salvo com sucesso');
            });
        });

        describe('already saved', function () {
            var controller;
            beforeEach(function () {
                controller = createController();
                DiagramsService.addNewNode('new node', flowchartConstants.nodeTypes.bevel, 0);
                DiagramsService.currentDiagram.id = '9c5d1b26-edf2-4bfc-85fd-55c8894cc44f';
                DiagramsService.currentDiagram.name = 'test diagram';
                DiagramsService.saveDiagram();
            });

            it('should not ask for name', function () {
                spyOn(window, 'prompt');
                scope.saveDiagram();
                expect(prompt).not.toHaveBeenCalled();
            });

            it('should alert user that the diagram is saved', function () {
                spyOn(window, 'alert');
                scope.saveDiagram();
                expect(alert).toHaveBeenCalledWith('Diagrama salvo com sucesso');
            });
        });
    });

    describe('key up', function () {
        var controller;
        beforeEach(function () {
            controller = createController();
        });

        it('should call delete selected element on diagram service when delete key is hitted', function () {
            spyOn(DiagramsService.modelService, 'deleteSelected');
            scope.keyUp({ keyCode: 46 });
            expect(DiagramsService.modelService.deleteSelected).toHaveBeenCalled();
        });

        it('should not toggle sidenav when esc key is hitted', function () {
            spyOn(DiagramsService, 'toggleSideNav');
            scope.keyUp({ keyCode: 27 });
            expect(DiagramsService.toggleSideNav).not.toHaveBeenCalled();
        });

        it('should toggle sidenav when sidenav is open and esc key is hitted', function () {
            spyOn(DiagramsService, 'toggleSideNav');
            DiagramsService.diagramsSideNavOpen = true;
            scope.keyUp({ keyCode: 27 });
            expect(DiagramsService.toggleSideNav).toHaveBeenCalled();
        });
    });
});

describe('DiagramsSidenavController', function () {
    var DiagramsSidenavController,
        scope,
        DiagramsService;

    beforeEach(angular.mock.module('diagramsApp'));

    beforeEach(inject(function ($rootScope, _DiagramsService_, $controller) {
        scope = $rootScope.$new();
        DiagramsSidenavController = $controller;
        DiagramsService = _DiagramsService_;
    }));

    it('should be defined', function () {
        expect(DiagramsSidenavController).toBeDefined();
    });

    it('should diagrams service defined', function () {
        expect(DiagramsService).toBeDefined();
    });

    it('should have saved diagrams', function () {
        expect(DiagramsService.savedDiagrams).toBeDefined();
    });

    describe('delete diagram', function () {
        var savedDiagram;
        beforeEach(function () {
            DiagramsService.init();
            DiagramsService.addNewNode('test node', 'bevel', 0);
            DiagramsService.saveDiagram('test diagram');
            savedDiagram = DiagramsService.savedDiagrams[0];
            spyOn(window, 'alert');
            createController = function () {
                return DiagramsSidenavController('DiagramsSidenavController', {
                    '$scope': scope
                });
            };
        });

        it('should show the correct message after successfully delete an existing and valid diagram', function () {
            var controller = createController();
            scope.deleteDiagram(savedDiagram);
            expect(alert).toHaveBeenCalledWith('Diagrama excluído com sucesso');
        });

        it('should show the correct message after not delete an invalid diagram', function () {
            var controller = createController();
            scope.deleteDiagram({});
            expect(alert).toHaveBeenCalledWith('Não foi possível excluir seu diagrama, por favor tente novamente');
        });
    });
});