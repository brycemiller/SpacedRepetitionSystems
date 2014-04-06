<?php

include_once(dirname(__FILE__).'/../../../libs/php/chap/chap.php');

// get new chap object and set the challenge
$chap = new chap();
$chap->setChallenge();

// write out the challenge
echo '<script type="text/javascript">var chap = \'', $chap->getChallenge(), '\';</script>'."\n";
