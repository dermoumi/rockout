<?php

//=============================================================================
// playlist_model.php
// Rockout - Browser-based GuitarHero-like video game
// 
// Created by Said Dermoumi on Wed Jan 11 12:33:07 2012
// Copyright (c) 2011 Said Dermoumi. All rights reserved.
//=============================================================================

/*
 * Handles playlists operations
 */
class Playlist_model extends CI_Model
{
    var $name;
    var $user_id;
    var $songs;
    var $date_created;

    function add($name, $user_id, $songs)
    {
        $this->name          = $name;
        $this->user_id       = $user_id;
        $this->songs         = implode(',', $songs);
        $this->$date_created = date('Y-m-d H:i:s');

        $this->db->insert('playlists', $this);
    }

    function get_by_id($id)
    {
        $query = $this->db->get_where('playlists', array('id' => $id));
        foreach ($query->result() as $row) {
            return $row;
        }

        return FALSE;
    }

    function get_by_user($uid)
    {
        $query = $this->db->get_where('playlists', array('user_id' => $uid));
        return $query->result();
    }
}