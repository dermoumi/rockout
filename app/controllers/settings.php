<?php

//==============================================================================
// settings.php
// Rockout - Browser-based GuitarHero-like video game
// 
// Created by Said Dermoumi on Sun Dec 11 22:03:06 2011
// Copyright (c) 2011 Said Dermoumi. All rights reserved.
//==============================================================================

if ( ! defined('BASEPATH')) exit('No direct script access allowed'); 

class Settings extends CI_Controller
{
    public function index()
    {
        $this->common->setup_lang();
        $this->common->setup_view('settings');
    }
}