//defining global function with improved console.log
var Logger = function(message){
	console.log(new Date(Date.now()), " - ", message);
}