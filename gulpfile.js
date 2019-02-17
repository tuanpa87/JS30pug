// generated on 2018-07-03 using generator-webapp 3.0.1
const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const browserSync = require('browser-sync').create();
const del = require('del');
const wiredep = require('wiredep').stream;
const runSequence = require('run-sequence');
const concatUtils = require('gulp-concat-util');

const $ = gulpLoadPlugins();
const reload = browserSync.reload;

let dev = true;

gulp.task('views', () => {
	return gulp.src([
			'app/**/*.pug',
			'!app/layouts/*.pug',
			'!app/**/_*.pug'
		])
		.pipe($.plumber())
		.pipe($.pug({
			pretty: true,
			basedir: './app'
		}))
		.pipe(gulp.dest('.tmp'))
		.pipe(reload({ stream: true }));
});

gulp.task('styles', () => {
	return gulp.src(['app/assets/scss/**/*.scss','app/assets/css/*.css'])
		.pipe($.plumber())
		.pipe($.if(dev, $.sourcemaps.init()))
		.pipe($.sass.sync({
			outputStyle: 'expanded',
			precision: 10,
			includePaths: [
				'.',
				'./bower_components/',
				'./bower_components/bootstrap/scss/',
			]
		}).on('error', $.sass.logError))
		.pipe($.autoprefixer({ browsers: ['> 1%', 'last 2 versions', 'Firefox ESR'] }))
		.pipe($.if(dev, $.sourcemaps.write()))
		.pipe(gulp.dest('.tmp/assets/css'))
		.pipe(reload({ stream: true }));
});

gulp.task('modulesStyle', () => {
	return gulp.src(['app/modules/**/*.scss','app/modules/**/*.css'])
		.pipe($.plumber())
		.pipe($.if(dev, $.sourcemaps.init()))
		.pipe($.sass.sync({
			outputStyle: 'expanded',
			precision: 10
		}).on('error', $.sass.logError))
		.pipe($.autoprefixer({ browsers: ['> 1%', 'last 2 versions', 'Firefox ESR'] }))
		.pipe($.if(dev, $.sourcemaps.write()))
		.pipe(gulp.dest('.tmp/modules'))
		.pipe(reload({ stream: true }));
});


gulp.task('scripts', () => {
	return gulp.src([
			'./app/assets/js/**/*.js',
		])
		.pipe($.plumber())
		.pipe($.if(dev, $.sourcemaps.init()))
		.pipe($.babel())
		.pipe($.concat('main.js', { newLine: ';\n' }))
		.pipe(concatUtils.header('(function ($) {\n\n$.cs = {};\n\n'))
		.pipe(concatUtils.footer('\n\n})(jQuery)'))
		.pipe($.if(dev, $.sourcemaps.write('.')))
		.pipe(gulp.dest('.tmp/assets/js'))
		.pipe(reload({ stream: true }));
});

gulp.task('modulesScripts', () => {
	return gulp.src([
			'./app/modules/**/*.js',
		])
		.pipe(gulp.dest('.tmp/modules'))
		.pipe(reload({ stream: true }));
});

function lint(files) {
	return gulp.src(files)
		.pipe($.eslint({ fix: true }))
		.pipe(reload({ stream: true, once: true }))
		.pipe($.eslint.format())
		.pipe($.if(!browserSync.active, $.eslint.failAfterError()));
}

gulp.task('lint', () => {
	return lint('app/assets/js/**/*.js')
		.pipe(gulp.dest('app/assets/js'));
});
gulp.task('lint:test', () => {
	return lint('test/spec/**/*.js')
		.pipe(gulp.dest('test/spec'));
});

gulp.task('html', ['views', 'styles', 'modulesStyle' ,'scripts', 'modulesScripts'], () => {
	return gulp.src(['app/**/*.html', '.tmp/**/*.html', '.tmp/**/*.css', '.tmp/**/*.js'])
	//return gulp.src(['app/*.html', '.tmp/*.html'])
		.pipe($.useref({ searchPath: ['.tmp', 'app', ,'.'] }))
		// .pipe($.if(/\.js$/, $.uglify({compress: {drop_console: true}})))
		// .pipe($.if(/\.css$/, $.cssnano({safe: true, autoprefixer: false})))
		// .pipe($.if(/\.html$/, $.htmlmin({
		//   collapseWhitespace: true,
		//   minifyCSS: true,
		//   minifyJS: {compress: {drop_console: true}},
		//   processConditionalComments: true,
		//   removeComments: true,
		//   removeEmptyAttributes: true,
		//   removeScriptTypeAttributes: true,
		//   removeStyleLinkTypeAttributes: true
		// })))
		.pipe(gulp.dest('dist'));
});

gulp.task('images', () => {
	return gulp.src('app/assets/img/**/*')
		.pipe($.cache($.imagemin()))
		.pipe(gulp.dest('dist/assets/img'));
});

gulp.task('fonts', () => {
	return gulp.src(require('main-bower-files')('**/*.{eot,svg,ttf,woff,woff2}', function (err) { })
    .concat('bower_components/slick-carousel/slick/fonts/*')
    //.concat('node_modules/material-design-iconic-font/dist/fonts/*')
    .concat('app/assets/fonts/**/*'))
		.pipe($.if(dev, gulp.dest('.tmp/assets/fonts'), gulp.dest('dist/assets/fonts')));
});
//gulp.task('fonts', function() {
//  return gulp.src('node_modules/material-design-iconic-font/dist/fonts/*')
//    .pipe($.if(dev, gulp.dest('.tmp/assets/fonts'), gulp.dest('dist/assets/fonts')));
//});
gulp.task('extras', () => {
	return gulp.src([
			'app/*',
			'!app/*.html',
			'!app/*.pug'
		], {
			dot: true
		}).pipe(gulp.dest('dist'));
});

gulp.task('clean', del.bind(null, ['.tmp', 'dist']));

gulp.task('serve', () => {
	runSequence(['clean', 'wiredep'], ['views', 'styles','modulesStyle', 'scripts', 'modulesScripts' ,'fonts'], () => {
		browserSync.init({
			notify: false,
			port: 9000,
			server: {
				baseDir: ['.tmp', 'app'],
				routes: {
					'/bower_components': 'bower_components'
				}
			}
		});

		gulp.watch([
			'app/*.html',
			'app/assets/img/**/*',
			'.tmp/assets/fonts/**/*'
		]).on('change', reload);

		gulp.watch('./app/assets/**/*.scss', ['styles']);
		gulp.watch('./app/modules/**/*.css', ['modulesStyle']);
		gulp.watch('./app/assets/**/*.js', ['scripts']);
		gulp.watch('./app/modules/**/*.js', ['modulesScripts']);
		gulp.watch('./app/**/*.pug', ['views']);

		gulp.watch('app/assets/fonts/**/*', ['fonts']);
		gulp.watch('bower.json', ['wiredep', 'fonts']);
	});
});

gulp.task('serve:dist', ['default'], () => {
	browserSync.init({
		notify: false,
		port: 9000,
		server: {
			baseDir: ['dist']
		}
	});
});

gulp.task('serve:test', ['scripts'], () => {
	browserSync.init({
		notify: false,
		port: 9000,
		ui: false,
		server: {
			baseDir: 'test',
			routes: {
				'/bower_components': 'bower_components'
			}
		}
	});

	gulp.watch('app/assets/js/**/*.js', ['scripts']);
	gulp.watch(['test/spec/**/*.js', 'test/index.html']).on('change', reload);
	gulp.watch('test/spec/**/*.js', ['lint:test']);
});

// inject bower components
gulp.task('wiredep', () => {
	gulp.src('app/assets/scss/*.scss')
		.pipe($.filter(file => file.stat && file.stat.size))
		.pipe(wiredep({
			ignorePath: /^(\.\.\/)+/
		}))
		.pipe(gulp.dest('app/assets/scss'));

	gulp.src('app/layouts/*.pug')
		.pipe(wiredep({
			exclude: ['bootstrap'],
			ignorePath: /^(\.\.\/)*\.\./,
			fileTypes: {
				pug: {
					block: /(([ \t]*)\/\/-?\s*bower:*(\S*))(\n|\r|.)*?(\/\/-?\s*endbower)/gi,
					detect: {
						js: /script\(.*src=['"]([^'"]+)/gi,
						css: /link\(.*href=['"]([^'"]+)/gi
					},
					replace: {
						js: 'script(src=\'{{filePath}}\')',
						css: 'link(rel=\'stylesheet\', href=\'{{filePath}}\')'
					}
				}
			}
		}))
		.pipe(gulp.dest('app/layouts'));
});

gulp.task('build', ['lint', 'html', 'images', 'fonts', 'extras'], () => {
	return gulp.src('dist/**/*').pipe($.size({ title: 'build', gzip: true }));
});

gulp.task('default', () => {
	return new Promise(resolve => {
		dev = false;
		runSequence(['clean', 'wiredep'], 'build', resolve);
	});
});

