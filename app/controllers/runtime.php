<?php

//==============================================================================
// runtime.php
// Rockout - Browser-based GuitarHero-like video game
// 
// Created by Said Dermoumi on Tue Dec  6 22:04:07 GMT 2011
// Copyright (c) 2011 Said Dermoumi. All rights reserved.
//==============================================================================

if ( ! defined('BASEPATH')) exit('No direct script access allowed'); 

class Runtime extends CI_Controller
{
    public function index()
    {
		$this->common->setup_lang();
		
        header('Content-Type: text/javascript');
        $this->load->helper(array('url', 'language'));

        echo preg_replace_callback(
            '#LANG\{(.*?)\}#',
            create_function('$matches', 'return lang($matches[1]);'),
            $this->load->view('runtime.js', '', TRUE)
        );
    }

    public function compile() {
        if (ENVIRONMENT != 'development') return;

        $this->common->setup_lang();
        
        header('Content-Type: text/javascript');
        $this->load->helper(array('url', 'language'));
        echo $this->load->view('runtime.js', '', TRUE);
    }

    public function game($song_id = 0, $mode = RKT_PLAY_STRUM)
    {
        // if (!$this->input->is_ajax_request()) return;

        $song_id = (INT)$song_id;
        $mode    = (INT)$mode;

        $uid = $this->session->userdata('userid');
        $recent_songs = array();
        if ($uid) {
            // Load recent songs
            $this->load->model('user_model', 'User', TRUE);
            $user = $this->User->get_by_id($uid);
            $recent_songs = explode(',', $user->recent_songs);
        }
        else if ($this->input->cookie('rkt_recent')) {
            $recent_songs = explode(',',$this->input->cookie('rkt_recent'));
        }

        for($i = count($recent_songs) - 1; $i >= 0; --$i) {
            if ($recent_songs[$i] == $song_id) {
                array_splice($recent_songs, $i, 1);
                break;
            }
        }
        
        array_unshift($recent_songs, $song_id);
        array_splice($recent_songs, 20);
        $recent_songs = implode(',', $recent_songs);
        $this->input->set_cookie('recent', $recent_songs, 0);
        if ($uid) $this->User->update_recent_songs($uid, $recent_songs);

        $data = array(
            'mode'      => $mode,
            'song_id'   => $song_id,
            'song_data' => $this->_songData($song_id, $mode)
        );

        $this->common->setup_lang();
        $this->common->setup_view('game', $data);
    }

    private function _songData($song_id, $mode)
    {
        $keyStr = $this->_randomStr(8);
        $output = 'RKT1.0';

        $this->load->model('songs_model', 'Song', TRUE);
        $song = $this->Song->get_by_id($song_id);
        if ( ! $song) return '';

        $output .= '!' . $mode;
        $output .= '!' . $song->video_id;
        $output .= '!' . $song->notes;
        $output .= '!' . $song->bpm;

        return base64_encode(utf8_encode($this->_crypt($output, $keyStr)
            . $this->_crypt($keyStr, ':T*K25k6')));
    }

    private function _randomStr($size)
    {
        $output = '';
        for ($i = $size - 1; $i >= 0; --$i) {
            $output .= chr(mt_rand(0, 255));
        }
        return $output;
    }

    private function _crypt($input, $keystr)
    {
        $output = '';
        $length = strlen($input);
        $keyLen = strlen($keystr);
        for ($i = 0; $i < $length; ++$i) {
            $keyOffset = $i % $keyLen;
            $output .= chr(((ord($input{$i}) & 255) ^ (ord($keystr{$keyOffset}) & 255)) & 255);
        }
        return $output;
    }
}
