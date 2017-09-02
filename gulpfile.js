//process.env.DISABLE_NOTIFIER = true; // Uncomment to disable all Gulp notifications.

/**		
 * Genesis Starter.		
 *		
 * This file adds gulp tasks to the Genesis Starter theme.		
 *		
 * @author Seo themes		
 */

// Require our dependencies.
var autoprefixer = require( 'autoprefixer' );
var browsersync  = require( 'browser-sync' );
var mqpacker     = require( 'css-mqpacker' );
var gulp         = require( 'gulp' );
var beautify     = require( 'gulp-cssbeautify' );
var cache        = require( 'gulp-cached' );
//var cleancss     = require( 'gulp-clean-css' );
var csscomb      = require( 'gulp-csscomb' );
var cssnano      = require( 'gulp-cssnano' );
var filter       = require( 'gulp-filter' );
var notify       = require( 'gulp-notify' );
var pixrem       = require( 'gulp-pixrem' );
var plumber      = require( 'gulp-plumber' );
var postcss      = require( 'gulp-postcss' );
var rename       = require( 'gulp-rename' );
var replace      = require( 'gulp-replace' );
var sass         = require( 'gulp-sass' );
var sort         = require( 'gulp-sort' );
var sourcemaps   = require( 'gulp-sourcemaps' );

// CSS formatting.
var format = {
	breaks: {
		afterAtRule: true,
		afterBlockBegins: true,
		afterBlockEnds: true,
		afterComment: true,
		afterProperty: true,
		afterRuleBegins: true,
		afterRuleEnds: true,
		beforeBlockEnds: true,
		betweenSelectors: true
	},
	indentBy: 1,
	indentWith: 'tab',
	spaces: {
		aroundSelectorRelation: true,
		beforeBlockBegins: true,
		beforeValue: true
	},
	wrapAt: false
}

/**
* Autoprefixed browser support.
*
* https://github.com/ai/browserslist
*/
const AUTOPREFIXER_BROWSERS = [
	'last 2 versions',
	'> 0.25%',
	'ie >= 8',
	'ie_mob >= 9',
	'ff >= 28',
	'chrome >= 40',
	'safari >= 6',
	'opera >= 22',
	'ios >= 6',
	'android >= 4',
	'bb >= 9'
];

/**
* Compile Sass.
*
* https://www.npmjs.com/package/gulp-sass
*/
gulp.task( 'woocommerce', function () {

	/**
	 * Process WooCommerce styles.
	 */
	gulp.src( './sass/woocommerce.scss' )

	// Notify on error
	.pipe( plumber( { errorHandler: notify.onError( "Error: <%= error.message %>" ) } ) )

	// Source maps init
	.pipe( sourcemaps.init() )

	// Process sass
	.pipe( sass( {
		outputStyle: 'expanded'
	} ) )

	// Pixel fallbacks for rem units.
	.pipe( pixrem() )

	// Parse with PostCSS plugins.
	.pipe( postcss( [
		autoprefixer( {
			browsers: AUTOPREFIXER_BROWSERS
		} ),
		mqpacker( {
			sort: true
		} ),
	] ) )

	// Format non-minified stylesheet.
	// .pipe ( cleancss( {
	// 	level: 0,
	// 	format: format
	// } ) )

	// CSS comb.
	.pipe(csscomb())

	// Add .min suffix.
	.pipe( rename( { prefix: 'genesis-sample-' } ) )

	// Output non minified css to theme directory.
	.pipe( gulp.dest( './lib/woocommerce/' ) )

	// Write source map.
	.pipe( sourcemaps.write( './' ) )

	// Inject changes via browsersync.
	.pipe( browsersync.reload( { stream: true } ) )

	// Filtering stream to only css files.
	.pipe( filter( '**/*.css' ) )

	// Notify on successful compile (uncomment for notifications).
	.pipe( notify( "Compiled: <%= file.relative %>" ) );

} );

/**
* Compile Sass.
*
* https://www.npmjs.com/package/gulp-sass
*/
gulp.task( 'styles', [ 'woocommerce' ], function () {

	gulp.src( './sass/style.scss' )

	// Notify on error
	.pipe( plumber( { errorHandler: notify.onError( "Error: <%= error.message %>" ) } ) )

	// Source maps init
	.pipe( sourcemaps.init() )

	// Process sass
	.pipe( sass( {
		outputStyle: 'expanded'
	} ) )

	// Pixel fallbacks for rem units.
	.pipe( pixrem() )

	// Parse with PostCSS plugins.
	.pipe( postcss( [
		autoprefixer( {
			browsers: AUTOPREFIXER_BROWSERS
		} ),
		mqpacker( {
			sort: true
		} ),
	] ) )

	// Format non-minified stylesheet.
	// .pipe ( cleancss( {
	// 	level: 0,
	// 	format: format
	// } ) )

	// CSS comb.
	.pipe( csscomb() )

	// Output non minified css to theme directory.
	.pipe( gulp.dest( './' ) )

	// Write source map.
	.pipe( sourcemaps.write( './' ) )

	// Inject changes via browsersync.
	.pipe( browsersync.reload( { stream: true } ) )

	// Filtering stream to only css files.
	.pipe( filter( '**/*.css' ) )

	// Notify on successful compile (uncomment for notifications).
	.pipe( notify( "Compiled: <%= file.relative %>" ) );

} );

/**
* Process tasks and reload browsers on file changes.
*
* https://www.npmjs.com/package/browser-sync
*/
gulp.task( 'watch', function() {

	// HTTPS (optional).
	browsersync( {
		proxy: 'https://sample.dev',
		port: 8000,
		notify: false,
		open: false,
		https: {
			"key": "/Users/seothemes/.valet/Certificates/sample.dev.key",
			"cert": "/Users/seothemes/.valet/Certificates/sample.dev.crt"
		}
	} );

	// Non HTTPS.
	//  browsersync( {
	// 	    proxy: 'sample.dev',
	// 	    notify: false,
	// 	    open: false,
	//  } );

	// Run tasks when files change.
	gulp.watch( './sass/*.scss' ).on( 'change', browsersync.reload );

} );

/**
* Create default task.
*/
gulp.task( 'default', [ 'watch' ], function() {
	gulp.start( 'styles' );
} );