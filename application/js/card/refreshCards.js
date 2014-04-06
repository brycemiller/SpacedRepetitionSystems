/**
 * Refreshes the card grid according to the selected
 * node in the category tree
 * 
 * @return unit
 */
function refreshCards(){
	var cp = Ext.getCmp('categoryPane');
	var node = cp.getSelectionModel().getSelectedNode();
	var cardGrid = Ext.getCmp('cardGrid');
	if(node.id){
		cardGrid.store.load({params: {'category_id': node.id}});
	}
}