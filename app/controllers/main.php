<?php

//==============================================================================
// main.php
// Rockout - Browser-based GuitarHero-like video game
// 
// Created by Said Dermoumi on Tue Dec  6 11:18:29 GMT 2011
// Copyright (c) 2011 Said Dermoumi. All rights reserved.
//==============================================================================

if ( ! defined('BASEPATH')) exit('No direct script access allowed'); 

class Main extends CI_Controller
{
	public function index()
	{
		$this->common->setup_lang();
		$this->common->setup_view('main', $this->common->setup_user(), true);
	}
    
    public function order_notification($order_id)
    {
        $this->load->library('email');
        $this->email->from('example@example.co.uk', 'My Name');
        $this->email->to('sdermoumi@gmail.com');
        $this->email->subject('Email Test');
        $this->email->message('Your order: '.$order_id . ' was submitted successfully');
        $this->email->send();
    }

}
