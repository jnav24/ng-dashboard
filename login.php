<?php
	
	$error = '';
	$file = 'json/users.json';
	$turtles = array(
		'leonardo',
		'donatello',
		'raphael',
		'michaelangelo'
	);

	$turtleData = array(
		'leonardo' => array(
			"user_id" =>"2",
			"username" =>"Leonardo",
			"img" => "Leonardo-tmnt-27864205-600-611.jpg",
			"bgimg" =>"ninja_turtles_cgi.jpg"
		),
		'donatello' => array(
			"user_id" =>"4",
			"username" =>"Donatello",
			"img" => "donatello.jpg",
			"bgimg" =>"don_images.jpeg"
		),
		'raphael' => array(
			"user_id" =>"3",
			"username" =>"Ralphael",
			"img" => "ralph.jpg",
			"bgimg" =>"TMNT-Raphael-Casey_1600.jpg"
		),
		'michaelangelo' => array(
			"user_id" =>"1",
			"username" =>"Michaelangelo",
			"img" => "item_L_5557579_2561851.jpg",
			"bgimg" =>"Sewer_lair_(2).jpg"
		)
	);

	if(isset($_POST['form']))
	{
		if( empty($_POST['username']) )
		{
			$error = getError('Please enter username');
		}
		else if(!in_array(strtolower($_POST['username']), $turtles))
		{
			$error = getError('That user does not exist');
		}
		else 
		{
			// creates cookie of user info
			$td = implode('|',$turtleData[$_POST['username']]);
			setcookie('jnuser',$td);

			// creates new json file with new info
			/*$json = json_encode($turtleData[$_POST['username']]);
			file_put_contents($file, $json);*/

			header('Location:index.html');
		}
	}

	function getError($error)
	{
		return '<p class="error">' . $error . '</p>';
	}

?><!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Document</title>
	<link rel="stylesheet" href="css/login.css">
</head>
<body>
	<article class="login">
		<p class="title">Enter a ninja turtle in the username field.</p>
		<form action="login.php" method="post">
			<?php echo $error; ?>
			<label for="">Username:</label>
			<input type="text" name="username">
			
			<label for="">Password:</label>
			<input type="password" name="password">
			
			<input type="submit" value="Log In">
			<input type="hidden" name="form">
		</form>
	</article>

	<!-- BROWSER SYNC -->
<script type='text/javascript'>//<![CDATA[
    document.write("<script async src='//HOST:3000/browser-sync/browser-sync-client.1.5.4.js'><\/script>".replace(/HOST/g, location.hostname).replace(/PORT/g, location.port));
//]]></script>
</body>
</html>