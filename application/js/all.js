var mask = new Ext.LoadMask(Ext.getBody(), {msg:"Please wait...", removeMask: true});
mask.show();

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

function bulkUpload(){
	var ncf = new Ext.FormPanel({
		id: 'buf',
		fileUpload: true,
		labelWidth: 100,
	    frame: true,
	    title: 'Bulk Upload',
	    bodyStyle: 'padding:5px 5px 0',
	    width: 495,
	    height: 450,
	    defaults: {width: 230},
	    items: [fileUpload('File', 'file'), comboBox('Parent Category', 'parent_id')],
		buttons: [actionButton('Upload', 'silk-folder-go', 
				'php/category/bulkUpload.php', 'Uploading', 'buf', refreshCategories), 
						cancelButton('buf')]
	});
	
	return ncf;
}

function refreshCategories(){
	var cp = Ext.getCmp('categoryPane');
	var catMask = new Ext.LoadMask('categoryPane', {msg:"Loading categories...", removeMask: true});
	catMask.show();
	var root = cp.getRootNode();
	cp.getLoader().load(root, function(){catMask.hide();});
	root.expand();
}

function newCategory(){
	var ncf = new Ext.FormPanel({
		id: 'ncf',
		labelWidth: 100,
	    frame: true,
	    title: 'New Category',
	    bodyStyle: 'padding:5px 5px 0',
	    width: 495,
	    height: 450,
	    defaults: {width: 230},
	    items: [textField('Name', 'name'), comboBox('Parent Category', 'parent_id')],
		buttons: [actionButton('Add', 'silk-folder-add', 
				'php/category/newCategory.php', 'Adding Category', 'ncf', refreshCategories), 
						cancelButton('ncf')]
	});
	
	return ncf;
}

function editCategory(){
	var ecf = new Ext.FormPanel({
		id: 'ecf',
		labelWidth: 100,
	    frame: true,
	    title: 'Edit Category',
	    bodyStyle: 'padding:5px 5px 0',
	    width: 495,
	    height: 450,
	    defaults: {width: 230},
	    items: [comboBox('Category', 'category_id'), 
	            textField('New Name', 'name'), comboBox('New Parent Category', 'parent_id')],
		buttons: [actionButton('Update', 'silk-folder-edit', 
				'php/category/editCategory.php', 'Updating category', 'ecf', refreshCategories),
						cancelButton('ecf')]
	});
	
	return ecf;
}

function deleteCategory(){
	var dcf = new Ext.FormPanel({
		id: 'dcf',
		labelWidth: 100,
	    frame: true,
	    title: 'Delete Category',
	    bodyStyle: 'padding:5px 5px 0',
	    width: 495,
	    height: 450,
	    defaults: {width: 230},
	    items: [comboBox('Delete', 'category_id')],
		buttons: [actionButton('Delete', 'silk-folder-delete', 
				'php/category/deleteCategory.php', 'Removing category', 'dcf', refreshCategories),
						cancelButton('dcf')]
	});
	
	return dcf;
}

var categoryMenu = new Ext.menu.Menu({
	items: [menuItem('rcm', 'Refresh Categories', 'silk-arrow-refresh', refreshCategories, false),'-',
	    menuItem('ncm', 'Add Category', 'silk-folder-add', newCategory),
		menuItem('ecm', 'Edit Category', 'silk-folder-edit', editCategory),
		menuItem('dcm', 'Delete Category', 'silk-folder-delete', deleteCategory),'-',
		menuItem('bucm', 'Bulk Upload', 'silk-folder-go', bulkUpload)],
	listeners: {
        itemclick: function(item){
        	switch(item.id){
            	case 'ncm':
            		var n = Ext.getCmp('categoryPane').getSelectionModel().getSelectedNode();
            		if (n != null && (n.parentNode || n.text == 'All')) {
            			var ncfl = Ext.getCmp('ncf');
            			var tf = ncfl.get(0);
            			var cb = ncfl.get(1);
            			cb.getStore().load({callback: function(){cb.setValue(n.id)}});
            			tf.setValue('New Category');
            		}
            		break;
		        case 'ecm':
		        	var n = Ext.getCmp('categoryPane').getSelectionModel().getSelectedNode();
            		if (n != null && n.parentNode) {
            			var ecfl = Ext.getCmp('ecf');
            			var cb = ecfl.get(0);
            			var tf = ecfl.get(1);
            			var nb = ecfl.get(2);
            			cb.getStore().load({callback: function(){cb.setValue(n.id);}});
            			nb.getStore().load({callback: function(){nb.setValue(n.parentNode.id);}});
            			tf.setValue(n.attributes['name']);
            		}
	        		break;
		        case 'dcm':
		        	var n = Ext.getCmp('categoryPane').getSelectionModel().getSelectedNode();
            		if (n != null && n.parentNode) {
            			var cb = Ext.getCmp('dcf').get(0);
            			cb.getStore().load({callback: function(){cb.setValue(n.id)}});
            		}
	        		break;
		        case 'bucm':
		        	var n = Ext.getCmp('categoryPane').getSelectionModel().getSelectedNode();
            		if (n != null && (n.parentNode || n.text == 'All')) {
            			var ncfl = Ext.getCmp('buf');
            			var tf = ncfl.get(0);
            			var cb = ncfl.get(1);
            			cb.getStore().load({callback: function(){cb.setValue(n.id)}});
            			tf.setValue('Upload File');
            		}
		        	break;
		        case 'crv':
		        	var n = Ext.getCmp('categoryPane').getSelectionModel().getSelectedNode();
		        	var ct = Ext.getCmp('rf').get(0);
		        	ct.getStore().load({callback: function(){ct.setValue(n.id);}});
		        	break;
        	}
	    }
	}
});

/*!
 * Ext JS Library 3.0.0
 * Copyright(c) 2006-2009 Ext JS, LLC
 * licensing@extjs.com
 * http://www.extjs.com/license
 */
var categoryPane = new Ext.tree.TreePanel({
	id: 'categoryPane',
    autoScroll: true,
    animate: true,
    enableDD: false,
    containerScroll: true,
    border: true,
    width: 200,
    height: 450,
    
    dataUrl: 'php/category/categoryPane.php',

    root: {
        nodeType: 'async',
        text: 'All',
        draggable: false,
        id: '0'
    },
    rootVisible: false,
	
	contextMenu: categoryMenu,
	
	listeners: {
        contextmenu: function(node, e) {
			node.select();
            var c = node.getOwnerTree().contextMenu;
            c.contextNode = node;
            c.showAt(e.getXY());
        }
    }
});

categoryPane.on('click', function(node, e){
	cardGrid.store.load({
		params: {'category_id': node.id}
	});
});

categoryPane.render('leftColumn');
var catMask = new Ext.LoadMask('categoryPane', {msg:"Loading categories...", removeMask: true});
catMask.show();
categoryPane.getRootNode().expand(false, true, function(){catMask.hide();});

function getSelectedCategory(){
	return categoryPane.getSelectionModel().getSelectedNode();
}

function refreshCards(){
	var cp = Ext.getCmp('categoryPane');
	var node = cp.getSelectionModel().getSelectedNode();
	var cardGrid = Ext.getCmp('cardGrid');
	if(node.id){
		cardGrid.store.load({params: {'category_id': node.id}});
	}
}

function newCard(){
	var ncrf = new Ext.FormPanel({
		id: 'ncrf',
		labelWidth: 100,
	    frame: true,
	    title: 'New Card',
	    bodyStyle: 'padding:5px 5px 0',
	    width: 495,
	    height: 450,
	    defaults: {width: 230},
	    items: [textArea('Question', 'question'), textArea('Answer', 'answer'), 
	            comboBox('Category', 'category_id', 
	            		'php/category/getCategories.php')],
		buttons: [actionButton('Add', 'silk-application-add', 
				'php/card/newCard.php', 'Adding card', 'ncrf', refreshCards),
						cancelButton('ncrf')]
	});
	
	return ncrf;
}

function editCard(){
	var ecrf = new Ext.FormPanel({
		id: 'ecrf',
		labelWidth: 100,
	    frame: true,
	    title: 'Edit Card',
	    bodyStyle: 'padding:5px 5px 0',
	    width: 495,
	    height: 450,
	    defaults: {width: 230},
	    items: [comboBox('Card', 'card_id', 
	    		'php/card/getCards.php?category_id='+getSelectedCategory().id),
	    		textArea('Question', 'question'), textArea('Answer', 'answer'),
	    		comboBox('New Category', 'category_id', 
	    	    		'php/category/getCategories.php')],
		buttons: [actionButton('Update', 'silk-application-add', 
				'php/card/editCard.php', 'Updating card', 'ecrf', refreshCards),
						cancelButton('ecrf')]
	});
	
	return ecrf;
}

function deleteCard(){
	var dcrf = new Ext.FormPanel({
		id: 'dcrf',
		labelWidth: 100,
	    frame: true,
	    title: 'Delete Card',
	    bodyStyle: 'padding:5px 5px 0',
	    width: 495,
	    height: 450,
	    defaults: {width: 230},
	    items: [comboBox('Delete', 'card_id', 
	    		'php/card/getCards.php?category_id='+getSelectedCategory().id)],
		buttons: [actionButton('Delete', 'silk-folder-delete', 
				'php/card/deleteCard.php', 'Removing card', 'dcrf', refreshCards),
						cancelButton('dcrf')]
	});
	
	return dcrf;
}

var cardMenu = new Ext.menu.Menu({
	items: [menuItem('rcrm', 'Refresh Cards', 'silk-arrow-refresh', refreshCards, false),'-',
	    menuItem('ncrm', 'Add Card', 'silk-application-add', newCard),
		menuItem('ecrm', 'Edit Card', 'silk-application-edit', editCard),
		menuItem('dcrm', 'Delete Card', 'silk-application-delete', deleteCard),'-',
		menuItem('bucrm', 'Bulk Upload', 'silk-application-go', bulkUpload)],
	listeners: {
        itemclick: function(item){
        	switch(item.id){
            	case 'ncrm':
            		var n = Ext.getCmp('categoryPane').getSelectionModel().getSelectedNode();
            		if (n != null && (n.parentNode || n.text == 'All')) {
            			var ncrfl = Ext.getCmp('ncrf');
            			var qf = ncrfl.get(0);
            			var af = ncrfl.get(1);
            			var cb = ncrfl.get(2);
            			cb.getStore().load({callback: function(){cb.setValue(n.id)}});
            			qf.setValue('New Question');
            			af.setValue('New Answer');
            		}
            		break;
		        case 'ecrm':
		        	var n = Ext.getCmp('categoryPane').getSelectionModel().getSelectedNode();
		        	var r = Ext.getCmp('cardGrid').getSelectionModel().getSelected();
		        	if(r != null){
            			var ecrfl = Ext.getCmp('ecrf');
            			var cr = ecrfl.get(0);
            			var qu = ecrfl.get(1);
            			var an = ecrfl.get(2);
            			var ct = ecrfl.get(3);
            			cr.getStore().load({callback: function(){cr.setValue(r.get('id'));}});
            			ct.getStore().load({callback: function(){ct.setValue(n.id);}});
            			qu.setValue(r.get('question'));
            			an.setValue(r.get('answer'));
		        	}
	        		break;
		        case 'dcrm':
		        	var r = Ext.getCmp('cardGrid').getSelectionModel().getSelected();
            		if (r != null) {
            			var cb = Ext.getCmp('dcrf').get(0);
            			cb.getStore().load({callback: function(){cb.setValue(r.get('id'))}});
            		}
	        		break;
		        case 'bucrm':
		        	var n = Ext.getCmp('categoryPane').getSelectionModel().getSelectedNode();
            		if (n != null && (n.parentNode || n.text == 'All')) {
            			var ncfl = Ext.getCmp('buf');
            			var tf = ncfl.get(0);
            			var cb = ncfl.get(1);
            			cb.getStore().load({callback: function(){cb.setValue(n.id)}});
            			tf.setValue('Upload File');
            		}
		        	break;
		        	break;
		        case 'crrv':
		        	var n = Ext.getCmp('categoryPane').getSelectionModel().getSelectedNode();
		        	var ct = Ext.getCmp('rf').get(0);
		        	ct.getStore().load({callback: function(){ct.setValue(n.id);}});
		        	break;
        	}
	    }
	}
});

/*!
 * Ext JS Library 3.0.0
 * Copyright(c) 2006-2009 Ext JS, LLC
 * licensing@extjs.com
 * http://www.extjs.com/license
 */
var cardGridStore = new Ext.data.ArrayStore({
	autoSave: true,
	url: 'php/card/cardGrid.php',
    fields: [
       {name: 'id', type: 'int'},
       {name: 'category_id', type: 'int'},
       {name: 'question', type: 'string'},
       {name: 'answer', type: 'string'},
       {name: 'hint', type: 'string'},
       {name: 'last_test', type: 'date', dateFormat: 'Y-m-d H:i:s'},
       {name: 'next_test', type: 'date', dateFormat: 'Y-m-d H:i:s'},
       {name: 'total_test', type: 'int'},
       {name: 'tests_passed', type: 'int'},
       {name: 'pass_rate', type: 'float'}
    ]
});

function percentage(val){
	val = (val*100)+'';
	if(val != '100')
		val = val.substring(0,2);
	
	return val+'%';
}

function date(val){
	var curDate = Date.parseDate(new Date().format('Y-m-d H:i:s'), 'Y-m-d H:i:s');
	var nullDate = Date.parseDate('0000-00-00 00:00:00', 'Y-m-d H:i:s');
	var renderer = Ext.util.Format.dateRenderer('Y m d');
	
	//If card up for review
	if(val.between(nullDate, curDate))
		return '<span style="color:green">'+renderer(val)+'</span>';
	
	return renderer(val);
}

var cardGrid = new Ext.grid.GridPanel({
	id: 'cardGrid',
    store: cardGridStore,
    columns: [
        {id: 'Question', header: 'Question', sortable: true, dataIndex: 'question'},
        {id: 'Pass Rate', header: 'Pass Rate', sortable: true, renderer: percentage, dataIndex: 'pass_rate', width: 75, fixed: true, align: 'right'},
        {id: 'Last Test', header: 'Last Test', sortable: true, renderer: Ext.util.Format.dateRenderer('Y m d'), dataIndex: 'last_test', width: 75, fixed: true, align: 'center'},
        {id: 'Next Test', header: 'Next Test', sortable: true, renderer: date, dataIndex: 'next_test', width: 75, fixed: true, align: 'center'}
    ],
    stripeRows: true,
    autoExpandColumn: 'Question',
    width: 495,
    height: 450,
    
    contextMenu: cardMenu,
	
	listeners: {
		headercontextmenu: function(grid, colIndex, e){
			e.stopEvent();
			grid.contextMenu.showAt(e.getXY());
		},
		rowcontextmenu: function(grid, rowIndex, e){
			e.stopEvent();
			grid.getSelectionModel().selectRow(rowIndex);
			grid.contextMenu.showAt(e.getXY());
		}
    }
});
cardGrid.render('rightColumn');

function reviewCallBack(form, action){
	var card = action.result.card;
	
	if(card.length == 0){
		Ext.getCmp('rbt').enable();
		Ext.getCmp('rpf2').hide();
		refreshCards();
		cardGrid.render('rightColumn');
		return;
	}
	
	id = card[0];
	q = card[1];
	a = card[2];
	
	rpf = reviewPanel(id, q, a);
	formHandler2(rpf, rpf.getId())();
}

function review(b){
	var k = new function(){
		var rf = new Ext.FormPanel({
			id: 'rf',
			labelWidth: 100,
		    frame: true,
		    title: 'Review!',
		    bodyStyle: 'padding:5px 5px 0',
		    width: 495,
		    height: 450,
		    defaults: {width: 230},
		    items: [comboBox('Review Category', 'category_id')],
			buttons: [actionButton('Review', 'silk-page-go', 
					'php/review/reviewStart.php', 'Fetching Cards', 'rf',
					reviewCallBack), {text: 'Cancel',
										iconCls: 'silk-cancel',
										handler: function(){
													b.enable();
													Ext.getCmp('rf').hide();
													cardGrid.show();
												}
										}]
		});
		
		return rf;
	}
	
	return k;
}

function reviewPanel(id, question, answer){
	question = '<font size="4">'+question+'</font>';
	answer = '<font size="4">'+answer+'</font>';
	
	var rpf = new Ext.FormPanel({
		id: 'rpf',
		labelWidth: 100,
		frame: true,
		title: 'Review!',
		bodyStyle: 'padding:5px 5px 0',
	    width: 495,
	    height: 450,
	    items: [new Ext.Panel({autoScroll: true, html: question, height: 180, width: 450}),
	            {xtype:'hidden', name: 'a', value:'b'}],
	    buttons: [genericButton('Show Answer', 'silk-page-go', 
	    				function(){return showAnswer(id, question, answer)}, 'sab'),
	    			actionButton('Later', 'silk-arrow-refresh',
	    					'php/review/reviewContinuous.php?instruction=skip', 'Recycling Card',
	    					'rpf', reviewCallBack, 'recb')]
	});
	
	return rpf;
}

function reviewPanel2(id, question, answer){
	var rpf = new Ext.FormPanel({
		id: 'rpf2',
		labelWidth: 100,
		frame: true,
		title: 'Review!',
		bodyStyle: 'padding:5px 5px 0',
	    width: 495,
	    height: 450,
	    items: [new Ext.Panel({autoScroll: true, html: question, height: 180, width: 450}),
	            new Ext.Panel({autoScroll: true, html: answer, height: 180, width: 450}),
	            {xtype:'hidden', name: 'a', value:'b'}],
	    buttons: [actionButton('Correct', 'silk-accept', 
					'php/review/reviewContinuous.php?instruction=correct&card_id='+id, 'Fetching Next Card',
					'rpf2', reviewCallBack),
					actionButton('Again', 'silk-arrow-refresh', 
							'php/review/reviewContinuous.php?instruction=wrong&card_id='+id, 'Recycling Card',
							'rpf2', reviewCallBack)]
	});
	
	return rpf;
}

function showAnswer(id, q, a){
	rpf2 = reviewPanel2(id, q, a);
	formHandler2(rpf2, rpf2.getId())();
}

var tb = new Ext.Toolbar({height: 60, width: 700});
tb.add(
	toolbarButton('acc', 'My Account', 'silk-user-female-32', new Ext.menu.Menu({
			items: [menuItem('lom', 'Log out', 'silk-door-open', function(){window.location = 'php/login/logout.php';}, false)]
		})
	),
	toolbarButton('cat', 'Category', 'silk-folder-32', categoryMenu),
	toolbarButton('card', 'Card', 'silk-application-32', cardMenu),
	new Ext.Toolbar.Button({
		id: 'rbt',
		text: 'Review!',
		iconAlign: 'top',
		iconCls: 'silk-page-go-32',
		handler: function(b, e){
			b.disable();
			var k = formHandler2(review(b), 'rf')();
			if(k){
	        	var n = Ext.getCmp('categoryPane').getSelectionModel().getSelectedNode();
	        	var ct = Ext.getCmp('rf').get(0);
	        	if(n != null){
	        		ct.getStore().load({callback: function(){ct.setValue(n.id);}});
	        	}
			}
        },
		height: 60,
		width: 80,
		scale: 'large'
	})
)
tb.render('topRow');

function inlineSuggest(){
	var is = new Ext.FormPanel({
		id: 'is',
		labelWidth: 255,
		frame: false,
		bodyStyle: 'padding:5px 5px 0',
		height: 65,
		border: false,
		items: [textField('Problem?  Suggestion?  Tell us - we\'re listening', 
					'suggestion', 200)],
		buttons: [actionButton('Suggest', 'silk-accept', 'php/suggest/inlineSuggestion.php', 
					'Thanks, we\'ll get on it right away', 'is', isClean)]
	});
	
	return is;
}

function isClean(){
	var c = Ext.getCmp('is');
	c.get(0).setValue('');
	c.show();
}

var is = new inlineSuggest();
is.render('inlineSuggestForm');	

mask.hide();
