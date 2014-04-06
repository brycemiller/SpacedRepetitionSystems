/**
 * Nices the display of the form, passed in via the
 * form generating function.
 * 
 * This one should probably be version 2, but it is
 * used more often than formHandler2 is.  Perhaps a
 * better name would be 'formFunctionHandler' or the
 * like.
 * 
 * @param form		a function which returns a form
 * @param id		a unique id
 * 
 * @return			true
 */
function formHandler(form, id){
	return function(){
		hide(['cardGrid', 'ncf', 'ecf', 'dcf', 'ncrf', 'ecrf', 'dcrf', 'rf', 'rpf', 'rpf2'], id);
		var f = form();
		f.render('rightColumn');
		f.show();
		
		return true;
	};
}

/**
 * Nices the display of the passed-in form
 * 
 * See also discussion above in formHandler
 * 
 * @param form		a form
 * @param id		a unique id
 * 
 * @return			true
 */
function formHandler2(form, id){
	return function(){
		hide(['cardGrid', 'ncf', 'ecf', 'dcf', 'ncrf', 'ecrf', 'dcrf', 'rf', 'rpf', 'rpf2'], id);
		var f = form;
		f.render('rightColumn');
		f.show();
		
		return true;
	};
}

/**
 * Convenience method for formHandler[2],
 * which hides any element within a given set
 * of ids, except ones specifically excluded
 * 
 * @param arg		array of ids of items to hide
 * @param exclude	id of the item to *not* hide
 * @return			unit
 */
function hide(arg, exclude){
	for(i = 0; i < arg.length; i++){
		cmp = Ext.getCmp(arg[i]);
		if(cmp != null && arg[i] != exclude)
			cmp.hide();
	}
}