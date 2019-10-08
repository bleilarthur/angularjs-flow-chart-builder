describe('Diagrams Factory', function () {
    var DiagramsFactory;
    var flowchartConstants;

    beforeEach(angular.mock.module('diagramsApp'));

    beforeEach(inject(function (_DiagramsFactory_, _flowchartConstants_) {
        DiagramsFactory = _DiagramsFactory_;
        flowchartConstants = _flowchartConstants_;
    }));

    it('should be defined', function () {
        expect(DiagramsFactory).toBeDefined();
    });

    it('should define methods', function () {
        expect(DiagramsFactory.createFlowChart).toBeDefined();
        expect(DiagramsFactory.createNode).toBeDefined();
        expect(DiagramsFactory.newGuid).toBeDefined();
        expect(DiagramsFactory.createFlowChart).toEqual(jasmine.any(Function));
        expect(DiagramsFactory.createNode).toEqual(jasmine.any(Function));
        expect(DiagramsFactory.newGuid).toEqual(jasmine.any(Function));
    });

    it('should create a base model for ngFlowchart', function () {
        var model = DiagramsFactory.createFlowChart();
        expect(model).toBeDefined();
        expect(model.id).toBeDefined();
        expect(model.name).toBeDefined();
        expect(model.date).not.toBeDefined();
        expect(model.nodes).toBeDefined();
        expect(model.nodes.length).toBe(0);
        expect(model.edges).toBeDefined();
        expect(model.edges.length).toBe(0);
    });

    it('should create valid guids', function () {
        var guid = DiagramsFactory.newGuid();
        var isGuidValid = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(guid);
        expect(isGuidValid).toBe(true);
    });

    describe('ngflowchart node', function () {
        var node;
        beforeEach(function () {
            node = DiagramsFactory.createNode('test node', 'bevel', 200);
        });

        it('should be defined', function () {
            expect(node).toBeDefined();
        });

        it('should have an valid id', function () {
            var isGuidValid = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(node.id);
            expect(isGuidValid).toBe(true);
        });

        it('should have the given name', function () {
            expect(node.name).toBe('test node');
        });

        it('should be the given type', function () {
            expect(node.type).toBe(flowchartConstants.nodeTypes.bevel);
        });

        it('should be created at user scroll position', function () {
            expect(node.x).toBe(100);
            expect(node.y).toBe(300);
        });

        describe('node connectors', function () {
            it('should be defined', function () {
                expect(node.connectors).toBeDefined();
            });

            it('should have all the basic directions', function () {
                var allDirections = true;
                var connectorTypes = [
                    flowchartConstants.topConnectorType,
                    flowchartConstants.leftConnectorType,
                    flowchartConstants.rightConnectorType,
                    flowchartConstants.bottomConnectorType
                ];

                expect(node.connectors.length).toBe(4);

                for (var i = 0; i < connectorTypes.length; i++) {
                    var found = false;
                    for (var x = 0; x < node.connectors.length; x++) {
                        if (connectorTypes[i] == node.connectors[x].type) {
                            found = true;
                            break;
                        }
                    }
                    if (!found) {
                        allDirections = false;
                        break;
                    }
                }
                expect(allDirections).toBe(true);
            });
        });
    });

    describe('available node types', function () {
        it('should be defined', function () {
            expect(DiagramsFactory.availableNodeTypes).toBeDefined()
        });

        it('should have all the node types', function () {
            var allTypes = true;
            var allHaveNames = true;
            var nodeTypes = [
                flowchartConstants.nodeTypes.bevel,
                flowchartConstants.nodeTypes.circle,
                flowchartConstants.nodeTypes.diamond,
                flowchartConstants.nodeTypes.heptagon,
                flowchartConstants.nodeTypes.hexagon,
                flowchartConstants.nodeTypes.octagon,
                flowchartConstants.nodeTypes.oval,
                flowchartConstants.nodeTypes.pentagon,
                flowchartConstants.nodeTypes.rabbet,
                flowchartConstants.nodeTypes.square,
                flowchartConstants.nodeTypes.rectangle
            ];

            expect(DiagramsFactory.availableNodeTypes.length).toBe(nodeTypes.length)

            for (var i = 0; i < nodeTypes.length; i++) {
                var found = false;
                var haveName = false;
                for (var x = 0; x < DiagramsFactory.availableNodeTypes.length; x++) {
                    if (nodeTypes[i] == DiagramsFactory.availableNodeTypes[x].type) {
                        found = true;
                        haveName = (DiagramsFactory.availableNodeTypes[x].name.length > 0);
                        break;
                    }
                }
                if (!found || !haveName) {
                    allTypes = false;
                    break;
                }
            }
            expect(allTypes).toBe(true);
        });
    });
});