var gulp = require('gulp'),
  less = require('gulp-less'),
  cssmin = require('gulp-cssmin'),
  concat = require('gulp-concat'),
  rename = require('gulp-rename'),
  uglify = require('gulp-uglify'),
  sourcemaps = require('gulp-sourcemaps'),
  path = require('path'),
  fs = require('fs'),
  prompt = require('prompt'),
  imagemin = require('gulp-imagemin'),
  gutil = require('gulp-util'),
  webpack = require('webpack');

var css_path = 'path1',
  js_path = 'path2';

var paths = {
  //For watch files
  scripts: [
    js_path + '/*.js',
    'path2/**/*.js',
    css_path + '/file.css'
  ],
  js: [
    js_path + '/vendor1.js',
    js_path + '/build/webpack.js'
  ]
};


gulp.task('build', function(callback) {
  // run webpack
  webpack({
    entry: __dirname + '/' + js_path + '/main.js',
    output: {
      path: __dirname + "/" + js_path + "/build/",
      filename: "webpack.js"
    },
    resolve: {
      root: [
        path.resolve('./' + js_path + '/modules')
      ]
    },
    module: {
      loaders: [{
        test: /\.css$/,
        loader: "style!css"
      }]
    }
  }, function(err, stats) {
    if (err) throw new gutil.PluginError("webpack", err);
    gutil.log("[webpack]", stats.toString({
      // output options
    }));

    //Compress and unify JavaScript
    gulp.src(paths['js'])
      .pipe(sourcemaps.init())
      .pipe(concat('package.js')) //name of the final file
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(js_path + '/build/'))
      //Minified version
      .pipe(uglify({
        mangle: false,
        compress: true
      }))
      .pipe(rename({
        extname: '.min.js'
      }))
      .pipe(gulp.dest(js_path + '/build/'));;

    callback();
  });

  //Compress and unify Less
  gulp.src(css_path + '/recs.less')
    .pipe(sourcemaps.init())
    .pipe(less())
    .pipe(cssmin()) //Minify
    .pipe(sourcemaps.write())
    .pipe(rename({
      extname: '.min.css'
    }))
    .pipe(gulp.dest(css_path));
});

// Rerun the task when a file changes
gulp.task('watch', function() {
  gulp.watch(paths.scripts, ['build']);
});


// The default task (called when you run `gulp` from CLI)
gulp.task('default', ['build', 'watch']);