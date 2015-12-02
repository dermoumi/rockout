<?php

//=============================================================================
// about.php
// Rockout - Browser-based GuitarHero-like video game
// 
// Created by Said Dermoumi on Fri Dec 23 08:51:38 2011
// Copyright (c) 2011 Said Dermoumi. All rights reserved.
//=============================================================================

/*
 * Handles different about pages
 */
class About extends CI_Controller
{
    function __construct() {
        parent::__construct();
        $this->common->setup_lang();
    }

    // Handles Disclaimer page
    function disclaimer()
    {
        $this->common->setup_view('disclaimer');
    }

    // Handles FAQ page
    function faq()
    {
        $this->common->setup_view('faq');
    }

    // Handles Languages page
    function lang_select()
    {
        $this->common->setup_view('lang_select');
    }

    // Handles Terms of Service page
    function tos()
    {
        $this->common->setup_view('tos');
    }

    // Handles About page
    function index()
    {
        $this->common->setup_view('about');
    }
}