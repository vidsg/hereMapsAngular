module.exports = function(config) {
  config.set({
    basePath: '../',
    browsers: ['Chrome'],
    preprocessors: {
      'components/**/*.html': ['ng-html2js']
    },
    frameworks: ['jasmine','browserify'],
    plugins : [
        'karma-chrome-launcher',
        'karma-jasmine',
        'karma-browserify',
        'karma-ng-html2js-preprocessor'
    ],
    files: [
      'bower_components/jquery/dist/jquery.js', 
      'bower_components/jquery-ui/jquery-ui.js', 
      'bower_components/angular/angular.js',
      'bower_components/bootstrap/dist/js/bootstrap.js',
      'bower_components/angular-route/angular-route.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'bower_components/angular-animate/angular-animate.js',
      'bower_components/angular-bootstrap/ui-bootstrap.js',
      'bower_components/angular-cookies/angular-cookies.js',
      'bower_components/lodash/lodash.js', 
      'bower_components/angular-lodash-module/angular-lodash-module.js',
      'bower_components/angular-sanitize/angular-sanitize.js',
      'app/*.js',
      'app/**/*.js',
      'app/**/**/*.js',
      'components/**/*.js',
      'components/**/*.html',
      'views/**/*.html',
      'views/*.html',
      'test/**/**/*.spec.js',
      'test/**/*.spec.js'
    ]
  });
};