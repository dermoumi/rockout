<?php

//=============================================================================
// playlists.php
// Rockout - Browser-based GuitarHero-like video game
// 
// Created by Said Dermoumi on Wed Dec 21 17:52:38 2011
// Copyright (c) 2011 Said Dermoumi. All rights reserved.
//=============================================================================

/*
 * Shows and adds user's playlists
 */
class Playlists extends CI_Controller
{
    function __construct() {
        parent::__construct();

        $this->load->model('playlist_model', 'Playlist', TRUE);
    }
    // Shows all playlists
    function index()
    {
        $user_rank = 0;
        $playlists = array();

        $user = $this->common->setup_user();
        if ($user) {
            $user_rank = $user['userrank'];
            $playlists = $this->Playlist->get_by_user($user['userid']);
            if ($playlists == FALSE) $playlists = array();
        }

        $data = array(
            'user_rank' => $user_rank,
            'playlists' => $playlists
        );
        $this->common->setup_lang();
        $this->common->setup_view('playlists', $data);
    }
}