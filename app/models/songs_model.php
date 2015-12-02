<?php

//=============================================================================
// songs_model.php
// Rockout - Browser-based GuitarHero-like video game
// 
// Created by Said Dermoumi on Tue Jan 10 20:49:47 2012
// Copyright (c) 2011 Said Dermoumi. All rights reserved.
//=============================================================================

/*
 * Loads and saves song related data
 */
class Songs_model extends CI_Model
{
    function get_list($sort, $order, $state, $offset, $limit)
    {
        $state   = (INT)$state;
        $offset  = (INT)$offset;
        $limit   = (INT)$limit;
        $sort    = $this->_check_sort($sort);
        
        $this->db->where('state', $state);
        $this->db->order_by($sort, ($order == 'asc')?'asc':'desc');

        return $this->db->get('songs', $limit, $offset)->result();
    }

    function get_by_id($id)
    {
        $query = $this->db->get_where('songs', array('id' => $id));
        foreach ($query->result() as $row) {
            return $row;
        }
            
        return FALSE;
    }

    function get_by_ids($songs, $sort, $order, $offset, $limit)
    {
        $offset = (INT)$offset;
        $limit  = (INT)$limit;
        $sort   = $this->_check_sort($sort);
        
        $this->db->select('*');
        $this->db->order_by($sort, ($order == 'asc')?'asc':'desc');
        
        foreach ($songs as $song_id) {
            $this->db->or_where('id', $song_id);
        }
        
        return $this->db->get('songs', $limit, $offset)->result();
    }

    function count_songs($state)
    {
        $state = (INT)$state;
    
        $this->db->where('state', $state);
        $this->db->from('songs');
        return $this->db->count_all_results();
    }

    private function _check_sort($sort)
    {
        if ($sort == 'rating' || $sort == 'title' || $sort == 'artist'
            || $sort == 'bpm' || $sort == 'duration' || $sort == 'difficuly'
        ) {
            return $sort;
        }
        
        return 'date_created';
    }
}