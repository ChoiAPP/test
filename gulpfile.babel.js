import gulp from "gulp";
import gpug from "gulp-pug";
import del from "del";
import ws from "gulp-webserver";
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
var csso = require('gulp-csso');
import bro from "gulp-bro";
import babelify from "babelify";


const routes = {
  pug: {
    watch: "src/**/*.pug",
    src: "src/*.pug",
    dest: "build"
  },
  scss: {
    watch: "src/scss/**/*.scss",
    src: "src/scss/style.scss",
    dest: "build/css/",
  },
  js: {
    watch:"src/js/**/*.js",
    src: "src/js/main.js",
    dest: "build/js"
  }
};
const pug = () => gulp.src(routes.pug.src).pipe(gpug()).pipe(gulp.dest(routes.pug.dest));
const clean = () => del(["build/"]);
const webserver = () => gulp.src("build").pipe(ws({ livereload: true, open: true }));
const styles = () => gulp.src(routes.scss.src)
  .pipe(sass().on('error', sass.logError))
  .pipe(autoprefixer({ cascade: false }))
  .pipe(csso())
  .pipe(gulp.dest(routes.scss.dest));

const js = () => gulp.src(routes.js.src)
  .pipe(bro({ transform: [babelify.configure({ presets: ['@babel/preset-env'] }),['uglifyify', { global: true }]] } ))
        .pipe(gulp.dest(routes.js.dest))

const watch = () => {
  gulp.watch(routes.pug.watch, { usePolling: true }, pug);
  gulp.watch(routes.scss.watch, { usePolling: true }, styles);
  gulp.watch(routes.js.watch, { usePolling: true }, js);
}

const prepare = gulp.series([clean]);
const assets = gulp.series([pug, styles, js]);
const postDev = gulp.parallel([webserver, watch]); //두개 동시에 태스크 처리할 떈 parallel
export const dev = gulp.series([prepare, assets, postDev]);

//autoprefixer : 인터넷 브라우저 별 호환성 증가
//csso - 빈칸 줄여 용량 감소, 성능 향상