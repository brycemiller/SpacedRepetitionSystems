function RPC(){
	
	var params;	// param array
	var method;	// method name
	
	this.setMethod = function(method){ this.method = method; }
	this.setParams = function(params){ this.params = params; }
	this.addParam = function(key, value){
		if(!this.params)
			this.params = new function(){};
		
		this.params[key] = value;
	}
}