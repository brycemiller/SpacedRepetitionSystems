<?php include_once(dirname(__FILE__).'/php/session/sessionTracking.php'); ?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<link rel="stylesheet" type="text/css" href="../libs/ext/resources/css/ext-all.css" />
	<link rel="stylesheet" type="text/css" href="../resources/icons/silk.css" />
	<link rel="stylesheet" type="text/css" href="css/srs-min.css" />
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
	<title>SRS Systems</title>
</head>
<body>
	<?php /*<div id="browserSupportBar">
		<table>
			<tr>
				<td colspan="4" align="center">
					This software has been tested on the following browsers:
				</td>
			</tr>
			<tr><td>
				<a href="http://www.google.com/chrome">
					<img src="../resources/browserLogos/chrome.png" height="100" width="100" alt="Chrome"/>
				</a>
			</td><td>
				<a href="http://www.getfirefox.com">
					<img src="../resources/browserLogos/firefox.png" height="100" width="100" alt="Firefox 3"/>
				</a>
			</td><td>
				<a href="http://www.microsoft.com/windows/internet-explorer/default.aspx">
					<img src="../resources/browserLogos/ie.png" height="100" width="100" alt="Internet Explorer 8"/>
				</a>
			</td><td>
				<a href="http://www.opera.com/browser/download/">
					<img src="../resources/browserLogos/opera.png" height="100" width="100" alt="Opera 10"/>
				</a>
			</td></tr>
			<tr>
				<td align="center">Chrome 4</td>
				<td align="center">Firefox 3</td>
				<td align="center">Explorer 8</td>
				<td align="center">Opera 10</td>
			</tr>
			<tr>
				<td colspan="4" align="center">
					The use of any other browser will not guarantee correct functionality.  We do not support any Safari web browser.
				</td>
			</tr>
		</table>
	</div>*/ ?>
	<div id="main"/>
	<?php include(dirname(__FILE__).'/php/login/chap.php'); ?>
	<script type="text/javascript" src="../libs/ext/adapter/ext/ext-base.js"></script>
	<script type="text/javascript" src="../libs/ext/ext-all.js"></script>
	<script type="text/javascript" src="../libs/js/JSON2/json2.js"></script>
	<script type="text/javascript" src="../libs/js/MD5/md5.js"></script>
	<script type="text/javascript" src="js/login/login-all-min.js"></script>
</body>
</html>
