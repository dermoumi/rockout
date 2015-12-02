<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

define('RKT_GUEST', 0);
define('RKT_MEMBER', 1);
define('RKT_CREATOR', 2);
define('RKT_MODERATOR', 3);
define('RKT_SUPERVISOR', 4);
define('RKT_ADMIN', 5);

define('RKT_PLAY_STRUM', 0);
define('RKT_PLAY_TAP', 1);
define('RKT_MODE_EDIT', 2);

define('RKT_PLAY_EASY', 0);
define('RKT_PLAY_MEDIUM', 1);
define('RKT_PLAY_HARD', 2);
define('RKT_PLAY_AMAZING', 3);

define('RKT_STATE_PRIVATE', 0);
define('RKT_STATE_BETAMOD', 1);
define('RKT_STATE_PUBLIC',  2);

define('RKT_SONGS_PER_PAGE', 50);
define('RKT_SCORES_PER_PAGE', 50);

define('RKT_HASH_STR', 'R05YArtR$$81BX]');

define('RKT_EMAIL', 'sdermoumi@gmail.com');
define('RKT_EMAIL_NAME', 'Rockout Team');

/*
|--------------------------------------------------------------------------
| File and Directory Modes
|--------------------------------------------------------------------------
|
| These prefs are used when checking and setting modes when working
| with the file system.  The defaults are fine on servers with proper
| security, but you may wish (or even need) to change the values in
| certain environments (Apache running a separate process for each
| user, PHP under CGI with Apache suEXEC, etc.).  Octal values should
| always be used to set the mode correctly.
|
*/
define('FILE_READ_MODE', 0644);
define('FILE_WRITE_MODE', 0666);
define('DIR_READ_MODE', 0755);
define('DIR_WRITE_MODE', 0777);

/*
|--------------------------------------------------------------------------
| File Stream Modes
|--------------------------------------------------------------------------
|
| These modes are used when working with fopen()/popen()
|
*/

define('FOPEN_READ',							'rb');
define('FOPEN_READ_WRITE',						'r+b');
define('FOPEN_WRITE_CREATE_DESTRUCTIVE',		'wb'); // truncates existing file data, use with care
define('FOPEN_READ_WRITE_CREATE_DESTRUCTIVE',	'w+b'); // truncates existing file data, use with care
define('FOPEN_WRITE_CREATE',					'ab');
define('FOPEN_READ_WRITE_CREATE',				'a+b');
define('FOPEN_WRITE_CREATE_STRICT',				'xb');
define('FOPEN_READ_WRITE_CREATE_STRICT',		'x+b');


/* End of file constants.php */
/* Location: ./application/config/constants.php */