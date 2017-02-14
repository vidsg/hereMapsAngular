//http node server settings
var connect = require('connect');
var serveStatic = require('serve-static');
var proxyMiddleware = require('http-proxy-middleware'); 


connect()
		//.use(proxyMDSSvc)
		//.use(proxyCSAppSvc)
		.use(serveStatic(__dirname + "/_build")).listen(3000);

//https node server settings
/*var connect = require('connect');
var serveStatic = require('serve-static');
var gulp            = require('gulp'),
    browserSync     = require('browser-sync');
var proxyMiddleware = require('http-proxy-middleware'); 

gulp.task('browser-sync', function() {

  var proxyLocalSvc = proxyMiddleware('/LocalSvc', {
    target: 'https://applications.dev.com',
    secure: false,
    onProxyReq: function (proxyReq, req, res) {
      //console.log("Setting custom proxy headers");
      proxyReq.setHeader('X-GUI-URL', 'https://localhost/');
    }
  });
  var proxyBISvc = proxyMiddleware('/analytics/api', {
    target: 'https://localhost.dev.com',
    secure: false
  });
  browserSync({
    server: {
      baseDir: "./_build",
      middleware: [proxyLocalSvc,proxyBISvc]
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

gulp.start('browser-sync');
*/