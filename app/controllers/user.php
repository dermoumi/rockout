<?php

//=============================================================================
// user.php
// Rockout - Browser-based GuitarHero-like video game
// 
// Created by Said Dermoumi on Fri Dec 23 09:42:38 2011
// Copyright (c) 2011 Said Dermoumi. All rights reserved.
//=============================================================================

/*
 * Handles user data and interactions
 */
class User extends CI_Controller
{
    // Loads language and other things
    function __construct()
    {
        parent::__construct();
        $this->common->setup_lang();

        $this->load->model('user_model', 'User', TRUE);
        $this->load->library('form_validation');
        $this->form_validation->set_error_delimiters('<p class="error-box">', '</p>');
    }

    // Loads and handles login page
    function login()
    {
        $user = $this->common->setup_user();
        if ($user['userid']) header('Location: ' . site_url());

        $data = array('login_failed' => FALSE);

        // Setup validation form
        $this->form_validation->set_rules('username', 'Username',
            'trim|required|xss_clean'
        );
        $this->form_validation->set_rules('password', 'Password',
            'trim|required|callback__password_hash'
        );
        
        if ($this->form_validation->run() === FALSE) {
            // Validation failed
            $this->common->setup_view('login', $data);
            return;
        }

        // else, get the user
        $user = $this->User->login_check(
            $this->input->post('username'),
            $this->input->post('password')
        );

        // Check that the user exists
        if ($user === FALSE) {
            $data['login_failed'] = TRUE;
            $this->common->setup_view('login', $data);
            return;
        }

        // Set cookie if the user requested to stay logged
        if ($this->input->post('staylogged')) {
            $this->input->set_cookie('uname', $user->username, 2592000);
            $this->input->set_cookie('pwd', $user->password, 2592000);
        }

        // Save session data
        $this->session->set_userdata(array(
            'userid'   => $user->id,
            'username' => $user->username,
            'userrank' => $user->rank
        ));

        // Load recent songs
        $recent_songs = $this->input->cookie('rkt_recent')
            ? explode(',', $this->input->cookie('rkt_recent'))
            : array();
        array_merge($recent_songs, explode(',', $user->recent_songs));
        array_splice($recent_songs, 20);

        // Save recent songs
        $this->input->set_cookie('recent', implode(',', $recent_songs), 0);
        // TODO: add it to database

        // Show a logged in successfully and reload the page
        $data = array(
            'message' => '<p>Logged in successfully!</p><p>Redirecting...</p>',
            'reload'  => TRUE
        );
        $this->common->setup_view('show_message', $data);
    }

    function register($ref_id = 0)
    {
        $user = $this->common->setup_user();
        if ($user['userid']) header('Location: ' . site_url());

        $this->form_validation->set_rules(
            'username', 'Username',
            'trim|required|min_length[5]|max_length[12]|alpha_dash|xss_clean|callback__username_check'
        );
        $this->form_validation->set_rules(
            'email', 'Email',
            'trim|required|valid_email|xss_clean|callback__email_check'
        );
        $this->form_validation->set_rules(
            'password', 'Password',
            'trim|required|matches[password_conf]|callback__password_hash'
        );
        $this->form_validation->set_rules(
            'password_conf', 'Password Confirmation',
            'trim|required'
        );
        
        // If there are any validation errors
        if ($this->form_validation->run() == FALSE) {
            $this->common->setup_view('register');
            return;
        }

        // Otherwise, add user to database
        $this->User->insert_user(
            $this->input->post('username'),
            $this->input->post('email'),
            $this->input->post('password'),
            $ref_id
        );

        $this->load->library('email');
        $this->email->from(RKT_EMAIL, RKT_EMAIL_NAME);
        $this->email->to($this->input->post('email'));
        $this->email->subject('Please confirm you email address');
        $this->email->message(
            $this->load->view('register_email', array(
                'username' => $this->input->post('username'),
            true)
        ));
        $this->email->send();

        // Show success message
        $data = array(
            'message' => '<p>You successfully signed up. An email has been sent to validate your email address.</p><p>Please note that as long as your email address is not validated, you will not be earning JamPoints.</p>',
            'reload'  => TRUE
        );
        $this->common->setup_view('show_message', $data);
    }

    function pwd_recover($token)
    {
        if ($token) {
            // TO DO
            return;
        }

        // Otherwise
        $this->common->setup_view('pwd_recover_form');
    }

    function logout()
    {
        // Ajax check
        // if ( ! $this->input->is_ajax_request()) return;
        
        // Destroy session and remove cookies
        $this->session->sess_destroy();
        $this->input->set_cookie('uname', '', '');
        $this->input->set_cookie('pwd', '', '');
        
        // Show a success message and reload
        $data = array(
            'message' => '<p>Logged out successfully!</p><p>Redirecting...</p>',
            'reload'  => TRUE
        );
        $this->load->view('show_message', $data);
    }

    /**
     * A filtering callback to check if the username is taken or not
     */
    function _username_check($str)
    {
        $query = $this->User->get_by_username($str);
        if ($query== FALSE) return TRUE;
        
        $this->form_validation->set_message('_username_check',
            $str . ' is already used.'
        );
        return FALSE;
    }
    
    /**
     * A filtering callback to check if the email is already registered or not
     */
    function _email_check($str)
    {
        $query = $this->User->get_by_email($str);
        if ($query== FALSE) return TRUE;
        
        $this->form_validation->set_message('_email_check',
            $str . ' is already registered.'
        );
        return FALSE;
    }
    
    /**
     * A filter callback that hashes the password in sha1
     * The hashword 'R05YArtR$$81BX]' is just a simple action for more security
     */
    function _password_hash($pwd)
    {
        return sha1(RKT_HASH_STR . $pwd);
    }
}