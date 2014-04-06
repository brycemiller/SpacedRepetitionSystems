function textField(label, name) {
    var t = {
        fieldLabel: label,
        name: name,
        layout: 'anchor',
        xtype: 'textfield'
    };
    return t;
}

function loginForm(){
	var password = textField('Password', 'password');
	password.inputType = 'password';
	
	var lf = new Ext.FormPanel({
		id: 'lf',
		labelWidth: 100,
	    frame: true,
	    title: 'Login',
	    bodyStyle: 'padding:5px 5px 0',
	    width: 400,
	    height: 100,
	    defaults: {width: 230},
	    items: [textField('Username', 'username'), password],
		buttons: [{
			text: 'Log in',
			iconCls: 'silk-door-in',
			handler: function(){
				var lf = Ext.getCmp('lf');
				login.login(lf.get(0).getValue(), lf.get(1).getValue());
			}
		}]
	});
	
	return lf;
}

function RPC(){
	
	var params;
	var method;
	
	this.setMethod = function(method){ this.method = method; }
	this.setParams = function(params){ this.params = params; }
	this.addParam = function(key, value){
		if(!this.params)
			this.params = new function(){};
		
		this.params[key] = value;
	}
}

function ajaxObj(){
	
	this.sendRequest = sendRequest;
	
	function sendRequest(url, params, callBack){
		var request = newRequest();
		params = JSON.stringify(params);
				
		request.finished = false;
		request.open('POST', url, true);
		request.onreadystatechange = ready(request, callBack);
		request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
		request.send('req='+params);
	}
	
	function newRequest(){
		var request = window.ActiveXObject ? new ActiveXObject("Microsoft.XMLHTTP") : new XMLHttpRequest();
		
		return request;
	}
	
	function ready(request, callBack){
		return function(){
			if(request.readyState == 4){
				request.onreadystatechange = null;
				callBack(JSON.parse(request.responseText));
			}
		}
	}
}

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
	
	function callBack(progress){
		return function(response){
			progress.updateProgress(.75, 'Managing Reponse');
			if(response.success == 'success'){
				progress.updateProgress(1, 'Redirecting to SRS');
				window.location = 'srs.php';
			}
			else{
				progress.updateProgress(1, 'Managing Reponse');
				chap = response.chap;
				showMessage(response.message);
			}
		}
	}
	
	function showMessage(message){
		Ext.Msg.show({
			title: 'Oops',
			msg: message,
			buttons: Ext.Msg.OK,
			icon: Ext.MessageBox.WARNING
		});
	}
}

var ajax = ajax || new ajaxObj();
var login = login || new loginObj();
loginForm().render('main');
