<?php

//=============================================================================
// user_model.php
// Rockout - Browser-based GuitarHero-like video game
// 
// Created by Said Dermoumi on Sun Jan  1 11:09:08 2012
// Copyright (c) 2011 Said Dermoumi. All rights reserved.
//=============================================================================

/*
 * Manages user-related database operations
 */
class User_model extends CI_Model
{
    var $id              = 0;
    var $username        = '';
    var $email           = '';
    var $password        = '';
    var $date_registered = '';
    var $rank            = 0;
    var $referrer_id     = 0;

    // Creates and adds a new user to database
    function insert_user($username, $email, $pwd, $ref_id, $rank = 1)
    {
        $this->username        = $username;
        $this->email           = $email;
        $this->password        = $pwd;
        $this->date_registered = date('Y-m-d H:i:s');
        $this->rank            = $rank;
        $this->referrer_id     = $ref_id;

        $this->db->insert('users', $this);
    }

    function update_recent_songs($user_id, $recent_songs)
    {
        $this->db->update(
            'users',
            array('recent_songs' => $recent_songs),
            array('id' => $user_id)
        );
    }

    function get_by_username($username)
    {
        $query = $this->db->get_where('users', array('username' => $username));
        foreach ($query->result() as $row) {
            return $row;
        }
        
        return FALSE;
    }

    function get_by_id($id)
    {
        $query = $this->db->get_where('users', array('id' => $id));
        foreach ($query->result() as $row) {
            return $row;
        }
        
        return FALSE;
    }

    function get_by_email($email)
    {
        $query = $this->db->get_where('users', array('email' => $email));
        foreach ($query->result() as $row) {
            return $row;
        }
        
        return FALSE;
    }

    function login_check($username, $password)
    {
        $this->db->where('username', $username);
        $this->db->or_where('email', $username);
        
        $result = $this->db->get('users')->result();
        foreach ($result as $row) {
            if($row->password == $password) {
                return $row;
            }
        }
        
        return FALSE;
    }
}