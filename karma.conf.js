module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      'node_modules/angular/angular.js',                             
      'node_modules/angular-mocks/angular-mocks.js',
      'node_modules/angular-local-storage/dist/angular-local-storage.min.js',
      'src/js/vendor/ng-flowchart-custom/ngFlowchart.custom.js',
      'src/js/factories/*.js',
      'src/js/services/*.js',
      'src/js/controllers/*.js',
      'src/js/components/*.js',
      'src/js/app.js',
      'src/js/**/*.spec.js'
    ],
    exclude: [
    ],
    preprocessors: {
    },
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['PhantomJS'],
    singleRun: false,
    concurrency: Infinity
  })
}
