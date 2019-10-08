describe('DiagramsService', function () {
    var DiagramsService,
        Modelfactory,
        flowchartConstants,
        DiagramsFactory,
        localStorageService;

    beforeEach(angular.mock.module('diagramsApp'));

    beforeEach(inject(function (_DiagramsService_, _Modelfactory_, _flowchartConstants_, _DiagramsFactory_, _localStorageService_) {
        DiagramsService = _DiagramsService_;
        Modelfactory = _Modelfactory_;
        flowchartConstants = _flowchartConstants_;
        DiagramsFactory = _DiagramsFactory_;
        localStorageService = _localStorageService_;
    }));

    it('should be defined', function () {
        expect(DiagramsService).toBeDefined();
    });

    it('should diagrams factory be defined', function () {
        expect(DiagramsFactory).toBeDefined();
    });

    it('should local storage service be defined', function () {
        expect(localStorageService).toBeDefined();
    });

    it('should define methods', function () {
        expect(DiagramsService.init).toBeDefined();
        expect(DiagramsService.refresh).toBeDefined();
        expect(DiagramsService.addNewNode).toBeDefined();
        expect(DiagramsService.toggleSideNav).toBeDefined();
        expect(DiagramsService.saveDiagram).toBeDefined();
        expect(DiagramsService.updateSavedDiagrams).toBeDefined();
        expect(DiagramsService.setCurrentDiagram).toBeDefined();
        expect(DiagramsService.newDiagram).toBeDefined();
        expect(DiagramsService.deleteDiagram).toBeDefined();
        expect(DiagramsService.getLocalStorageDiagrams).toBeDefined();
        expect(DiagramsService.setLocalStorageDiagrams).toBeDefined();
        expect(DiagramsService.init).toEqual(jasmine.any(Function));
        expect(DiagramsService.refresh).toEqual(jasmine.any(Function));
        expect(DiagramsService.addNewNode).toEqual(jasmine.any(Function));
        expect(DiagramsService.toggleSideNav).toEqual(jasmine.any(Function));
        expect(DiagramsService.saveDiagram).toEqual(jasmine.any(Function));
        expect(DiagramsService.updateSavedDiagrams).toEqual(jasmine.any(Function));
        expect(DiagramsService.setCurrentDiagram).toEqual(jasmine.any(Function));
        expect(DiagramsService.newDiagram).toEqual(jasmine.any(Function));
        expect(DiagramsService.deleteDiagram).toEqual(jasmine.any(Function));
        expect(DiagramsService.getLocalStorageDiagrams).toEqual(jasmine.any(Function));
        expect(DiagramsService.setLocalStorageDiagrams).toEqual(jasmine.any(Function));
    });

    describe('init', function () {
        it('should initialize the diagrams service', function () {
            spyOn(DiagramsService, 'updateSavedDiagrams');
            DiagramsService.init();
            expect(DiagramsService.availableNodeTypes).toBeDefined();
            expect(DiagramsService.availableNodeTypes.length).toBe(DiagramsFactory.availableNodeTypes.length);
            expect(DiagramsService.currentDiagram).toBeDefined();
            expect(DiagramsService.modelService).toBeDefined();
            expect(DiagramsService.updateSavedDiagrams).toHaveBeenCalled();
        });
    });

    describe('refresh', function () {
        beforeEach(function () {
            DiagramsService.init();
        });

        it('should show canvas after 500ms', function () {
            spyOn(DiagramsService, 'hideCanvas');
            DiagramsService.refresh();
            setTimeout(function () {
                expect(DiagramsService.hideCanvas).toBe(false);
            }, 550);
        });

        it('should renew the canvas model service', function () {
            spyOn(DiagramsService.modelService, 'registerCallbacks');
            DiagramsService.refresh();
            setTimeout(function () {
                expect(DiagramsService.modelService).toBeDefined();
                expect(DiagramsService.modelService.registerCallbacks).toHaveBeenCalled();
            }, 550);
        });
    });

    describe('add new node', function () {
        beforeEach(function () {
            DiagramsService.init();
        });

        it('should create node on diagrams factory', function () {
            spyOn(DiagramsFactory, 'createNode');
            DiagramsService.addNewNode('new node', flowchartConstants.nodeTypes.bevel, 0);
            expect(DiagramsFactory.createNode).toHaveBeenCalled();
        });

        it('should increase the length of current diagram nodes', function () {
            var currentLength = angular.copy(DiagramsService.currentDiagram.nodes.length);
            DiagramsService.addNewNode();
            expect(DiagramsService.currentDiagram.nodes.length).toBe(currentLength + 1);
        });
    });

    describe('callbacks', function () {
        describe('is valid connector', function () {
            var top, bottom, right, left;
            beforeEach(function () {
                top = { type: flowchartConstants.topConnectorType };
                bottom = { type: flowchartConstants.bottomConnectorType };
                left = { type: flowchartConstants.leftConnectorType };
                right = { type: flowchartConstants.rightConnectorType };
            });

            it('should only connect top to bottom', function () {
                expect(DiagramsService.callbacks.isValidEdge(top, top)).toBe(false);
                expect(DiagramsService.callbacks.isValidEdge(top, left)).toBe(false);
                expect(DiagramsService.callbacks.isValidEdge(top, right)).toBe(false);
                expect(DiagramsService.callbacks.isValidEdge(top, bottom)).toBe(true);
            });

            it('should only connect bottom to top', function () {
                expect(DiagramsService.callbacks.isValidEdge(bottom, bottom)).toBe(false);
                expect(DiagramsService.callbacks.isValidEdge(bottom, left)).toBe(false);
                expect(DiagramsService.callbacks.isValidEdge(bottom, right)).toBe(false);
                expect(DiagramsService.callbacks.isValidEdge(bottom, top)).toBe(true);
            });

            it('should only connect left to right', function () {
                expect(DiagramsService.callbacks.isValidEdge(left, left)).toBe(false);
                expect(DiagramsService.callbacks.isValidEdge(left, top)).toBe(false);
                expect(DiagramsService.callbacks.isValidEdge(left, bottom)).toBe(false);
                expect(DiagramsService.callbacks.isValidEdge(left, right)).toBe(true);
            });

            it('should only connect right to left', function () {
                expect(DiagramsService.callbacks.isValidEdge(right, right)).toBe(false);
                expect(DiagramsService.callbacks.isValidEdge(right, top)).toBe(false);
                expect(DiagramsService.callbacks.isValidEdge(right, bottom)).toBe(false);
                expect(DiagramsService.callbacks.isValidEdge(right, left)).toBe(true);
            });
        });
    });

    describe('sidenav', function () {
        beforeEach(function () {
            DiagramsService.init();
        });

        it('should be closed', function () {
            expect(DiagramsService.diagramsSideNavOpen).toBe(false);
        });

        it('should open when toggled', function () {
            DiagramsService.toggleSideNav();
            expect(DiagramsService.diagramsSideNavOpen).toBe(true);
        });

        it('should update saved diagrams list when opened', function () {
            spyOn(DiagramsService, 'updateSavedDiagrams');
            DiagramsService.toggleSideNav();
            expect(DiagramsService.diagramsSideNavOpen).toBe(true);
            expect(DiagramsService.updateSavedDiagrams).toHaveBeenCalled();
        });
    });

    describe('save diagram', function () {
        beforeEach(function () {
            DiagramsService.init();
        });

        describe('validation', function () {
            it('should not save if current diagram is undefined', function () {
                DiagramsService.currentDiagram = undefined;
                var saved = DiagramsService.saveDiagram('diagram name');
                expect(saved).toBe(false);
            });

            it('should not save if current diagram nodes is undefined', function () {
                DiagramsService.currentDiagram.nodes = undefined;
                var saved = DiagramsService.saveDiagram('diagram name');
                expect(saved).toBe(false);
            });

            it('should not save if current diagram nodes is empty', function () {
                var saved = DiagramsService.saveDiagram('diagram name');
                expect(saved).toBe(false);
            });

            it('should not save if current diagram doesnt have a name', function () {
                var saved = DiagramsService.saveDiagram('');
                expect(saved).toBe(false);
            });
        });

        describe('after validation', function () {
            var diagramName = 'new diagram name';

            beforeEach(function () {
                DiagramsService.addNewNode('new node', flowchartConstants.nodeTypes.bevel, 0);
            });

            it('should use the given name', function () {
                DiagramsService.saveDiagram(diagramName);
                expect(DiagramsService.currentDiagram.name).toBe(diagramName);
            });

            it('should have a valid id', function () {
                DiagramsService.saveDiagram(diagramName);
                var isGuidValid = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(DiagramsService.currentDiagram.id);
                expect(isGuidValid).toBe(true);
            });

            it('should have a valid id', function () {
                DiagramsService.saveDiagram(diagramName);
                expect(DiagramsService.currentDiagram.date).toBeDefined();
                expect(DiagramsService.currentDiagram.date instanceof Date).toBe(true);
            });

            it('should use local storage', function () {
                spyOn(DiagramsService, 'setLocalStorageDiagrams');
                DiagramsService.saveDiagram(diagramName);
                expect(DiagramsService.setLocalStorageDiagrams).toHaveBeenCalled();
            });

            it('should be saved', function () {
                var saved = DiagramsService.saveDiagram(diagramName);
                expect(saved).toBe(true);
            });
        });
    });

    describe('get data from local storage', function () {
        beforeEach(function () {
            localStorageService.clearAll();
            DiagramsService.init();
        });

        it('should return an empty array when local storage is empty', function () {
            var data = DiagramsService.getLocalStorageDiagrams();
            expect(data.length).toBe(0);
        });

        it('should get data saved in local storage', function () {
            var oldSavedDiagrams = angular.copy(DiagramsService.savedDiagrams);
            DiagramsService.addNewNode('new node', flowchartConstants.nodeTypes.bevel, 0);
            DiagramsService.saveDiagram('new diagram name');
            setTimeout(function () {
                var newSavedDiagrams = DiagramsService.getLocalStorageDiagrams();
                expect(newSavedDiagrams.length).toBe(oldSavedDiagrams.length + 1);
            }, 550);
        });
    });

    describe('set data to local storage', function () {
        beforeEach(function () {
            DiagramsService.init();
            DiagramsService.currentDiagram.id = DiagramsFactory.newGuid();
            DiagramsService.currentDiagram.name = 'diagram name';
            DiagramsService.currentDiagram.date = new Date();
            DiagramsService.addNewNode('new node', flowchartConstants.nodeTypes.bevel, 0);
        });

        it('should retrieve data from local storage', function () {
            spyOn(DiagramsService, 'getLocalStorageDiagrams');
            DiagramsService.setLocalStorageDiagrams(DiagramsService.currentDiagram);
            expect(DiagramsService.getLocalStorageDiagrams).toHaveBeenCalled();
        });

        it('should add to the local storage', function () {
            var oldSavedDiagrams = angular.copy(DiagramsService.savedDiagrams);
            spyOn(localStorageService, 'set');
            DiagramsService.setLocalStorageDiagrams(DiagramsService.currentDiagram);
            expect(localStorageService.set).toHaveBeenCalled();
            setTimeout(function () {
                var newSavedDiagrams = DiagramsService.getLocalStorageDiagrams();
                expect(newSavedDiagrams.length).toBe(oldSavedDiagrams.length + 1);
            }, 550);
        });
    });

    describe('update saved diagrams', function () {
        beforeEach(function () {
            DiagramsService.init();
        });

        it('should retrieve data from local storage', function () {
            spyOn(DiagramsService, 'getLocalStorageDiagrams');
            DiagramsService.updateSavedDiagrams();
            expect(DiagramsService.getLocalStorageDiagrams).toHaveBeenCalled();
        });

        it('should be new items', function () {
            var oldSavedDiagrams = angular.copy(DiagramsService.savedDiagrams);
            DiagramsService.addNewNode('new node', flowchartConstants.nodeTypes.bevel, 0);
            DiagramsService.saveDiagram('new diagram name');

            DiagramsService.updateSavedDiagrams();
            expect(DiagramsService.savedDiagrams).toBeDefined();
            expect(oldSavedDiagrams).not.toBe(DiagramsService.savedDiagrams);
        });
    });

    describe('new diagram', function () {
        beforeEach(function () {
            DiagramsService.init();
        });

        it('it should call diagrams factory to create a new diagram', function () {
            spyOn(DiagramsFactory, 'createFlowChart');
            DiagramsService.newDiagram();
            expect(DiagramsFactory.createFlowChart).toHaveBeenCalled();
        });

        it('it should create an empty diagram', function () {
            DiagramsService.newDiagram();
            expect(DiagramsService.currentDiagram).toBeDefined();
            expect(DiagramsService.currentDiagram.id).toBeDefined();
            expect(DiagramsService.currentDiagram.name).toBeDefined();
            expect(DiagramsService.currentDiagram.date).not.toBeDefined();
            expect(DiagramsService.currentDiagram.nodes).toBeDefined();
            expect(DiagramsService.currentDiagram.nodes.length).toBe(0);
            expect(DiagramsService.currentDiagram.edges).toBeDefined();
            expect(DiagramsService.currentDiagram.edges.length).toBe(0);
        });

        it('it should refresh', function () {
            spyOn(DiagramsService, 'refresh');
            DiagramsService.newDiagram();
            expect(DiagramsService.refresh).toHaveBeenCalled();
        });
    });

    describe('set current diagram', function () {
        var addedDiagramId;

        beforeEach(function () {
            DiagramsService.init();
            DiagramsService.addNewNode('new node', flowchartConstants.nodeTypes.bevel, 0);
            DiagramsService.saveDiagram('new diagram name');
            addedDiagramId = DiagramsService.savedDiagrams[0].id;
        });

        it('should change the current diagram to the selected one', function () {
            var oldDiagramId = angular.copy(DiagramsService.currentDiagram.id);
            DiagramsService.setCurrentDiagram(DiagramsService.savedDiagrams[0]);
            setTimeout(function () {
                expect(oldDiagramId).not.toBe(addedDiagramId);
                expect(addedDiagramId).toBe(DiagramsService.currentDiagram.id);
            }, 550);
        });

        it('should refresh after set', function () {
            spyOn(DiagramsService, 'refresh');
            DiagramsService.setCurrentDiagram(DiagramsService.savedDiagrams[0]);
            expect(DiagramsService.refresh).toHaveBeenCalled();
        });
    });

    describe('delete diagram', function () {
        var addedDiagram;

        beforeEach(function () {
            DiagramsService.init();
            DiagramsService.addNewNode('new node', flowchartConstants.nodeTypes.bevel, 0);
            DiagramsService.saveDiagram('new diagram name');
            addedDiagram = DiagramsService.savedDiagrams[0];
        });

        it('should not delete an undefined diagram', function () {
            var deleted = DiagramsService.deleteDiagram(undefined);
            expect(deleted).toBe(false);
        });

        it('should not delete a not existing diagram', function () {
            DiagramsService.addNewNode('new node', flowchartConstants.nodeTypes.bevel, 0);
            DiagramsService.currentDiagram.id = DiagramsFactory.newGuid();
            DiagramsService.currentDiagram.name = 'diagram name';
            DiagramsService.currentDiagram.date = new Date();
            var deleted = DiagramsService.deleteDiagram(DiagramsService.currentDiagram);
            expect(deleted).toBe(false);
        });

        describe('existing diagram', function () {
            it('should retrieve diagrams from local storage', function () {
                spyOn(DiagramsService, 'getLocalStorageDiagrams');
                DiagramsService.deleteDiagram(addedDiagram);
                expect(DiagramsService.getLocalStorageDiagrams).toHaveBeenCalled();
            });

            it('should delete', function () {
                var deleted = DiagramsService.deleteDiagram(addedDiagram);
                expect(deleted).toBe(true);
            });

            it('should have removed from local storage', function () {
                var oldSavedItems = angular.copy(DiagramsService.savedDiagrams);
                DiagramsService.deleteDiagram(addedDiagram);
                setTimeout(function () {
                    var savedItems = DiagramsService.getLocalStorageDiagrams();
                    expect(savedItems.length).toBe(oldSavedItems.length - 1);
                }, 550);
            });

            it('should set the remaining diagrams to the local storage', function () {
                spyOn(localStorageService, 'set');
                DiagramsService.deleteDiagram(addedDiagram);
                expect(localStorageService.set).toHaveBeenCalled();
            });

            it('should update the saved diagrams', function () {
                spyOn(DiagramsService, 'updateSavedDiagrams');
                DiagramsService.deleteDiagram(addedDiagram);
                expect(DiagramsService.updateSavedDiagrams).toHaveBeenCalled();
            });
        });
    });
});