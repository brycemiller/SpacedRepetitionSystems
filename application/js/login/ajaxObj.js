function ajaxObj(){
	
	this.sendRequest = sendRequest;
	
	/**
	 * Sends an ajax request to a given url, with a given payload,
	 * calling a given callback when the response arrives.
	 * 
	 * Used for nicing ajax requests.
	 * 
	 * @param url			the url the reqeust will be sent to
	 * @param params		an array of params to be sent 
	 * @param callBack		a callback function which is called
	 * 						when a response has been received.
	 * @return				unit
	 */
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
	
	// returns a new request object
	function newRequest(){
		var request = window.ActiveXObject ? new ActiveXObject("Microsoft.XMLHTTP") : new XMLHttpRequest();
		
		return request;
	}
	
	// returns a function which calls the callback when the 
	// request object's ready states has changed
	function ready(request, callBack){
		return function(){
			if(request.readyState == 4){
				request.onreadystatechange = null;
				callBack(JSON.parse(request.responseText));
			}
		}
	}
}