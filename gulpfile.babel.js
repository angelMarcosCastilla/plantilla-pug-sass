
//CSS
import postcss from 'gulp-postcss';
import cssnano from 'cssnano';
import autoprefixer from 'autoprefixer';

//JavaScript
import gulp from 'gulp';
import babel from 'gulp-babel';
import terser from 'gulp-terser';

//Concat
import concat from 'gulp-concat';

//Clean CSS
import clean from 'gulp-purgecss';

//Caché bust
import cacheBust from 'gulp-cache-bust';

//Optimización imágenes
import imagemin from 'gulp-imagemin';

//Browser sync
import { init as server, stream, reload } from 'browser-sync';

//Plumber
import plumber from 'gulp-plumber';
import sass from "gulp-sass"
import pug from "gulp-pug"

//Variables/constantes
const cssPlugins = [cssnano(), autoprefixer()];

gulp.task('pug', () => {
  return gulp
    .src('./src/views/pages/*.pug')
    .pipe(plumber())
    .pipe(pug())
    .pipe(cacheBust({
      type:"timestamp"
    }))
    .pipe(gulp.dest('./public'));
});
gulp.task('pug-docs', () => {
  return gulp
    .src('./src/views/pages/*.pug')
    .pipe(plumber())
    .pipe(pug())
    .pipe(cacheBust({
      type:"timestamp"
    }))
    .pipe(gulp.dest('./docs'));
});

gulp.task('sass', () => {
  return gulp
    .src('./src/css/styles.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss(cssPlugins))
    .pipe(gulp.dest('./public/css'))
    .pipe(stream());
});
gulp.task('sass-docs', () => {
  return gulp
    .src('./src/css/styles.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss(cssPlugins))
    .pipe(gulp.dest('./docs/css/'))
    .pipe(stream());
});

gulp.task('babel-docs', () => {
  return gulp
    .src('./src/js/*.js')
    .pipe(plumber())
    .pipe(concat('scripts-min.js'))
    .pipe(babel())
    .pipe(terser())
    .pipe(gulp.dest('./docs/js/'));
});

gulp.task('babel', () => {
  return gulp
    .src('./src/js/*.js')
    .pipe(plumber())
    .pipe(concat('scripts-min.js'))
    .pipe(babel())
    .pipe(terser())
    .pipe(gulp.dest('./public/js'));
});

gulp.task('clean', () => {
  return gulp
    .src('./public/css/styles.css')
    .pipe(plumber())
    .pipe(
      clean({
        content: ['./public/*.html']
      })
    )
    .pipe(gulp.dest('./public/css'));
});

gulp.task('imgmin', () => {
  return gulp
    .src('./src/assets/imagenes/*')
    .pipe(plumber())
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.mozjpeg({ quality: 30, progressive: true }),
        imagemin.optipng({ optimizationLevel: 1 })
      ])
    )
    .pipe(gulp.dest('./public/assets/imagenes/'));
});
gulp.task('imgmin-docs', () => {
  return gulp
    .src('./src/assets/imagenes/*')
    .pipe(plumber())
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.mozjpeg({ quality: 30, progressive: true }),
        imagemin.optipng({ optimizationLevel: 1 })
      ])
    )
    .pipe(gulp.dest('./docs/assets/imagenes/'));
});

gulp.task('default', () => {
  server({
    server: './public'
  });
   gulp.watch('./src/views/**/*.pug', gulp.series('pug')).on('change', reload)
   gulp.watch('./src/css/**/*.scss', gulp.series('sass'))
   gulp.watch('./src/js/*.js', gulp.series('babel')).on('change', reload);
});


gulp.task('docs', () => {
   gulp.watch('./src/views/**/*.pug', gulp.series('html-min-docs'))
   gulp.watch('./src/css/**/*.scss', gulp.series('styles-docs'))
   gulp.watch('./src/js/*.js', gulp.series('babel-docs'))
});
