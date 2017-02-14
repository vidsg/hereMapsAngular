/**
 * @author  Vids G
 * @date    September 2015
 *
 * AngularJS Boilerplate: Build, watch and other useful tasks
 *
 * The build process consists of following steps:
 * 1. clean /_build folder
 * 2. compile SASS files, minify and uncss compiled css
 * 3. copy and minimize images
 * 4. minify and copy all HTML files into $templateCache
 * 5. build index.html
 * 6. minify and copy all JS files
 * 7. copy fonts
 * 8. show build folder size
 * 
 */
var gulp            = require('gulp'),
    browserSync     = require('browser-sync'),
    reload          = browserSync.reload,
    $               = require('gulp-load-plugins')(),
    del             = require('del'),
    runSequence     = require('run-sequence'),
    proxyMiddleware = require('http-proxy-middleware'),
    karmaServer     = require('karma').Server,
    gutil           = require('gulp-util');
//    ngConstant      = require('gulp-ng-constant');  
    

/*var proxyLocalSvc = proxyMiddleware('/BI', {target: 'http://52.4.108.80'});
var proxyApiSvc = proxyMiddleware('/api/v1', {target: 'http://52.4.108.80'});*/
/*
*   This config task creates config files based on different
*   env settings. This need config.json in app/constants, it will create 
*   config.json file in angular format so that file can be used as constant 
*   file.
*/
/*gulp.task('config', function () {
  var myConfig = require('./app/constants/config.json');
  var envConfig = myConfig[gutil.env.env];
  console.log("environment -- " + gutil.env.env);
  return ngConstant({
    name: 'hereMapsAngular',
    noFile: true,
    deps: false,
    interpolate: /\{%=(.+?)%\}/g,
    wrap: ';(function() {\n\n <%= __ngModule %>})();',
    constants: envConfig,
    stream: true
  })
  .pipe($.rename({basename: 'config'}))
  .pipe(gulp.dest('./app/constants'));
  
});*/

/*
*  This config task needs config folder with dev, test and prod 
*  config(json) settings files in it. 
*/
gulp.task('config', function(){
  return gulp.src(['./config/*'])
    .pipe($.changed('./_build/config'))
    .pipe(gulp.dest('./_build/config'));
});

// optimize images
gulp.task('images', function() {
  return gulp.src(['./images/*','./images/**/*'])
    .pipe($.changed('./_build/images'))
    .pipe(gulp.dest('./_build/images'));
});
// browser-sync task, only cares about compiled CSS
gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: "./",
      port: 3000
    },
    open: false
  }, function(err, bs) {
    // bs.options.url contains the original url, so
    // replace the port with the correct one:
    var url = "http://localhost:3000";
    //console.log(bs.options);
    require('opn')(url);    
  });
});

// browser-sync https task, only cares about compiled CSS
/*gulp.task('browser-sync', function() {

  var proxyLocalSvc = proxyMiddleware('/localSvc', {
    target: 'https://localhost.decom',
    secure: false,
    onProxyReq: function (proxyReq, req, res) {
      //console.log("Setting custom proxy headers");
      proxyReq.setHeader('X-SAML-RESPONSE-URL', 'https://localhost/localSvc/auth/saml');
      proxyReq.setHeader('X-GUI-URL', 'https://localhost/');
    }
  });
  console.log(proxyLocalSvc);
  var proxyBISvc = proxyMiddleware('/analytics/api', {
    target: 'https://localhost.dev.com',
    secure: false
  });
  browserSync({
    server: {
      baseDir: "./",
      middleware: [proxylocalSvc,proxyBISvc]
    },
    port: 443,
    open: false,
    https: true
  }, function(err, bs) {
    // bs.options.url contains the original url, so
    // replace the port with the correct one:
    var url = "https://localhost";
    //console.log(bs.options);
    require('opn')(url);
    
  });

});*/
/*gulp.task('browser-sync', function() {

  var proxylocalSvc = proxyMiddleware('/localSvc', {
    target: 'http://10.26.72.126',
    secure: false,
    onProxyReq: function (proxyReq, req, res) {
      //console.log("Setting custom proxy headers");
      proxyReq.setHeader('X-SAML-RESPONSE-URL', 'https://localhost/localSvc/auth/saml');
      proxyReq.setHeader('X-GUI-URL', 'http://localhost/');
    }
  });
  var proxyBISvc = proxyMiddleware('/BI', {target: 'http://52.4.108.80'});
  browserSync({
    server: {
      baseDir: "./",
      middleware: [proxylocalSvc,proxyBISvc]
    },
    port: 8080,
    open: false,
    https: false
  }, function(err, bs) {
    // bs.options.url contains the original url, so
    // replace the port with the correct one:
    var url = "http://localhost:8080";
    //console.log(bs.options);
    require('opn')(url);
    
  });

});*/


// browser-sync task, only cares about compiled CSS
gulp.task('server', function() {

  var proxylocalSvc = proxyMiddleware('/localSvc', {
    target: 'https://localhost.decom',
    secure: false,
    onProxyReq: function (proxyReq, req, res) {
      //console.log("Setting custom proxy headers");
      proxyReq.setHeader('X-SAML-RESPONSE-URL', 'https://localhost/localSvc/auth/saml');
      proxyReq.setHeader('X-GUI-URL', 'https://localhost/');
    }
  });
  var proxyBISvc = proxyMiddleware('/analytics/api', {
    target: 'https://localhost.dev.com',
    secure: false
  });
  browserSync({
    server: {
      baseDir: "./",
      middleware: [proxylocalSvc,proxyBISvc]
    },
    port: 443,
    open: false,
    https: true
  }, function(err, bs) {
    // bs.options.url contains the original url, so
    // replace the port with the correct one:
    var url = "https://localhost";
    //console.log(bs.options);
    require('opn')(url);
    
  });

});

// browser-sync-local task (runs against local CsAdmSvc), only cares about compiled CSS
gulp.task('browser-sync-local', function() {

  var proxylocalSvcLocal = proxyMiddleware('/localSvc', {target: 'http://localhost:8080', secure: false});

  var proxyBISvc = proxyMiddleware('/analytics/api', {
    target: 'https://localhost.dev.com',
    secure: false
  });

  browserSync({
    server: {
      baseDir: "./",
      middleware: [proxylocalSvc,proxyBISvc]
    },
    port: 80,
    open: false,
    https: false
  }, function(err, bs) {
    // bs.options.url contains the original url, so
    // replace the port with the correct one:
    var url = "http://localhost";
    //console.log(bs.options);
    require('opn')(url);
    
  });

});

// minify JS
gulp.task('minify-js', function() {
  gulp.src('js/*.js')
    .pipe($.uglify())
    .pipe(gulp.dest('./_build/'));
});

// minify CSS
gulp.task('minify-css', function() {
  gulp.src(['./styles/**/*.css', 
            './styles/**/**/*.css', 
            '!./styles/**/**/*.min.css', 
            '!./styles/**/*.min.css',
            '!./styles/**/*.min.css'
          ])
    .pipe($.minifyCss({keepBreaks:true}))
    .pipe($.autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9'))
    .pipe($.concat('vendor.min.css'))
    .pipe(gulp.dest('./_build/styles/'))
    .pipe(gulp.dest('./styles/'))
});


//vendor css
gulp.task('vendor-css', function() {
  return gulp.src([
            './styles/**/**/*.css', 
            '!./styles/**/**/*.min.css', 
            '!./styles/**/*.min.css',
            '!./styles/**/*.min.css',
            './bower_components/**/**/*.css', 
            './bower_components/**/**/**/*.css',
            '!./bower_components/**/**/*.min.css', 
            '!./bower_components/**/**/**/*.min.css'        
          ])
    .pipe($.concat('bower-vendor.css'))
    //.pipe($.rename({suffix: '.min'}))
    .pipe($.minifyCss({keepBreaks:true}))
    .pipe(gulp.dest('./_build/styles/'))
    .pipe(gulp.dest('styles/'));
});

// minify HTML
gulp.task('minify-html', function() {
  var opts = {
    comments: true,
    spare: true,
    conditionals: true
  };

  gulp.src('./*.html')
    .pipe($.minifyHtml(opts))
    .pipe(gulp.dest('./_build/'));
});


// start webserver from _build folder to check how it will look in production
gulp.task('server-build', function(done) {
  return browserSync({
    server: {
      baseDir: './_build/',
      port: 3000,
      middleware: [proxyLocalSvc, proxyApiSvc]
    }
  }, done);
});

// copy fonts from a module outside of our project (like Bower)
gulp.task('fonts', function() {
  gulp.src(['./fonts/**/*.{ttf,woff,woff2,eof,eot,svg,otf}',
            './bower_components/bootstrap/dist/fonts/*.{ttf,woff,woff2,eof,eot,svg,otf}'])
    .pipe($.changed('./_build/fonts'))
    .pipe(gulp.dest('./_build/fonts'));
});

// delete build folder
gulp.task('clean:build', function (cb) {
  del([
    './_build/'
    // if we don't want to clean any file we can use negate pattern
    //'!dist/mobile/deploy.json'
  ], cb);
});

// concat files
/*gulp.task('concat', function() {
  gulp.src('./js/*.js')
    .pipe($.concat('scripts.js'))
    .pipe(gulp.dest('./_build/'));
});*/

// SASS task, will run when any SCSS files change & BrowserSync
// will auto-update browsers
gulp.task('sass', function() {
  return gulp.src(['styls/**/**/*.scss','styles/**/*.scss','styles/*.scss'])
    .pipe($.sass({
      style: 'expanded'
    }))
    .on('error', function(err) {
        console.log(err.toString());
        this.emit('end');
    })
    .pipe(gulp.dest('styles'))
    .pipe(reload({
      stream: true
    }))
    .pipe($.notify({
      message: 'Styles task complete'
    }));
});

// SASS Build task
gulp.task('sass:build', function() {
  var s = $.size();

  return gulp.src('styles/*.scss')
    .pipe($.sass({
      style: 'compact'
    }))
    .pipe(gulp.dest('styles/'))
    .pipe(s)
    .pipe($.notify({
      onLast: true,
      message: function() {
        return 'Total CSS size ' + s.prettySize;
      }
    }));
});

// BUGFIX: warning: possible EventEmitter memory leak detected. 11 listeners added.
require('events').EventEmitter.prototype._maxListeners = 100;

// index.html build
// script/css concatenation
gulp.task('usemin', function() {
  return gulp.src(['./index.html'])
    // add templates path
    .pipe($.htmlReplace({
      'templates': '<script type="text/javascript" src="js/templates.js"></script>'
    }))
    .pipe($.usemin({
      // TODO: create a task to remove shared-style.css from index.html when building a shared component.      
      css: [$.minifyCss(), 'concat'],
      nonangularlibs: [$.uglify().on('error', function(e) { console.log('\x07',e.message); return this.end(); })],
      angularlibs: [$.uglify().on('error', function(e) { console.log('\x07',e.message); return this.end(); })],
      mainapp: [$.uglify().on('error', function(e) { console.log('\x07',e.message); return this.end(); })],
      appcomponents: [$.uglify().on('error', function(e) { console.log('\x07',e.message); return this.end(); })],
    }))
    .pipe(gulp.dest('./_build/'));
});

// make templateCache from all HTML files
gulp.task('templates', function() {
  return gulp.src([
      './**/*.html',
      '!bower_components/**/*.*',
      '!node_modules/**/*.*',
      '!_build/**/*.*'
    ])
    .pipe($.minifyHtml())
    .pipe($.angularTemplatecache({
      module: 'hereMapsAngular'
    }))
    .pipe(gulp.dest('./_build/js'));
});

// reload all Browsers
gulp.task('bs-reload', function() {
  browserSync.reload();
});

// calculate build folder size
gulp.task('build:size', function() {
  var s = $.size();

  return gulp.src('./_build/**/*.*')
    .pipe(s)
    .pipe($.notify({
      onLast: true,
      message: function() {
        return 'Total build size ' + s.prettySize;
      }
    }));
});


/**
 * Run unit test once and exit
 */
gulp.task('test', function (done) {
  new karmaServer({
    configFile: __dirname + '/test/conf.js',
    singleRun: true
  }, done).start();
});


/**
 * Watch for file changes and re-run unit tests on each change
 */
gulp.task('tdd', function (done) {
  new karmaServer({
    configFile: __dirname + '/test/conf.js'
  }, done).start();
});


// default task to be run with `gulp` command
// this default task will run BrowserSync & then use Gulp to watch files.
// when a file is changed, an event is emitted to BrowserSync with the filepath.
gulp.task('default', ['browser-sync', 'sass'], function() {
  gulp.watch('styles/*.css', function(file) {
    if (file.type === "changed") {
      reload(file.path);
    }
  });
  gulp.watch(['*.html', 'views/*.html', 'views/**/*.html'], ['bs-reload']);
  gulp.watch(['app/*.js', 'app/**/*.js', 'components/**/*.js', 'js/*.js'], ['bs-reload']);
  gulp.watch('styles/**/*.scss', ['sass']);
});


/**
 * build task:
 * 1. clean /_build folder
 * 2. compile SASS files, minify and uncss compiled css
 * 3. copy and minimize images
 * 4. minify and copy all HTML files into $templateCache
 * 5. build index.html
 * 6. minify and copy all JS files
 * 7. copy fonts
 * 8. show build folder size
 * 
 */
gulp.task('build', function(callback) {
  runSequence(
    'clean:build',
    'config',
    'images',
    'templates',
    'usemin',
    'fonts',
    'build:size',
    callback);
});