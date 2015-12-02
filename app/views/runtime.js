<?php 

/* Comment this line if you put compiled
?>

// Compiled code goes here

<?php

/*/

echo "var rkt = rkt || (function() {\n\n"

// Constants
   . "var SITE_URL = '" . site_url() . "';\n"
   . "var BASE_URL = '" . base_url() . "';\n\n"
   . "var runtimeObj = {};\n\n";

// Main modules
$this->load->view('javascript/settings.js');
$this->load->view('javascript/input.js');

// Navigation
$this->load->view('javascript/pages.js');
$this->load->view('javascript/navigation.js');
$this->load->view('javascript/pagination.js');

// Pages
$this->load->view('javascript/pages/title.js');
$this->load->view('javascript/pages/settings.js');
$this->load->view('javascript/pages/playlists.js');
$this->load->view('javascript/pages/song.js');
$this->load->view('javascript/pages/about.js');
$this->load->view('javascript/pages/user.js');
$this->load->view('javascript/pages/game.js');
$this->load->view('javascript/pages/editor.js');
$this->load->view('javascript/pages/message.js');

// Game runtime files are included in javascript/pages/game.js
$this->load->view('javascript/sound.js');

// Loaders
$this->load->view('javascript/main.js');

echo "\nreturn runtimeObj;\n"
 . '})();';

//*/
