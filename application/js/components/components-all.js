function actionButton(text, icon, url, waitMsg, item, cb, id){
	var b;
	
	if(id){
		b = {
			text: text,
			iconCls: icon,
			handler: function(){
				var c = Ext.getCmp(item);
				
				c.getForm().submit({
					url: url,
					waitMsg: waitMsg,
					success: cb,
					failure: reportError
				});
				
				c.hide();
				cardGrid.show();
			}
		};
	}
	else{
		b = {
			text: text,
			iconCls: icon,
			handler: function(){
				var c = Ext.getCmp(item);
				
				c.getForm().submit({
					url: url,
					waitMsg: waitMsg,
					success: cb,
					failure: reportError
				});
				
				c.hide();
				cardGrid.show();
			}
		};
	}
	
	return b;
}

function cancelButton(item){
	var c = {
		text: 'Cancel',
		iconCls: 'silk-cancel',
		handler: function(){Ext.getCmp(item).hide(); cardGrid.show();}
	};
	
	return c;
}

function genericButton(text, icon, handler, id){
	var b;
	
	if(id){
		b = {
				id: id,
				text: text,
				iconCls: icon,
				handler: handler
		};
	}
	else{
		b = {
				text: text,
				iconCls: icon,
				handler: handler
		};
	}
	
	return b;
}

function comboBox(label, name, url){
	
	if(!url)
		url = 'php/category/getCategories.php';
	
	var c = new Ext.form.ComboBox({
				fieldLabel: label,
				name: name,
				layout: 'anchor',
				readOnly: true,
				triggerAction: 'all',
				store: new Ext.data.ArrayStore({
					url: url,
					fields: [
					         {name: 'value', type: 'int'},
					         {name: 'text', type: 'string'}
					         ]
				}),
				hiddenName: name,
				valueField: 'value',
				displayField: 'text',
				emptyText: 'Press down ... ',
				mode: 'remote',
				listWidth: 230
	});
	
	return c;
}

function fileUpload(label, name, width, disabled, value){
	var t;
	
	if(!disabled)
		disabled = false;
	
	if(!value)
		value = '';
	
	if(!width){
		t = {
			fieldLabel: label,
			name: name,
			layout: 'anchor',
			xtype: 'textfield',
			disabled: disabled,
			value: value,
			inputType : 'file'
		};
	}
	else{
		t = {
			fieldLabel: label,
			name: name,
			layout: 'anchor',
			xtype: 'textfield',
			width: width,
			disabled: disabled,
			value: value,
			inputType : 'file'
		};
	}
	
	return t;
}

function formHandler(form, id){
	return function(){
		hide(['cardGrid', 'ncf', 'ecf', 'dcf', 'ncrf', 'ecrf', 'dcrf', 'rf', 'rpf', 'rpf2'], id);
		var f = form();
		f.render('rightColumn');
		f.show();
		
		return true;
	};
}

function formHandler2(form, id){
	return function(){
		hide(['cardGrid', 'ncf', 'ecf', 'dcf', 'ncrf', 'ecrf', 'dcrf', 'rf', 'rpf', 'rpf2'], id);
		var f = form;
		f.render('rightColumn');
		f.show();
		
		return true;
	};
}

function hide(arg, exclude){
	for(i = 0; i < arg.length; i++){
		cmp = Ext.getCmp(arg[i]);
		if(cmp != null && arg[i] != exclude)
			cmp.hide();
	}
}

function menuItem(id, text, icon, handler, formHandlerBool){
	if(formHandlerBool == null || formHandlerBool){
		return {id: id,
				text: text, 
				iconCls: icon, 
				handler: formHandler(handler, id)}
	}
	else{
		return {id: id,
				text: text,
				iconCls: icon,
				handler: handler};
	}
}

function reportError(form, action){	
	Ext.Msg.alert('Error', action.result.errorMessage);
}

function textArea(label, name){
	var t = {
		fieldLabel: label,
		name: name,
		layout: 'anchor',
		xtype: 'textarea'
	};
	
	return t;
}

function textField(label, name, width, disabled, value){
	var t;
	
	if(!disabled)
		disabled = false;
	
	if(!value)
		value = '';
	
	if(!width){
		t = {
			fieldLabel: label,
			name: name,
			layout: 'anchor',
			xtype: 'textfield',
			disabled: disabled,
			value: value
		};
	}
	else{
		t = {
			fieldLabel: label,
			name: name,
			layout: 'anchor',
			xtype: 'textfield',
			width: width,
			disabled: disabled,
			value: value
		};
	}
	
	return t;
}

function toolbarButton(id, text, icon, menu){	
	var t = new Ext.Toolbar.Button({
		id: id,
		text: text,
		arrowAlign: 'right',
		iconAlign: 'top',
		iconCls: icon,
		height: 60,
		width: 80,
		scale: 'large',
		menu: menu
	});
	
	return t;
}
