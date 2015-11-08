//  Создание переменых
var gulp = require("gulp"),          
    jade = require('gulp-jade'),
    compass = require('gulp-compass'),
    wiredep = require('wiredep').stream,
    useref = require('gulp-useref'),
    uglify = require('gulp-uglify'),
    plumber = require('gulp-plumber'),
    del= require('del'),
    gulpif = require('gulp-if'),
    filter = require('gulp-filter'),
    size = require('gulp-size'),
    imagemin = require('gulp-imagemin'),
    browserSync = require('browser-sync'),
    ftp = require('vinyl-ftp'),
    reload = browserSync.reload;

// ==========================================================
// ==============  Локальная разработка  ============
// ==========================================================

// Компилируем Jade в html
gulp.task('jade', function() {
    gulp.src('app/jade/_pages/*.jade')
    .pipe(plumber())
    .pipe(jade({
       pretty: '\t'
      }))
    .on('error', log)
    .pipe(gulp.dest('app/'))
    .pipe(reload({stream: true}));
});

// Sccs - Compass
gulp.task('compass', function() {
  gulp.src('app/sass/**/*.scss')
    .pipe(plumber())
    .pipe(compass({
      config_file: 'config.rb', 
      css: 'app/css',
      sass: 'app/sass'
    }))
    .pipe(gulp.dest('app/css'));
});

gulp.task('sync', function() {
	browserSync.init({
		proxy: "addWatermark/app"
		// server: {
		// 	baseDir: paths.browserSync.baseDir
		// }
	});
>>>>>>> master
});

// слежка и запуск задач
gulp.task('watch', function () {
  gulp.watch('app/jade/**/*.jade', ['jade']);
  gulp.watch('app/sass/**/*.scss', ['compass']);
  gulp.watch([
    'app/*.html',
    'app/js/**/*.js',
    'app/css/**/*.css'
  ]).on('change', reload);
});


// ====================================================
// =============== Важные моменты  ====================
// ====================================================
// gulp.task(name, deps, fn)
// deps - массив задач, которые будут выполнены ДО запуска задачи name
// внимательно следите за порядком выполнения задач!


// ====================================================
// ================= Сборка DIST ======================
// ====================================================

// Переносим HTML, CSS, JS в папку dist
gulp.task('useref', function () {
  var assets = useref.assets();
  return gulp.src('app/*.html')
    .pipe(assets)
    .pipe(gulpif('*.js', uglify()))
    .pipe(gulpif('*.css', minifyCss({compatibility: 'ie8'}))) //минификация с поддержкой ie 8
    .pipe(assets.restore())
    .pipe(useref())
    .pipe(gulp.dest('dist'));
});

// Перенос шрифтов
gulp.task('fonts', function() {
  gulp.src('app/fonts/*')
    .pipe(filter(['*.eot','*.svg','*.ttf','*.woff','*.woff2']))
    .pipe(gulp.dest('dist/fonts/'));
});

// Картинки
gulp.task('images', function () {
  return gulp.src('app/img/**/*')
    .pipe(imagemin({
      progressive: true,
      interlaced: true
    }))
    .pipe(gulp.dest('dist/img'));
});

// Перенос остальных файлов, таких как favicon.ico и пр.
gulp.task('extras', function () {
  return gulp.src([
    'app/*.*',
    '!app/*.html'
  ]).pipe(gulp.dest('dist'));
});

// Вывод размера папки APP
gulp.task('size-app', function () {
    return gulp.src("app/**/*").pipe(size({title: "APP size: "}));
});

// Сборка и вывод размера содержимого папки dist
gulp.task('dist', ['useref', 'images', 'fonts', 'extras', 'size-app'], function () {
  return gulp.src('dist/**/*').pipe(size({title: 'DIST size'}));
});

// Собираем папку DIST (только после компиляции Jade)
gulp.task('build', ['clean', 'jade'], function () {
  gulp.start('dist');
});

// Проверка сборки
gulp.task('server-dist', function () {
  browserSync({
    notify: false,
    port: 8000,
    server: {
      baseDir: 'dist'
    }
  });
});


// ====================================================
// ===== Отправка проекта на сервер ===================
// ====================================================

gulp.task( 'deploy', function() {

  var conn = ftp.create( {
      host:     '',
      user:     '',
      password: '',
      parallel: 10,
      log: gutil.log
  } );

  var globs = [
      'dist/**/*'
  ];

  return gulp.src(globs, { base: 'dist/', buffer: false })
    .pipe(conn.dest( '/public_html/'));

});