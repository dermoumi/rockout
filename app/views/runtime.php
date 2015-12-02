
var rkt = rkt || (function() {

// Constants
var SITE_URL = "<?php echo site_url() ?>";
var BASE_URL = "<?php echo base_url() ?>";

var runtimeObj = {};

<?php

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

?>

return runtimeObj;

})();;
