const { src, dest, watch, series, parallel } = require('gulp');
const pug = require('gulp-pug');
const pugLinter = require('gulp-pug-linter');
const sass = require('gulp-sass');
const cheerio = require('gulp-cheerio');
const autoprefixer = require('autoprefixer');
const postcss = require('gulp-postcss');
const flatten = require('gulp-flatten');
const rename = require('gulp-rename');
const del = require('del');
const csso = require('gulp-csso');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const mozjpeg = require('imagemin-mozjpeg');
const gulpwebp = require('gulp-webp');
const svgmin = require('gulp-svgmin');
const svgstore = require('gulp-svgstore');
const server = require('browser-sync').create();
const plumber = require('gulp-plumber');
const critical = require('critical').stream;
const log = require('fancy-log');
const babel = require('gulp-babel');

sass.compiler = require('node-sass');

// CLEAR BUILD FOLDER
const clearBuild = () => del('build');

// CLEAR IMG FOLDER
const clearImgs = () => del('build/assets/img');

// CLEAR FAVICON FOLDER
const clearFavicon = () => del('build/assets/favicon');

// CLEAR FONTS FOLDER
const clearFonts = () => del('build/assets/fonts');

// COPYING ASSETS
const copyAssets = () =>
  src(['source/assets/**/*'], {
    base: 'source',
  }).pipe(dest('build/'));

// COPYING FAVICONS
const copyFavicon = () => src('source/assets/favicon/*').pipe(dest('build/'));

// COPYING FONTS
const fonts = () =>
  src(['source/assets/fonts/**/*'], {
    base: 'source',
  }).pipe(dest('build/'));

// CONCATENATION, UGLIFYING AND COPYING OF SCRIPTS
const scripts = () =>
  src('source/js/*.js')
    .pipe(plumber())
    .pipe(
      babel({
        presets: ['@babel/env'],
      })
    )
    .pipe(concat('main.min.js'))
    // .pipe(terser({
    //   // keep_fnames: true,
    //   // mangle: false
    // }))
    .pipe(uglify())
    .pipe(dest('build/js/'));

// COPYING VENDOR FILES THAT CANNOT BE CONCATENATED WITH OTHERS
const vendorCopy = () =>
  src(['node_modules/picturefill/dist/picturefill.min.js'])
    .pipe(flatten())
    .pipe(dest('build/vendor/'));

// CONCATENATION AND COPYING OF VENDOR FILES
const vendorBundle = () =>
  src([
    'node_modules/jquery/dist/jquery.min.js',
    'node_modules/object-fit-images/dist/ofi.min.js',
    'node_modules/loading-attribute-polyfill/loading-attribute-polyfill.min.js',
  ])
    .pipe(concat('vendor.min.js'))
    .pipe(dest('build/vendor/'));

// COMPILING PUG TO HTML
const pug2html = () =>
  src('source/pages/*.pug')
    .pipe(plumber())
    .pipe(pugLinter({ reporter: 'default' }))
    .pipe(pug({ pretty: true }))
    .pipe(dest('build/'));

// COMPILING, MINIFICATION AND COPYING STYLES
const styles = () =>
  src('source/sass/main.scss')
    .pipe(sass.sync({ outputStyle: 'expanded' }).on('error', sass.logError))
    .pipe(postcss([autoprefixer()]))
    .pipe(dest('build/css/'))
    .pipe(
      csso({
        // restructure: false
      })
    )
    .pipe(rename('main.min.css'))
    .pipe(dest('build/css/'))
    .pipe(server.stream());

// GENERATE & INLINE CRITICAL-PATHS CSS
/* eslint-disable */
const criticalCss = () =>
  src('build/index.html')
    .pipe(
      critical({
        base: 'build/',
        inline: true,
        minify: true,
        // width: 1300,
        // height: 900,
        // dimensions: [{
        //   height: 200,
        //   width: 500
        // }, {
        //   height: 900,
        //   width: 1200
        // }],
        css: ['build/css/main.css'],
      })
    )
    .on('error', function (err) {
      log.error(err.message);
    })
    .pipe(dest('build'));
/* eslint-enable */

// PICTURE OPTIMIZATION
const imgOpti = () =>
  src('source/assets/img/*.{jpg,png,gif}')
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        mozjpeg({ quality: 70, progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 }),
      ])
    )
    .pipe(dest('source/assets/img/'));

// WEBP CONVERTING PICTURES
// https://github.com/imagemin/imagemin-webp#imageminwebpoptions
// Crop - Object { x: number, y: number, width: number,
// height: number }
// Resize the image. Happens after crop - Object { width: number, height:
// number }
const img2webp = () =>
  src('source/assets/img/*.{jpg,png}')
    .pipe(gulpwebp({ quality: 75 }))
    .pipe(dest('source/assets/webp'));

// SVG OPTIMIZATION
/* eslint-disable */
const svgOpti = () =>
  src('source/assets/svg/**/*.svg')
    .pipe(
      svgmin({
        plugins: [
          {
            removeTitle: true,
          },
          {
            removeDesc: true,
          },
          {
            removeViewBox: false,
          },
          {
            removeDimensions: true,
          },
          {
            sortAttrs: true,
          },
          {
            cleanupNumericValues: {
              floatPrecision: 0,
              leadingZero: true,
              defaultPx: true,
              convertToPx: true,
            },
          },
        ],
        js2svg: {
          pretty: true,
        },
      })
    )
    .pipe(
      cheerio({
        run: function ($) {
          // $('[fill]').removeAttr('fill');
        },
        parserOptions: { xmlMode: true },
      })
    )
    .pipe(dest('source/assets/svg'));
/* eslint-enable */

// CREATING SVG-SPRITE
/* eslint-disable */
const svgSprite = () =>
  src('source/assets/svg/sprite/*.svg')
    .pipe(
      svgmin({
        plugins: [
          {
            removeTitle: true,
          },
          {
            removeDesc: true,
          },
          {
            removeViewBox: false,
          },
          {
            removeDimensions: true,
          },
          {
            sortAttrs: true,
          },
          {
            cleanupNumericValues: {
              floatPrecision: 0,
              leadingZero: true,
              defaultPx: true,
              convertToPx: true,
            },
          },
        ],
        js2svg: {
          pretty: true,
        },
      })
    )
    .pipe(
      cheerio({
        run: function ($) {
          // $('[fill]').removeAttr('fill');
        },
        parserOptions: { xmlMode: true },
      })
    )
    .pipe(svgstore({ inlineSvg: true }))
    .pipe(
      cheerio({
        run: function ($) {
          $('svg').attr('class', 'visuallyhidden');
        },
        parserOptions: { xmlMode: true },
      })
    )
    .pipe(rename('sprite.svg'))
    .pipe(dest('source/assets/svg/sprite/'));
/* eslint-enable */

// BROWSER PAGE UPDATE
const reload = (done) => {
  server.reload();
  done();
};

// FILES CHANGE TRACKING
const serve = (cb) => {
  server.init({
    server: 'build',
    cors: true,
    notify: false,
  });

  watch('source/js/*.js', series(scripts, reload));
  watch('source/sass/**/*.scss', series(styles));
  watch('source/assets/fonts/**/*', series(clearFonts, fonts, reload));
  watch(
    'source/pages/**/*.pug',
    { events: ['change'] },
    series(pug2html, reload)
  );
  cb();
};

// AVAILABLE TASKS

// clear build folder
exports.clearBuild = clearBuild;

// clear favicon folder
exports.clearFavicon = clearFavicon;

// clear img folder
exports.clearImgs = clearImgs;

// clear fonts folder
exports.clearFonts = clearFonts;

// copying assets
exports.copyAssets = copyAssets;

// copying fonts
exports.fonts = fonts;

// concatenation, uglifying & copying of scripts
exports.scripts = scripts;

// copying vendor files that cannot be concatenated with others
exports.vendorCopy = vendorCopy;

// concatenation & copying of vendor files
exports.vendorBundle = vendorBundle;

// compiling pug to html
exports.pug2html = pug2html;

// compiling, minification & copying styles
exports.styles = styles;

// generate & inline critical-paths css
exports.criticalCss = criticalCss;

// image optimization
exports.imgOpti = imgOpti;

// convert pictures to webp format
exports.img2webp = img2webp;

// svg optimization
exports.svgOpti = svgOpti;

// create svg sprite
exports.svgSprite = svgSprite;

// browser page update
exports.reload = reload;

// files change tracking
exports.serve = serve;

// adding new pictures
// (image optimization -> webp -> copying)
exports.newImg = series(series(imgOpti, img2webp, copyAssets));

// start of development
exports.default = series(
  clearBuild,
  parallel(
    series(imgOpti, img2webp, svgOpti, svgSprite, copyAssets),
    series(vendorCopy, vendorBundle),
    styles,
    scripts
  ),
  pug2html,
  serve
);

// production-ready version
exports.build = series(
  clearBuild,
  parallel(
    series(imgOpti, img2webp, copyAssets, copyFavicon),
    series(vendorCopy, vendorBundle),
    styles,
    scripts
  ),
  pug2html,
  clearFavicon
);
