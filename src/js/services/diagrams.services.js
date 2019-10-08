angular.module('diagramsApp.services', [])
    .service('DiagramsService', ['Modelfactory', 'flowchartConstants', 'DiagramsFactory', 'localStorageService',
        function (Modelfactory, flowchartConstants, DiagramsFactory, localStorageService) {
            var DiagramsService = {
                flowChartSelectedNodes: [],
                availableNodeTypes: [],
                savedDiagrams: [],
                hideCanvas: false,
                diagramsSideNavOpen: false,
                currentDiagram: {},
                modelService: {},
                init: function () {
                    this.availableNodeTypes = DiagramsFactory.availableNodeTypes;
                    this.currentDiagram = DiagramsFactory.createFlowChart();
                    this.modelService = Modelfactory(this.currentDiagram, this.flowChartSelectedNodes);
                    this.modelService.registerCallbacks(this.callbacks.edgeAdded, this.callbacks.nodeRemoved, this.callbacks.edgeRemoved);
                    this.updateSavedDiagrams();
                },
                refresh: function () {
                    this.hideCanvas = true;
                    setTimeout(function () {
                        this.hideCanvas = false;
                        this.modelService = Modelfactory(this.currentDiagram, this.flowChartSelectedNodes);
                        this.modelService.registerCallbacks(this.callbacks.edgeAdded, this.callbacks.nodeRemoved, this.callbacks.edgeRemoved);
                    }.bind(this), 500);
                },
                addNewNode: function (nodeName, type, scrollTop) {
                    this.currentDiagram.nodes.push(DiagramsFactory.createNode(nodeName, type, scrollTop));
                },
                callbacks: {
                    edgeMouseOver: function () { },
                    isValidEdge: function (source, destination) {
                        return (source.type === flowchartConstants.bottomConnectorType && destination.type === flowchartConstants.topConnectorType) ||
                            (source.type === flowchartConstants.topConnectorType && destination.type === flowchartConstants.bottomConnectorType) ||
                            (source.type === flowchartConstants.leftConnectorType && destination.type === flowchartConstants.rightConnectorType) ||
                            (source.type === flowchartConstants.rightConnectorType && destination.type === flowchartConstants.leftConnectorType);
                    },
                    edgeAdded: function (edge) { },
                    nodeRemoved: function (node) { },
                    edgeRemoved: function (edge) { }
                },
                toggleSideNav: function () {
                    this.diagramsSideNavOpen = !this.diagramsSideNavOpen;
                    if (this.diagramsSideNavOpen) {
                        this.updateSavedDiagrams();
                    }
                },
                saveDiagram: function (diagramName) {
                    if (!this.currentDiagram || !this.currentDiagram.nodes || !this.currentDiagram.nodes.length > 0 ||
                        (!this.currentDiagram.name && !diagramName)) {
                        return false;
                    }
                    if (diagramName) {
                        this.currentDiagram.name = diagramName;
                    }
                    if (!this.currentDiagram.id) {
                        this.currentDiagram.id = DiagramsFactory.newGuid();
                    }
                    this.currentDiagram.date = new Date();
                    return this.setLocalStorageDiagrams(this.currentDiagram);
                },
                updateSavedDiagrams: function () {
                    this.savedDiagrams = angular.copy(this.getLocalStorageDiagrams());
                },
                setCurrentDiagram: function (diagram) {
                    this.currentDiagram = diagram;
                    this.refresh();
                },
                newDiagram: function () {
                    this.currentDiagram = DiagramsFactory.createFlowChart();
                    this.refresh();
                },
                deleteDiagram: function (diagram) {
                    if (diagram) {
                        var diagrams = this.getLocalStorageDiagrams();
                        if (diagrams && diagrams.length > 0) {
                            var found = false;
                            for (var i = 0; i < diagrams.length; i++) {
                                if (diagrams[i].id == diagram.id) {
                                    if (diagrams[i].id == this.currentDiagram.id) {
                                        this.newDiagram();   
                                    }
                                    diagrams.splice(i, 1);
                                    found = true;
                                    break;
                                }
                            }
                            if (found) {
                                var deleted = localStorageService.set('diagrams', JSON.stringify(diagrams));
                                if (deleted) {
                                    this.updateSavedDiagrams();
                                    return true;
                                }
                                return false;
                            }
                            return false;
                        }
                        return false;
                    }
                    return false;
                },
                getLocalStorageDiagrams: function () {
                    var data = JSON.parse(localStorageService.get('diagrams'));
                    return (!data ? [] : data);
                },
                setLocalStorageDiagrams: function (diagram) {
                    var diagrams = this.getLocalStorageDiagrams();
                    if (diagrams && diagrams.length > 0) {
                        var found = false;
                        for (var i = 0; i < diagrams.length; i++) {
                            if (diagrams[i].id == diagram.id) {
                                diagrams[i] = diagram;
                                found = true;
                                break;
                            }
                        }
                        if (!found) {
                            diagrams.push(diagram);
                        }
                        return localStorageService.set('diagrams', JSON.stringify(diagrams));
                    }
                    else {
                        return localStorageService.set('diagrams', JSON.stringify([diagram]));
                    }
                }
            };
            return DiagramsService;
        }]);