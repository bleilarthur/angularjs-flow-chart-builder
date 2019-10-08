angular.module('diagramsApp.factories', [])
    .factory('DiagramsFactory', ['flowchartConstants',
        function (flowchartConstants) {
            var DiagramsFactory = {
                createFlowChart: function () {
                    return {
                        id: '',
                        name: '',
                        date: undefined,
                        nodes: [],
                        edges: []
                    }
                },
                createNode: function (nodeName, type, scrollTop) {
                    return {
                        id: this.newGuid(),
                        name: nodeName,
                        type: type,
                        x: 100,
                        y: (scrollTop ? (scrollTop + 100) : 100),
                        connectors: [
                            {
                                id: this.newGuid(),
                                type: flowchartConstants.topConnectorType
                            },
                            {
                                id: this.newGuid(),
                                type: flowchartConstants.leftConnectorType
                            },
                            {
                                id: this.newGuid(),
                                type: flowchartConstants.rightConnectorType
                            },
                            {
                                id: this.newGuid(),
                                type: flowchartConstants.bottomConnectorType
                            }
                        ]
                    }
                },
                availableNodeTypes: [
                    {
                        name: 'Chanfro',
                        type: flowchartConstants.nodeTypes.bevel
                    },
                    {
                        name: 'Círculo',
                        type: flowchartConstants.nodeTypes.circle
                    },
                    {
                        name: 'Diamante',
                        type: flowchartConstants.nodeTypes.diamond
                    },
                    {
                        name: 'Heptágono',
                        type: flowchartConstants.nodeTypes.heptagon
                    },
                    {
                        name: 'Hexágono',
                        type: flowchartConstants.nodeTypes.hexagon
                    },
                    {
                        name: 'Octágono',
                        type: flowchartConstants.nodeTypes.octagon
                    },
                    {
                        name: 'Oval',
                        type: flowchartConstants.nodeTypes.oval
                    },
                    {
                        name: 'Pentágono',
                        type: flowchartConstants.nodeTypes.pentagon
                    },
                    {
                        name: 'Encaixe',
                        type: flowchartConstants.nodeTypes.rabbet
                    },
                    {
                        name: 'Quadrado',
                        type: flowchartConstants.nodeTypes.square
                    },
                    {
                        name: 'Retângulo',
                        type: flowchartConstants.nodeTypes.rectangle
                    }
                ],
                newGuid: function () {
                    function s4() {
                        return Math.floor((1 + Math.random()) * 0x10000)
                            .toString(16)
                            .substring(1);
                    }
                    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                        s4() + '-' + s4() + s4() + s4();
                }
            }
            return DiagramsFactory;
        }
    ]);