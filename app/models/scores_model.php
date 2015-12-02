<?php

//=============================================================================
// scores_model.php
// Rockout - Browser-based GuitarHero-like video game
// 
// Created by Said Dermoumi on Wed Jan 11 15:02:25 2012
// Copyright (c) 2011 Said Dermoumi. All rights reserved.
//=============================================================================

/*
 * Manages and lists scores
 */
class Scores_model extends CI_Model
{
    var $user_id;
    var $song_id;
    var $play_type;
    var $score;
    var $date;

    function get_best_by_song($song_id, $play_type)
    {
        $this->db->select('scores.id AS id, user_id, username, song_id, score, play_type, date');
        $this->db->join('users', 'users.id = scores.user_id');
        $this->db->order_by('score', 'desc');
        $query = $this->db->get_where('scores', array(
            'song_id' => $song_id, 
            'play_type' => $play_type
        ), 1);

        foreach ($query->result() as $row) {
            return $row;
        }
            
        return FALSE;
    }
}