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
