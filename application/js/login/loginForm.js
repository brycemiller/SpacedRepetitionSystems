/**
 * Creates a new login form with a username
 * field and a password field.  Calls
 * LoginFunction->login on submit.
 * 
 * @return	a new login form
 */
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