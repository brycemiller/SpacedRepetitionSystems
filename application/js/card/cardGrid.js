/*!
 * Ext JS Library 3.0.0
 * Copyright(c) 2006-2009 Ext JS, LLC
 * licensing@extjs.com
 * http://www.extjs.com/license
 */
/**
 * A data store containing all the cards for a given category.
 * 
 * Fields:
 * 		id					unique id for this card
 * 		category_id			the category this card is in
 * 		question			the front side of the card
 * 		answer				the back side of the card
 * 		hint				a hint at the answer (not in use)
 * 		last_test			date of last test
 * 		next_test			expected date of next test
 * 		total_test			total number of times the user
 * 							has tested on this card
 * 		tests_passed		number of tests passed
 * 		pass_rate			% passes (for convenience) as float
 * 
 * Sections of this grid store code are based on previous work by 
 * the ExtJS team.
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

/**
 * Takes a float and converts it to a percentage
 * 
 * @param val	a float
 * @return		val as a percentage (with %-sign)
 */
function percentage(val){
	// Multiply by 100 and cast as string
	val = (val*100)+'';// <-- bit of a hack, thanks to how javascript does typing
	if(val != '100')
		val = val.substring(0,2); // just take the first two characters
	
	return val+'%';
}

/**
 * Formats a next_test date, and returns it in green if the
 * date is before the current date (i.e., the card is ready
 * for review)
 * 
 * @param val	A next_test date
 * @return		The date, formatted YYYY MM DD.
 */
function date(val){
	var curDate = Date.parseDate(new Date().format('Y-m-d H:i:s'), 'Y-m-d H:i:s');
	var nullDate = Date.parseDate('0000-00-00 00:00:00', 'Y-m-d H:i:s');
	var renderer = Ext.util.Format.dateRenderer('Y m d');
	
	//If card up for review
	if(val.between(nullDate, curDate))
		return '<span style="color:green">'+renderer(val)+'</span>';
	
	return renderer(val);
}

// Instantiate card grid
var cardGrid = new Ext.grid.GridPanel({
	id: 'cardGrid',
    store: cardGridStore,
    // Columns to display: Question, Pass Rate (%), Last Test (date), Next Test (date)
    // Next Test will display in green if card is ready for review
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
	
    // Connect up card/cardMenu.js with the grid's context menus
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

// Display card grid
cardGrid.render('rightColumn');