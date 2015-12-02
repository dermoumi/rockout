<?php

//=============================================================================
// songs.php
// Rockout - Browser-based GuitarHero-like video game
// 
// Created by Said Dermoumi on Thu Dec 22 07:21:12 2011
// Copyright (c) 2011 Said Dermoumi. All rights reserved.
//=============================================================================

/*
 * Shows song lists and creates new entries
 */
class Songs extends CI_Controller
{
    var $_entries_per_page = 50;

    function __construct() {
        parent::__construct();

        $this->load->model('songs_model', 'Song', TRUE);
    }
    // Shows all songs in the database
    function all($sort = 'date', $order = 'desc', $page = 1)
    {
        if (!$this->input->is_ajax_request()) return;

        $page       = (INT)$page;

        $entries_num = $this->Song->count_songs(2);
        $page_count  = ceil($entries_num / $this->_entries_per_page);

        $entries = $this->Song->get_list(
            $sort, $order, 2,
            ($page-1) * $this->_entries_per_page,
            $this->_entries_per_page
        );

        $this->_show_list(
            'all', $entries, $sort, $order, $page, $page_count
        );
    }

    function recent()
    {
        if (!$this->input->is_ajax_request()) return;

        $uid = $this->session->userdata('userid');
        $recent_songs = FALSE;
        if ($uid) {
            // Load recent songs
            $this->load->model('user_model', 'User', TRUE);
            $user = $this->User->get_by_id($uid);
            $recent_songs = explode(',', $user->recent_songs);
            array_splice($recent_songs, 20);
        }
        else if ($this->input->cookie('rkt_recent')) {
            $recent_songs = explode(',', $this->input->cookie('rkt_recent'));
        }

        $entries = array();
        if ($recent_songs) {
            $entries_unsorted = $this->Song->get_by_ids(
                $recent_songs, 'date', 'asc',
                0, $this->_entries_per_page
            );

            foreach ($entries_unsorted as $entry) {
                $entries[array_search($entry->id, $recent_songs)] = $entry;
            }
            ksort($entries);
        }
        
        $this->_show_list(
            'recent', $entries, 'date', 'asc', 1, 1
        );
    }

    function show_list($id = 'all', $sort = 'date', $order = 'desc', $page = 1)
    {
        if ($id == 'all')         return $this->all($sort, $order, $page);
        else if ($id == 'recent') return $this->recent();

        if (!$this->input->is_ajax_request()) return;

        if (!$this->input->is_ajax_request()) return;

        $id          = (INT)$id;
        $page        = (INT)$page;
        $entries_num = $this->Song->count_songs(2);
        $page_count  = ceil($entries_num / $this->_entries_per_page);

        $this->load->model('playlist_model', 'Playlist', TRUE);
        $entries = array();
        
        $playlist = $this->Playlist->get_by_id($id);
        if ($playlist) {
            $entries = $this->Song->get_by_ids(
                explode(',', $playlist->songs),
                $sort, $order,
                ($page-1) * $this->_entries_per_page,
                $this->_entries_per_page
            );
        }

        $this->_show_list(
            $id, $entries, $sort, $order, $page, $page_count
        );
    }

    function show($id = 0)
    {
        $id = (INT)$id;

        $song = $this->Song->get_by_id($id);
        if ( ! $song) header('Location: ' . site_url());

        $this->load->model('scores_model', 'Scores', TRUE);

        $data = array(
            'song'       => $song,
            'strum_score'=>$this->Scores->get_best_by_song($id, RKT_PLAY_STRUM),
            'tap_score'  => $this->Scores->get_best_by_song($id, RKT_PLAY_TAP)
        );

        $this->common->setup_user();
        $this->common->setup_lang();
        $this->common->setup_view('song_page', $data);
    }

    function create()
    {
        $this->load->library('form_validation');

        $this->common->setup_user();
        $this->common->setup_lang();
        $this->common->setup_view('song_create');
    }

    private function _show_list($id, $entries, $sorting, $order,
        $page, $page_count
    ) {
        // Check if there are no entries
        if ($entries === FALSE) return;

        $data = array(
            'id'           => $id,
            'entries'      => $entries,
            'sorting'      => $sorting,
            'order'        => $order,
            'page_count'   => $page_count,
            'current_page' => $page,
            'no_filters'   => $this->input->post('nofilters')
        );

        $this->common->setup_lang();
        $this->common->setup_view('songs', $data);
    }
}