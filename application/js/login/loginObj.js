function loginObj(){
	
	var loginForm;
	var progress;
	
	this.login = login;
	this.callBack = callBack;
	this.showMessage = showMessage;
	
	function login(username, password){
		if(username == '' || password == '')
			return this.showMessage('Please enter both your username and your password');
			
		var params = new RPC();
		params.setMethod('login');
		params.addParam('username', username);
		params.addParam('password', hex_md5(hex_md5(password)+chap));
		
		this.progress = Ext.MessageBox.progress('Logging in', 'Logging in...');
		this.progress.updateProgress(.25, 'Sending details to server');
		
		ajax.sendRequest('php/login/login.php', params, callBack(this.progress));
		this.progress.updateProgress(.5, 'Receiving server response');
		
		return false;
	}
	
	// returns the callback function for logging in
	function callBack(progress){
		return function(response){
			progress.updateProgress(.75, 'Managing Reponse');
			if(response.success == 'success'){
				// success
				progress.updateProgress(1, 'Redirecting to SRS');
				
				// redirect
				window.location = 'srs.php';
			}
			else{
				// failure
				progress.updateProgress(1, 'Managing Reponse');
				
				// make new chap, show message
				chap = response.chap;
				showMessage(response.message);
			}
		}
	}
	
	// displays an error message
	function showMessage(message){
		Ext.Msg.show({
			title: 'Oops',
			msg: message,
			buttons: Ext.Msg.OK,
			icon: Ext.MessageBox.WARNING
		});
	}
}