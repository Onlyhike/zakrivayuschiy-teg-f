const gulp = require('gulp');
const concat = require('gulp-concat-css');
const plumber = require('gulp-plumber');
const del = require('del');
const browserSync = require('browser-sync').create();
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const mediaquery = require('postcss-combine-media-query');
const cssnano = require('cssnano');
const htmlMinify = require('html-minifier');

function html() {
  const options = {
    removeComments: true,
    removeRedundantAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    sortClassName: true,
    useShortDoctype: true,
    collapseWhitespace: true,
    minifyCSS: true,
    keepClosingSlash: true,
  };
  return gulp
    .src('src/**/*.html')
    .pipe(plumber())
    .on('data', function (file) {
      const buferFile = Buffer.from(
        htmlMinify.minify(file.contents.toString(), options)
      );
      return (file.contents = buferFile);
    })
    .pipe(gulp.dest('dist/'))
    .pipe(browserSync.reload({ stream: true }));
}

exports.html = html;

function css() {
  const plugins = [autoprefixer(), mediaquery(), cssnano()];
  return gulp
    .src('src/**/*.css')
    .pipe(plumber())
    .pipe(concat('bundle.css'))
    .pipe(postcss(plugins))
    .pipe(gulp.dest('dist/'))
    .pipe(browserSync.reload({ stream: true }));
}

exports.css = css;

function images() {
  return gulp
    .src('src/images/**/*.{jpg,png,svg,gif,ico,webp,avif}')
    .pipe(gulp.dest('dist/images'))
    .pipe(browserSync.reload({ stream: true }));
}

exports.images = images;

function fonts() {
  return gulp
    .src('src/fonts/**/*.{woff,woff2,ttf}')
    .pipe(gulp.dest('dist/fonts'))
    .pipe(browserSync.reload({ stream: true }));
}

exports.fonts = fonts;

function video() {
  return gulp
    .src('src/video/**/*.{mp4,webm,ogv}')
    .pipe(gulp.dest('dist/video'))
    .pipe(browserSync.reload({ stream: true }));
}

exports.video = video;

function clean() {
  return del('dist');
}

exports.clean = clean;

const build = gulp.series(
  clean,
  gulp.parallel(html, css, images, fonts, video)
);

exports.build = build;

function serve() {
  browserSync.init({
    server: {
      baseDir: './dist',
    },
  });
}

function watchFiles() {
  gulp.watch(['src/**/*.html'], html);
  gulp.watch(['src/**/*.css'], css);
  gulp.watch(['src/images/**/*.{jpg,png,svg,gif,ico,webp,avif}'], images);
  gulp.watch(['src/fonts/**/*.{woff,woff2,ttf}'], fonts);
  gulp.watch(['src/video/**/*.{mp4,webm,ogv}'], video);
}

const watchapp = gulp.parallel(build, watchFiles, serve);

exports.watchapp = watchapp;

exports.default = watchapp; //означает что команда wathapp вызывается вводом слова gulp
