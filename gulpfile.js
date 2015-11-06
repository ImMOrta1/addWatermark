/* ----- plugins ----- */

var gulp 		= require('gulp'),
	browserSync = require('browser-sync'),
	jade        = require('gulp-jade'),
	compass 	= require('gulp-compass');

/* -----  paths ----- */

var paths = {
		jade : {
			location	: 'app/jade/**/*.jade',
			compiled	: 'app/jade/_pages/*.jade',
			destination	: 'app'
		},

		scss : {
			location	: 'app/scss/**/*scss',
			entryPoint	: 'app/css/main.css',
		},

		compass : {
			configFile	: 'config.rb',
			cssFolder	: 'app/css',
			scssFolder	: 'app/scss',
			imgFolder	: 'app/img'
		},

		browserSync : {
			baseDir		: 'app',
			watchPaths 	: ['app/*.html', 'app/css/*.css', 'app/js/*.js']
		}
}

/* ----- Jade ----- */

gulp.task('jade', function() {
	gulp.src(paths.jade.compiled)
		.pipe(jade({
			pretty: '\t',
		}))
		.pipe(gulp.dest(paths.jade.destination))
		.pipe(browserSync.stream());
});

/* ----- SCSS ----- */

gulp.task('compass', function() {
	gulp.src(paths.scss.location)
		.pipe(compass({
			config_file: paths.compass.configFile,
			css: paths.compass.cssFolder,
			sass: paths.compass.scssFolder,
			image: paths.compass.imgFolder
		}));
});

/* ----- Browser sync ----- */

gulp.task('sync', function() {
	browserSync.init({
		port: 9000,
		server: {
			baseDir: paths.browserSync.baseDir
		}
	});

});

/* ----- Watch ----- */

gulp.task('watch', function(){
	gulp.watch(paths.jade.location, ['jade']);
	gulp.watch(paths.scss.location, ['compass']);
	gulp.watch(paths.browserSync.watchPaths).on('change', browserSync.reload);
});

/* ----- Default ----- */

gulp.task('default', ['jade', 'compass', 'sync', 'watch']);