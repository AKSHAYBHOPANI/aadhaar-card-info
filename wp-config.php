<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the
 * installation. You don't have to use the web site, you can
 * copy this file to "wp-config.php" and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * MySQL settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://wordpress.org/support/article/editing-wp-config-php/
 *
 * @package WordPress
 */

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'aadhaar_db' );

/** MySQL database username */
define( 'DB_USER', 'root' );

/** MySQL database password */
define( 'DB_PASSWORD', '' );

/** MySQL hostname */
define( 'DB_HOST', 'localhost' );

/** Database Charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8mb4' );

/** The Database Collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',         'BF+Omz9lVT%Udg,hP=1*&SOn;N&3r2 *yh^5E%=d@>(=AI*cW:oVSxL@EiJOI8:!' );
define( 'SECURE_AUTH_KEY',  '[^D(?mv|Ld3z^_nbDih=c<~6PBa[5KM#OpN)Gb__WkSUCn1PWY}R_{?dY7cOJXkJ' );
define( 'LOGGED_IN_KEY',    '1/CP>oiD~$.=0 S38K)b#MMZdRc~}Q^VYx:4t]Sh|grtE7dr>q/kagdndrS]#hq+' );
define( 'NONCE_KEY',        'VG19Jlq4nDsW@)*r~}53s}FE/s6V<Lf,q[0r;eNo8a^egq`;j}W3kd]#pI^8;c L' );
define( 'AUTH_SALT',        'VSNwekSIc*SNgJ5Q9J{[@aYYYQGrop 2|$C//=ufN$$uX9%zdVJcR@l}?a$,SnJP' );
define( 'SECURE_AUTH_SALT', 'W$W2r ^M2`nz1sNQUgYPYZ=Rxd7rKpIyx[.ItO2v+*-%<z):U*Xmi3tK1OSkn@p7' );
define( 'LOGGED_IN_SALT',   'B&*HyTL2-R^Kh,aO5f|(;xc6Y`euUmS6oJ-,&It`&>.IxCwawF!(25R(_BLJxXIH' );
define( 'NONCE_SALT',       'N4/3a#tgrx+1 %KwR;QDuL}h{YCL$4jXQ7wc_DT/KQl0/s36N!Jf0b<`aTra2>b{' );

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://wordpress.org/support/article/debugging-in-wordpress/
 */
define( 'WP_DEBUG', false );

/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
