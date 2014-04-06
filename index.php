<?php 

	/* Main page is under /application, so redirect immediately */
	header("Location: $_SERVER[REQUEST_URI]application");
	exit;