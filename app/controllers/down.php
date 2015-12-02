<?php

//=============================================================================
// down.php
// Rockout - Browser-based GuitarHero-like video game
// 
// Created by Said Dermoumi on Wed Dec 21 17:52:06 2011
// Copyright (c) 2011 Said Dermoumi. All rights reserved.
//=============================================================================


class Down extends CI_Controller
{
    public function index()
    {
        $this->common->setup_lang();
        $this->load->view('down');
    }
}