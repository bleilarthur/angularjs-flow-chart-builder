angular.module('diagramsApp', ['LocalStorageModule', 'flowchart', 'diagramsApp.factories', 'diagramsApp.services',
  'diagramsApp.controllers', 'diagramsApp.components'])
  .config(['NodeTemplatePathProvider', 'localStorageServiceProvider',
    function (NodeTemplatePathProvider, localStorageServiceProvider) {
      NodeTemplatePathProvider.setTemplatePath("flowchart/node.html");
      localStorageServiceProvider.setPrefix('diagramsApp');
    }]);