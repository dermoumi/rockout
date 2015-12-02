<?php

//==============================================================================
// common.php
// Rockout - Browser-based GuitarHero-like video game
// 
// Created by Said Dermoumi on Tue Dec  6 11:02:35 GMT 2011.
// Copyright (c) 2011 Said Dermoumi. All rights reserved.
//==============================================================================

if ( ! defined('BASEPATH')) exit('No direct script access allowed'); 

class Common
{
    public function setup_lang($files = array())
    {
        $CI = &get_instance();
        
        // Make sure there's a "lang" cookie
        $lang = $CI->input->cookie('lang');
        if (!$lang) $CI->input->set_cookie('lang', 'en', 0);
        
        switch($lang) {
        case 'en':
        default:
        	$lang = 'english';
        };
        
        // Load languages
        $CI->lang->load('main', $lang);
        foreach ($files as $file) {
            $CI->lang->load($file, $lang);
        }
    }
    
    public function setup_view(
        $filename, $data = array(), $is_home = FALSE
    ) {
        $CI = &get_instance();
        
        if ($CI->input->is_ajax_request()) {
            $CI->load->view($filename, $data);
            return;
        }

        $CI->load->view('header', array('is_home' => $is_home));
        $CI->load->view($filename, $data);
        $CI->load->view('footer');
    }

    public function setup_user($forceupdate = FALSE)
    {
        $CI   = &get_instance();
        $data = array(
            'username' => '',
            'userrank' => 0,
            'userid'   => 0
        );

        // Get user rank (0 = guest)
        $data['userid'] = $CI->session->userdata('userid');
        if ($data['userid'] === FALSE) $data['userid'] = 0;

        // Check if there is an active session
        if ($data['userid'] > 0) {
            if ($forceupdate) {
                $user = $CI->User->get_by_id($data['userid']);
                if ($user !== FALSE) {
                    $data['username'] = $user->username;
                    $data['userrank'] = $user->userrank;
                }
            }

            $data['username'] = $CI->session->userdata('username');
            $data['userrank'] = $CI->session->userdata('userrank');
        }
        // Check if there are any login cookies
        elseif ($CI->input->cookie('rkt_uname') && $CI->input->cookie('rkt_pwd')) {
            $CI->load->model('user_model', 'User', TRUE);

            // Lets the UserModel check username and password
            $user = $CI->User->login_check(
                $CI->input->cookie('rkt_uname'),
                $CI->input->cookie('rkt_pwd')
            );

            // Save data
            if ($user !== FALSE) {
                $data['username'] = $user->username;
                $data['userrank'] = $user->rank;
                $data['userid']   = $user->id;
                $CI->session->set_userdata($data);
            }
        }

        return $data;
    }
}
